import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:8080/api";

export function resolveApiBaseURL(baseURL = process.env.NEXT_PUBLIC_API_URL) {
  const value = (baseURL || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");

  if (!value) return DEFAULT_API_BASE_URL;

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
