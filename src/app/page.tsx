"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingDown,
  Users,
  MapPin,
  Lock,
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import CostSplitCalculator from "@/components/CostSplitCalculator";

export default function HomePage() {
  const popularDestinations = [
    {
      name: "Sajek Valley",
      tagline: "Clouds & Hill Tracts",
      trips: "14 verified trips",
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Cox's Bazar",
      tagline: "World's Longest Sea Beach",
      trips: "28 verified trips",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Srimangal",
      tagline: "Tea Gardens & Rain Forest",
      trips: "9 verified trips",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Bandarban",
      tagline: "Keokradong & Boga Lake",
      trips: "12 verified trips",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="space-y-24 pb-24 bg-[#fafaf9]">
      {/* Editorial Human Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold tracking-wide">
            <ShieldCheck size={15} className="text-[#155e39]" />
            National ID & Biometric Verified Travel Community
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
            Never pay the single supplement again.
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Find vetted travel companions for Cox&apos;s Bazar, Sajek, Srimangal, and Bandarban. Split hotel rooms, share private transport, and travel safely without strangers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/trips"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              Explore Open Trips
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/trips/new"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <Compass size={16} className="text-[#155e39]" />
              Post a Trip
            </Link>
          </div>

          {/* Clean Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-stone-200 text-left max-w-3xl mx-auto mt-12">
            <div className="space-y-1">
              <div className="text-stone-900 font-bold text-sm">৳2,000–৳6,000 Saved</div>
              <p className="text-xs text-stone-500 leading-normal">
                Cut 40–70% off hotel rooms and private jeep hire by splitting costs.
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-stone-900 font-bold text-sm">Govt NID Verified</div>
              <p className="text-xs text-stone-500 leading-normal">
                Every member passes government ID & selfie liveness check. Zero trolls.
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-stone-900 font-bold text-sm">You Choose Companions</div>
              <p className="text-xs text-stone-500 leading-normal">
                Trip creators review every join request before approving. Quality gate is yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Single Supplement & Cost Architecture Calculator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <CostSplitCalculator
          initialDestination="Sajek Valley"
          initialGroupSize={3}
          editable={true}
        />
      </section>

      {/* How Sathi Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#155e39]">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900">
            How Verified Travel Works
          </h2>
          <p className="text-stone-500 text-sm">
            Say goodbye to chaotic Facebook threads and unvetted strangers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-stone-900 text-base">Verify NID</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Verify your National ID and take a selfie. Verified badge issued on your profile.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-stone-900 text-base">Post or Browse</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Set destination, dates, budget, group cap, and room-sharing preference.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-stone-900 text-base">Host Approves</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              The trip creator reviews each profile and note before accepting. You choose who travels with you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-stone-900 text-base">Group Chat & Trip</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Approved members plan in a private group chat and unlock secret hotel logistics.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations Showcase */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Popular Routes in Bangladesh
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Top domestic destinations with travelers actively looking for companions
            </p>
          </div>
          <Link
            href="/trips"
            className="text-xs font-bold text-stone-900 hover:text-stone-600 flex items-center gap-1"
          >
            All Destinations <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/trips?destination=${encodeURIComponent(dest.name)}`}
              className="group rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-2xs hover:shadow-sm transition block"
            >
              <div className="h-44 relative overflow-hidden bg-stone-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-base leading-tight">{dest.name}</h3>
                  <p className="text-[11px] text-stone-200 mt-0.5">{dest.tagline}</p>
                </div>
              </div>
              <div className="p-3 text-xs text-stone-600 font-semibold flex items-center justify-between">
                <span>{dest.trips}</span>
                <span className="text-[#155e39] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-stone-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={16} className="text-emerald-400" /> Trust & Safety Guardrails
            </div>
            <h2 className="text-3xl font-bold">Engineered for Safe Travel in Bangladesh</h2>
            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              Exact hotel addresses, room numbers, and meeting spots are kept private until the trip host accepts you. Post-trip references on punctuality and trustworthiness ensure accountability.
            </p>
          </div>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link
              href="/verify"
              className="px-6 py-3 rounded-xl bg-white text-stone-950 font-bold text-xs transition hover:bg-stone-100"
            >
              Verify Your NID Identity
            </Link>
            <Link
              href="/trips"
              className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs transition border border-stone-700"
            >
              Browse Open Trips
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
