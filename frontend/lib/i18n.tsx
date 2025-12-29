"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { en } from "./translations/en";
import { ur } from "./translations/ur";

type Locale = "en" | "ur";

interface TranslationDict {
  en: typeof en;
  ur: typeof ur;
}

const translations: TranslationDict = { en, ur };

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tRaw: typeof en | typeof ur;
  isRtl: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && (savedLocale === "en" || savedLocale === "ur")) {
      setLocaleState(savedLocale);
      document.documentElement.lang = savedLocale;
      document.documentElement.dir = savedLocale === "ur" ? "rtl" : "ltr";
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ur" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[locale];
      let text = (dict as Record<string, string>)[key] || (en as Record<string, string>)[key] || key;

      // Replace parameters
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = text.replace(new RegExp(`\\{${param}\\}`, "g"), String(value));
        });
      }

      return text;
    },
    [locale]
  );

  const tRaw = translations[locale];
  const isRtl = locale === "ur";

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, tRaw, isRtl }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

// Hook for getting raw translation object (for complex cases)
export function useTranslations(): typeof en | typeof ur {
  const { tRaw } = useTranslation();
  return tRaw;
}
