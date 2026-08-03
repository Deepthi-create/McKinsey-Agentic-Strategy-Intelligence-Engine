"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../../lib/api";
import { setUser } from "../../../redux/store";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input, Select } from "../../../components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "consultant" });
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/signup", form);
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      dispatch(setUser(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Create account</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={submit}>
            {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
            <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <Select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="consultant">Consultant</option><option value="reviewer">Reviewer</option><option value="admin">Admin</option>
            </Select>
            <Button>Signup</Button>
            <p className="text-sm text-muted-foreground">Already registered? <Link className="text-primary" href="/login">Sign in</Link></p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
