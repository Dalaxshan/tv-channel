"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Tv, Eye, EyeOff } from "lucide-react";
import { Field, Input, Button } from "@/components/admin/ui/form-controls";
import { useToast } from "@/components/admin/toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.fieldErrors) setFieldErrors(json.fieldErrors);
        setFormError(json.error || "Login failed");
        setLoading(false);
        return;
      }

      toast.success(`Welcome back, ${json.data.name}`);
      router.push("/admin-panel/dashboard");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <Tv className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">TV Channel Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage your channel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl"
        >
          {formError && (
            <div className="rounded-md border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-300">
              {formError}
            </div>
          )}

          <Field label="Email address" htmlFor="email" error={fieldErrors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              hasError={Boolean(fieldErrors.email)}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tvchannel.com"
              required
            />
          </Field>

          <Field label="Password" htmlFor="password" error={fieldErrors.password}>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                hasError={Boolean(fieldErrors.password)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Button type="submit" loading={loading} className="mt-2 w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
