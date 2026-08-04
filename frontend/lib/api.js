import axios from "axios";

const LOCAL_API_BASE_URL = "http://localhost:8080/api";
const DEPLOYED_API_BASE_URL = "https://ai-market-strategy-engine.onrender.com/api";

function isLocalHostname(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isLocalApiURL(value) {
  try {
    const url = new URL(value, "http://localhost");
    return isLocalHostname(url.hostname);
  } catch {
    return false;
  }
}

export function getDefaultApiBaseURL(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
  return isLocalHostname(hostname) ? LOCAL_API_BASE_URL : DEPLOYED_API_BASE_URL;
}

export function resolveApiBaseURL(
  baseURL = process.env.NEXT_PUBLIC_API_URL,
  defaultBaseURL = getDefaultApiBaseURL(),
  hostname = typeof window !== "undefined" ? window.location.hostname : ""
) {
  const value = (baseURL || defaultBaseURL).trim().replace(/\/+$/, "");

  if (!value) return defaultBaseURL;
  if (!isLocalHostname(hostname) && isLocalApiURL(value)) return DEPLOYED_API_BASE_URL;

  try {
    const url = new URL(value, "http://localhost");
    const pathname = url.pathname.replace(/\/+$/, "");
    if (pathname === "/api" || pathname.startsWith("/api/")) return value;
  } catch {
    if (value === "/api" || value.startsWith("/api/")) return value;
  }

  return `${value}/api`;
}

export const api = axios.create({
  baseURL: resolveApiBaseURL(),
  timeout: 12000
});

api.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);
