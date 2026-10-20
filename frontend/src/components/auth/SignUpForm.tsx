"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { register } from "@/lib/auth";
import type { RegisterInput } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { LockIcon, UserIcon } from "@/components/ui/Icons";

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const first_name = (formData.get("first_name") ?? "").toString().trim();
    const last_name = (formData.get("last_name") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim().toLowerCase();
    const password = (formData.get("password") ?? "").toString();
    const password_confirm = (formData.get("password_confirm") ?? "").toString();

    if (!first_name || !last_name || !email || !password || !password_confirm) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    if (password !== password_confirm) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    const input: RegisterInput = { first_name, last_name, email, password, password_confirm };

    try {
      await register(input);
      setSuccess(
        "Account created successfully! Check your email for activation instructions, then sign in."
      );
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f4f6fa] px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <Image src="/images/logo.png" alt="BOB TRONICS" width={40} height={40} priority />
          </Link>
          <h1 className="text-2xl font-bold text-[#080D28] tracking-tight sm:text-3xl">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-[#4f5872]">
            Join BOB TRONICS and start shopping
          </p>
        </div>

        <Card className="bg-white shadow-[0_20px_40px_rgba(10,15,48,0.08)]">
          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#080D28]">
                  <span className="flex items-center gap-1.5">
                    <UserIcon size={16} />
                    Full Name
                  </span>
                </label>
                <div className="relative">
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                    placeholder="First name"
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#080D28]">
                  <span className="flex items-center gap-1.5">
                    <UserIcon size={16} />
                    Last Name
                  </span>
                </label>
                <div className="relative">
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                    placeholder="Last name"
                    className="pr-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#080D28]">
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#080D28]">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4f5872] hover:text-[#080D28] transition"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.11A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M6.72 6.72a18.45 18.45 0 0 0-5.06 5.94M9.9 19.87a10.07 10.07 0 0 1 5.06-5.94M12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-[#4f5872]">
                At least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#080D28]">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  aria-pressed={showConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4f5872] hover:text-[#080D28] transition"
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.11A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M6.72 6.72a18.45 18.45 0 0 0-5.06 5.94M9.9 19.87a10.07 10.07 0 0 1 5.06-5.94M12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="status" className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                {error}
              </p>
            )}
            {success && (
              <p role="status" className="text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100">
                {success}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading || !!success}
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-[#4f5872]">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </Card>

        <p className="mt-8 text-center text-xs text-[#7c818b]">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
}