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
  Sparkles,
  HeartHandshake,
  BadgeCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  // Interactive Single Supplement calculator
  const [roomCost, setRoomCost] = useState(6000);
  const [transportCost, setTransportCost] = useState(4000);
  const [groupSize, setGroupSize] = useState(3);

  const totalTripCost = roomCost + transportCost;
  const soloCost = totalTripCost;
  const splitCost = Math.ceil(totalTripCost / groupSize);
  const savings = soloCost - splitCost;
  const savingsPercent = Math.round((savings / soloCost) * 100);

  const popularDestinations = [
    {
      name: "Sajek Valley",
      tagline: "Clouds & Hill Tracts",
      trips: "14 verified trips",
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Cox's Bazar",
      tagline: "World's Longest Sea Beach",
      trips: "28 verified trips",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Srimangal",
      tagline: "Tea Gardens & Rain Forest",
      trips: "9 verified trips",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Bandarban",
      tagline: "Keokradong & Boga Lake",
      trips: "12 verified trips",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white pt-24 pb-32 px-4 sm:px-6">
        {/* Soft radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck size={15} className="text-emerald-400" />
            100% NID + Selfie Verified Travelers in Bangladesh
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Stop paying the <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-8">solo travel tax</span>.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Find vetted travel companions for Cox&apos;s Bazar, Sajek, Sylhet, and beyond. Split hotel rooms, share private transport, and travel safely without strangers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/trips"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-[0.97]"
            >
              Explore Trip Board
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/trips/new"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold transition flex items-center justify-center gap-2 backdrop-blur-md active:scale-[0.97]"
            >
              <Compass size={17} />
              Post a Trip
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-12 max-w-2xl mx-auto text-center border-t border-white/10 mt-12">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">৳2,000+</div>
              <div className="text-xs text-slate-400 mt-0.5">Avg. savings per trip</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Govt NID</div>
              <div className="text-xs text-slate-400 mt-0.5">Biometric liveness check</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">0% Strangers</div>
              <div className="text-xs text-slate-400 mt-0.5">Host approves every join</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Single Supplement Calculator (Elevated Better-Design style) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <TrendingDown size={16} />
                Live Single Supplement Calculator
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                See how much you save with Sathi
              </h2>
            </div>
            <Badge variant="success-light" size="lg">
              Save up to 75% on Bangladesh trips
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2 text-slate-700">
                  <span>Accommodation Cost (Hotel / Cottage / Resort)</span>
                  <span className="text-emerald-700 font-bold">{formatCurrency(roomCost)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="20000"
                  step="500"
                  value={roomCost}
                  onChange={(e) => setRoomCost(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2 text-slate-700">
                  <span>Shared Transport (Car / Chander Gari / Boat / Guide)</span>
                  <span className="text-emerald-700 font-bold">{formatCurrency(transportCost)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={transportCost}
                  onChange={(e) => setTransportCost(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2 text-slate-700">
                  <span>Group Size (Companions)</span>
                  <span className="text-emerald-700 font-bold">{groupSize} Travelers</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGroupSize(num)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-[0.96] ${
                        groupSize === num
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {num} {num === 1 ? "(Solo)" : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 rounded-2xl p-7 text-white text-center shadow-lg space-y-4">
              <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
                Your Price Per Person
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {formatCurrency(splitCost)}
              </div>
              <div className="text-xs text-emerald-100 font-medium">
                vs {formatCurrency(soloCost)} when traveling alone
              </div>

              <div className="pt-4 border-t border-emerald-500/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-100">Single Supplement Saved:</span>
                  <span className="font-extrabold text-white text-sm">{formatCurrency(savings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-100">Savings Percentage:</span>
                  <span className="font-extrabold text-emerald-200 text-sm">{savingsPercent}% OFF</span>
                </div>
              </div>

              <Link
                href="/trips"
                className="block w-full py-3 rounded-full bg-white text-emerald-900 font-bold hover:bg-emerald-50 transition text-xs shadow-xs active:scale-[0.97]"
              >
                Find Companions Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Sathi Works (Step Cards) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="secondary" size="default">
            The Sathi Workflow
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How Verified Travel Works
          </h2>
          <p className="text-slate-600 text-sm">
            No random Facebook comments. A structured, safe flow from post to verified trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verify Identity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              National ID + selfie face match via KYC check. No anonymous troll profiles allowed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Post or Browse</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Set destination, budget, group cap, room-sharing preferences, and trip pace.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Host Approves</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The trip creator reviews each profile & badge before accepting. Quality control is yours.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base">Chat & Split</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Approved travelers unlock group chat, coordinates, and watch per-person costs drop.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations Tiles */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Popular Routes in Bangladesh
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Top destinations where travelers are actively splitting rooms & transport
            </p>
          </div>
          <Link
            href="/trips"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            All Destinations <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/trips?destination=${encodeURIComponent(dest.name)}`}
              className="group rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 block"
            >
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-base leading-tight">{dest.name}</h3>
                  <p className="text-[11px] text-slate-200 mt-0.5">{dest.tagline}</p>
                </div>
              </div>
              <div className="p-3 text-xs text-slate-500 font-semibold flex items-center justify-between">
                <span>{dest.trips}</span>
                <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={16} /> Trust & Safety Architecture
            </div>
            <h2 className="text-3xl font-extrabold">Engineered for Safe Travel in Bangladesh</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Exact accommodation locations and room numbers remain hidden until you are approved by the host. Mutual references after each trip guarantee accountability.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/verify"
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition active:scale-[0.97]"
            >
              Verify Your NID Identity
            </Link>
            <Link
              href="/trips"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/10 active:scale-[0.97]"
            >
              Browse Open Trips
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
