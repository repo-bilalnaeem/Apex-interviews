import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "prismjs/themes/prism.css";
import { NuqsAdapter } from "nuqs/adapters/next";

import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/structured-data";
import { PWAProvider } from "@/components/pwa/pwa-provider";
import { BASE_URL } from "@/constants";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Interview Agents - Transform Your Hiring Process",
    template: "%s | AI Interview Agents",
  },
  description:
    "Revolutionize recruitment with AI-powered interview agents. Automate candidate screening, conduct intelligent interviews, and make data-driven hiring decisions. Start your free trial today.",
  keywords: [
    "AI interviews",
    "automated hiring",
    "recruitment platform",
    "interview agents",
    "HR technology",
    "candidate screening",
    "AI recruitment",
    "automated interviews",
    "hiring automation",
    "interview platform",
    "talent acquisition",
    "recruitment AI",
  ],
  authors: [{ name: "AI Interview Agents" }],
  creator: "AI Interview Agents",
  publisher: "AI Interview Agents",
  category: "Technology",
  openGraph: {
    title: "AI Interview Agents - Transform Your Hiring Process",
    description:
      "Revolutionize recruitment with AI-powered interview agents. Automate candidate screening, conduct intelligent interviews, and make data-driven hiring decisions.",
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "AI Interview Agents",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Interview Agents - Transform Your Hiring Process",
    description:
      "Revolutionize recruitment with AI-powered interview agents. Automate candidate screening, conduct intelligent interviews, and make data-driven hiring decisions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://aiinterviewagents.com"),
  alternates: {
    canonical: "https://aiinterviewagents.com",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html lang="en" className={`${syne.variable} ${plusJakartaSans.variable}`}>
          <head>
            <StructuredData type="organization" />
            <StructuredData type="website" />
            <StructuredData type="product" />
          </head>
          <body className="antialiased">
            <Toaster />
            {children}
            <PWAProvider />
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
