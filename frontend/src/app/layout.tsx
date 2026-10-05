import type { Metadata } from "next";

if (typeof globalThis !== 'undefined') {
  try {
    if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
      const storageMap = new Map<string, string>();
      const mockLocalStorage = {
        getItem: (key: string) => storageMap.get(String(key)) ?? null,
        setItem: (key: string, value: string) => { storageMap.set(String(key), String(value)); },
        removeItem: (key: string) => { storageMap.delete(String(key)); },
        clear: () => { storageMap.clear(); },
        key: (index: number) => Array.from(storageMap.keys())[index] ?? null,
        get length() { return storageMap.size; },
      };
      Object.defineProperty(globalThis, 'localStorage', {
        value: mockLocalStorage,
        configurable: true,
        writable: true,
      });
    }
  } catch {}
}

import { Geist, Geist_Mono, Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CacheCleanEngine from "@/components/CacheCleanEngine";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "aiDEAS — AI & Data Science Association of Students",
  description: "Igniting minds. Innovating futures. A student-led AI & Data Science community at PVGCOET, Pune.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/img/favicon-32.png" type="image/png" />
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(typeof localStorage!=='undefined'&&typeof localStorage.getItem==='function'){var t=localStorage.getItem('aideas-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <CacheCleanEngine />
        <Navbar />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Footer />
      </body>
    </html>
  );
}
