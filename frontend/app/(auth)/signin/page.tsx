"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export default function SignInPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError(t("auth.emailRequired"));
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("auth.invalidEmail"));
      setLoading(false);
      return;
    }

    try {
      await signIn({ email, password });
      window.location.href = "/tasks";
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.signInFailed"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-morph" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Left Side - Clean Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-8 shadow-2xl shadow-violet-500/30">
            <CheckCircleSolid className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
            {t("auth.signIn.title")}
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-md mx-auto">
            {t("auth.signIn.subtitle")}
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">10K+</div>
              <div className="text-sm text-white/40">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">99.9%</div>
              <div className="text-sm text-white/40">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">50ms</div>
              <div className="text-sm text-white/40">Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Glassmorphism card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 rounded-[2rem] blur-xl" />

            <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] p-8 sm:p-10 border border-white/10 shadow-2xl">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                  <CheckCircleSolid className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-white mb-2">{t("auth.signIn.title")}</h2>
                <p className="text-white/50">
                  {t("auth.signIn.newUser")}{" "}
                  <Link
                    href="/signup"
                    className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                  >
                    {t("auth.signIn.createAccount")}
                  </Link>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">{t("auth.email")}</label>
                  <div className="relative group">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === "email" ? "text-violet-400 scale-110" : "text-white/40"}`}>
                      <EnvelopeIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`
                        w-full pl-12 pr-4 py-4 rounded-xl
                        bg-white/[0.05] backdrop-blur
                        text-white placeholder:text-white/30
                        border transition-all duration-300
                        ${focusedField === "email"
                          ? "border-violet-500/50 ring-4 ring-violet-500/10 bg-white/[0.08]"
                          : "border-white/10 hover:border-white/20"
                        }
                      `}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">{t("auth.password")}</label>
                  <div className="relative group">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === "password" ? "text-violet-400 scale-110" : "text-white/40"}`}>
                      <LockClosedIcon className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`
                        w-full pl-12 pr-12 py-4 rounded-xl
                        bg-white/[0.05] backdrop-blur
                        text-white placeholder:text-white/30
                        border transition-all duration-300
                        ${focusedField === "password"
                          ? "border-violet-500/50 ring-4 ring-violet-500/10 bg-white/[0.08]"
                          : "border-white/10 hover:border-white/20"
                        }
                      `}
                      placeholder={t("auth.password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-shake">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-sm text-red-400 font-medium">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    relative w-full py-4 rounded-xl font-semibold text-white
                    overflow-hidden group transition-all duration-300
                    ${loading
                      ? "bg-white/10 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
                    }
                  `}
                >
                  {/* Shimmer effect */}
                  {!loading && (
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  )}

                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("auth.signingIn")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      {t("auth.signIn.title")}
                      <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>

            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-white/30">
            TaskFlow - Modern Task Management
          </p>
        </div>
      </div>
    </div>
  );
}
