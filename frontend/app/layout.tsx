import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import { TranslationProvider } from "@/lib/i18n";
import "./globals.css";

// Modern, clean sans-serif for body text
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Geometric sans-serif for headings - modern & distinctive
const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

// Monospace for code/numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow - Modern Task Management",
    template: "%s | TaskFlow",
  },
  description:
    "A beautifully crafted task management app with secure authentication, real-time updates, and a delightful user experience.",
  keywords: [
    "todo",
    "task management",
    "productivity",
    "Next.js",
    "FastAPI",
    "full-stack",
    "modern",
  ],
  authors: [{ name: "TaskFlow Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TaskFlow",
    title: "TaskFlow - Modern Task Management",
    description:
      "A beautifully crafted task management app with secure authentication, real-time updates, and a delightful user experience.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        <TranslationProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
