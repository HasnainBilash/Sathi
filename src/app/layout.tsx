import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "সাথী (Sathi) — Verified Trip Partners for Bangladesh",
  description:
    "Find trustworthy travel partners, plan trips across Bangladesh, and split accommodation and transport costs — killing the single supplement and travel risk.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafaf9] text-stone-900 font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t border-stone-200 py-10 mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm">সাথী Sathi</span>
                <span>•</span>
                <span>Verified Trip Partners for Bangladesh</span>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/trips" className="hover:text-stone-900 transition">
                  Trip Board
                </Link>
                <Link href="/verify" className="hover:text-stone-900 transition flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#155e39]" />
                  NID Verification
                </Link>
                <Link href="/trips/new" className="hover:text-stone-900 transition">
                  Post a Trip
                </Link>
                <Link href="/my-trips" className="hover:text-stone-900 transition">
                  My Trips
                </Link>
              </div>
              <div className="flex items-center gap-1 text-stone-400">
                Built with <Heart size={13} className="text-rose-500 fill-rose-500" /> for travelers across Bangladesh
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
