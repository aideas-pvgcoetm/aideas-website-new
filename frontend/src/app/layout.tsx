import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('aideas-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
