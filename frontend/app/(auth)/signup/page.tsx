"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import Link from "next/link";
import {
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid, CheckIcon } from "@heroicons/react/24/solid";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signUp({ email, password, name: name || undefined });
      window.location.href = "/tasks";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      setLoading(false);
    }
  };

  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strength = getStrength();
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["from-red-500 to-red-400", "from-orange-500 to-amber-400", "from-yellow-500 to-lime-400", "from-emerald-500 to-teal-400"];

  const features = [
    { icon: BoltIcon, text: "Lightning fast performance", color: "from-amber-500 to-orange-500" },
    { icon: ShieldCheckIcon, text: "Bank-level security", color: "from-emerald-500 to-teal-500" },
    { icon: SparklesIcon, text: "Smart task suggestions", color: "from-violet-500 to-purple-500" },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950/50 via-[#0a0a0f] to-cyan-950/30" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] animate-morph" />
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
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-cyan-600 mb-8 shadow-2xl shadow-fuchsia-500/30">
            <SparklesIcon className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Start Your Journey
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-md mx-auto">
            Join thousands of productive people organizing their lives
          </p>

          {/* Features list */}
          <div className="space-y-4 text-left max-w-sm mx-auto">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur"
              >
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/80 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 relative z-10 py-8">
        <div className="w-full max-w-md">
          {/* Glassmorphism card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600/20 via-purple-600/20 to-cyan-600/20 rounded-[2rem] blur-xl" />

            <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] p-8 sm:p-10 border border-white/10 shadow-2xl">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-fuchsia-500/30">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-bold text-white mb-2">Create Account</h2>
                <p className="text-white/50">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                    Name <span className="text-xs text-white/30">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === "name" ? "text-fuchsia-400 scale-110" : "text-white/40"}`}>
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className={`
                        w-full pl-12 pr-4 py-3.5 rounded-xl
                        bg-white/[0.05] backdrop-blur
                        text-white placeholder:text-white/30
                        border transition-all duration-300
                        ${focusedField === "name"
                          ? "border-fuchsia-500/50 ring-4 ring-fuchsia-500/10 bg-white/[0.08]"
                          : "border-white/10 hover:border-white/20"
                        }
                      `}
                      placeholder="Your name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/70">Email</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === "email" ? "text-fuchsia-400 scale-110" : "text-white/40"}`}>
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
                        w-full pl-12 pr-4 py-3.5 rounded-xl
                        bg-white/[0.05] backdrop-blur
                        text-white placeholder:text-white/30
                        border transition-all duration-300
                        ${focusedField === "email"
                          ? "border-fuchsia-500/50 ring-4 ring-fuchsia-500/10 bg-white/[0.08]"
                          : "border-white/10 hover:border-white/20"
                        }
                      `}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/70">Password</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === "password" ? "text-fuchsia-400 scale-110" : "text-white/40"}`}>
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
                        w-full pl-12 pr-12 py-3.5 rounded-xl
                        bg-white/[0.05] backdrop-blur
                        text-white placeholder:text-white/30
                        border transition-all duration-300
                        ${focusedField === "password"
                          ? "border-fuchsia-500/50 ring-4 ring-fuchsia-500/10 bg-white/[0.08]"
                          : "border-white/10 hover:border-white/20"
                        }
                      `}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                              i < strength
                                ? `bg-gradient-to-r ${strengthColors[strength - 1]}`
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${strength > 2 ? "text-emerald-400" : strength > 1 ? "text-yellow-400" : "text-red-400"}`}>
                        {strengthLabels[strength - 1] || "Too weak"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/70">Confirm password</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === "confirmPassword" ? "text-fuchsia-400 scale-110" : "text-white/40"}`}>
                      <LockClosedIcon className="h-5 w-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`
                        w-full pl-12 pr-12 py-3.5 rounded-xl
                        bg-white/[0.05] backdrop-blur
                        text-white placeholder:text-white/30
                        border transition-all duration-300
                        ${focusedField === "confirmPassword"
                          ? "border-fuchsia-500/50 ring-4 ring-fuchsia-500/10 bg-white/[0.08]"
                          : confirmPassword && password !== confirmPassword
                          ? "border-red-500/50 ring-4 ring-red-500/10"
                          : confirmPassword && password === confirmPassword
                          ? "border-emerald-500/50 ring-4 ring-emerald-500/10"
                          : "border-white/10 hover:border-white/20"
                        }
                      `}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-400 font-medium">Passwords do not match</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckIcon className="h-3.5 w-3.5" />
                      Passwords match
                    </p>
                  )}
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
                    relative w-full py-4 rounded-xl font-semibold text-white mt-2
                    overflow-hidden group transition-all duration-300
                    ${loading
                      ? "bg-white/10 cursor-not-allowed"
                      : "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 hover:shadow-2xl hover:shadow-fuchsia-500/30 hover:-translate-y-0.5 active:translate-y-0"
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
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      Create account
                      <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>

                {/* Terms */}
                <p className="text-xs text-white/30 text-center mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-white/30">
            TaskFlow - Modern Task Management
          </p>
        </div>
      </div>
    </div>
  );
}
