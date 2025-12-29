"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  BoltIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export default function Home() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: CheckCircleIcon,
      title: t("feature.taskManagement"),
      desc: t("feature.taskManagement.desc"),
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: ShieldCheckIcon,
      title: t("feature.secureAuth"),
      desc: t("feature.secureAuth.desc"),
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: DevicePhoneMobileIcon,
      title: t("feature.responsive"),
      desc: t("feature.responsive.desc"),
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: UserGroupIcon,
      title: t("feature.multiUser"),
      desc: t("feature.multiUser.desc"),
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: BoltIcon,
      title: t("feature.fast"),
      desc: t("feature.fast.desc"),
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const techStack = [
    { name: "Next.js 15", icon: "N" },
    { name: "FastAPI", icon: "F" },
    { name: "PostgreSQL", icon: "P" },
    { name: "TypeScript", icon: "T" },
    { name: "Tailwind", icon: "T" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        {/* Animated floating orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Animated particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/30 transition-all duration-300 group-hover:scale-105">
                  <CheckCircleSolid className="h-6 w-6 text-white" />
                </div>
                {/* Pulse ring on logo */}
                <div className="absolute inset-0 rounded-xl bg-violet-500/20 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <span className="text-xl font-display font-bold text-white tracking-tight">TaskFlow</span>
            </Link>

            {/* Nav Actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                {t("home.getStarted")}
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className={`max-w-5xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/[0.05] backdrop-blur border border-white/10 rounded-full px-5 py-2 mb-8 hover:bg-white/[0.08] transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-white/60">
              {t("home.techStack")} — Phase II
            </span>
          </div>

          {/* Main Heading with staggered animation */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6">
            <span
              className={`block text-white transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: '200ms' }}
            >
              {t("home.title")}
            </span>
            <span
              className={`block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 animate-gradient-x transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: '400ms', backgroundSize: '200% auto' }}
            >
              {t("home.subtitle")}
            </span>
          </h1>

          {/* Subheading */}
          <p
            className={`text-lg sm:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '600ms' }}
          >
            {t("home.tagline")}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-20 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '800ms' }}
          >
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <SparklesIcon className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{t("home.startFree")}</span>
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-white/80 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300"
            >
              {t("home.signIn")}
            </Link>
          </div>

          {/* Stats with hover effects */}
          <div
            className={`grid grid-cols-3 gap-4 sm:gap-6 max-w-xl mx-auto transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '1000ms' }}
          >
            {[
              { value: "5+", label: "home.stats.features" },
              { value: "100%", label: "home.stats.secure" },
              { value: "<50ms", label: "home.stats.response" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-violet-500/20 hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{t(stat.label)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section with staggered animations */}
        <section className="max-w-6xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              {t("home.features.title")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> {t("home.features.subtitle")}</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              {t("home.features.desc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-2 transition-all duration-500"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <f.icon className="h-6 w-6 text-white" />
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-violet-200 transition-colors">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/60 transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="bg-white/[0.03] backdrop-blur border border-white/5 rounded-3xl p-8 sm:p-10 hover:border-white/10 transition-colors duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-white/40 mb-4">
                <BoltIcon className="h-4 w-4 animate-pulse" />
                {t("home.techStack")}
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                {t("home.techDesc")}
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/10 hover:-translate-y-1 transition-all duration-300"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {tech.icon}
                  </div>
                  <span className="font-medium text-white/70 group-hover:text-white transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden group">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 animate-gradient-x" style={{ backgroundSize: '200% auto' }} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwSDJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEI0djRIMHYyaDR2NGgyVjZoNFY0SDZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

            <div className="relative z-10 p-10 sm:p-14 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur mb-6 group-hover:scale-110 transition-transform duration-500">
                <SparklesIcon className="h-8 w-8 text-white animate-pulse" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                {t("home.cta.title")}
              </h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">
                {t("home.cta.desc")}
              </p>
              <Link
                href="/signup"
                className="group/btn inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-violet-600 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {t("home.cta.button")}
                <ArrowRightIcon className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircleSolid className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-semibold text-white">TaskFlow</span>
            </div>
            <p className="text-sm text-white/40">
              Phase II — Fullstack Todo App
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
