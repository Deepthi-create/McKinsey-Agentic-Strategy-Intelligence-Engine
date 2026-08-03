"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../../lib/api";
import { setUser } from "../../../redux/store";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      dispatch(setUser(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090B12] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(109,93,246,0.22),rgba(59,130,246,0.08)_32%,transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.58)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:3px_3px]" />
      <Card className="relative w-full max-w-md rounded-[18px] border border-white/[0.08] bg-[#10141F]/75 shadow-[0_28px_90px_rgba(0,0,0,0.55),0_0_70px_rgba(109,93,246,0.10)] backdrop-blur-2xl">
        <CardHeader className="px-8 pb-3 pt-8">
          <CardTitle className="text-3xl font-bold leading-tight tracking-[0.01em] text-white">
            Sign in
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-3">
          <form className="grid gap-5" onSubmit={submit}>
            {error && <p className="rounded-xl border border-red-400/20 bg-red-950/35 p-3 text-sm leading-6 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.08)]">{error}</p>}
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="h-12 rounded-xl border-white/[0.08] bg-[#090B12]/80 px-4 text-[15px] text-white shadow-inner shadow-black/20 placeholder:text-zinc-500 hover:border-white/15 focus:border-[#6D5DF6]/70 focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#3B82F6]/25"
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="h-12 rounded-xl border-white/[0.08] bg-[#090B12]/80 px-4 text-[15px] text-white shadow-inner shadow-black/20 placeholder:text-zinc-500 hover:border-white/15 focus:border-[#6D5DF6]/70 focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#3B82F6]/25"
            />
            <Button className="mt-1 h-12 w-full rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#6D5DF6] text-[15px] font-semibold text-white shadow-[0_14px_34px_rgba(109,93,246,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(109,93,246,0.36)] hover:brightness-110">
              Login
            </Button>
            <p className="pt-1 text-center text-sm leading-6 text-[#A1A1AA]">
              Need access?{" "}
              <Link className="bg-gradient-to-r from-[#3B82F6] to-[#6D5DF6] bg-clip-text font-semibold text-transparent transition-opacity duration-200 hover:opacity-85" href="/signup">
                Create an account
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
