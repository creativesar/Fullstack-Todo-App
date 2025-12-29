"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { GlobeAltIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

export function LanguageSwitcher() {
  const { locale, setLocale, t, isRtl } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en" as const, name: "English", flag: "🇺🇸" },
    { code: "ur" as const, name: "اردو", flag: "🇵🇰" },
  ] as const;

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
        aria-label={t("language.switch")}
        title={t("language.switch")}
      >
        <GlobeAltIcon className="h-5 w-5" />
        <span className="hidden sm:inline text-sm font-medium">{currentLang.name}</span>
        <span className="text-lg">{currentLang.flag}</span>
        <ChevronUpDownIcon className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className={`
              absolute ${isRtl ? "left-0" : "right-0"} mt-2 w-40
              bg-[#0a0a0f]/95 backdrop-blur-xl
              border border-white/10 rounded-xl
              shadow-xl shadow-violet-500/10
              overflow-hidden z-50
              animate-scale-in
            `}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  text-sm transition-all duration-200
                  ${locale === lang.code
                    ? "bg-violet-500/20 text-violet-400"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {locale === lang.code && (
                  <div className={`ml-auto h-2 w-2 rounded-full bg-violet-400 ${isRtl ? "mr-auto" : "ml-auto"}`} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
