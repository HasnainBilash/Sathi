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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  // Interactive mini calculator on landing page
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
      tagline: "Clouds & Hills",
      trips: "14 upcoming trips",
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Cox's Bazar",
      tagline: "World's Longest Sea Beach",
      trips: "28 upcoming trips",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Srimangal",
      tagline: "Tea Gardens & Rain Forest",
      trips: "9 upcoming trips",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Bandarban",
      tagline: "Keokradong & Boga Lake",
      trips: "12 upcoming trips",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white pt-20 pb-28 px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium">
            <ShieldCheck size={16} className="text-emerald-400" />
            100% NID + Selfie Verified Travelers
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Stop paying the <span className="text-emerald-400">solo travel tax</span> in Bangladesh.
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Find vetted travel companions for Cox&apos;s Bazar, Sajek, Sylhet, and beyond. Split hotel rooms, share private transport, and travel safely without strangers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/trips"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              Explore Trip Board
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/trips/new"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Compass size={18} />
              Post a Trip
            </Link>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-12 max-w-2xl mx-auto text-center border-t border-white/10 mt-12">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">৳2,000+</div>
              <div className="text-xs sm:text-sm text-slate-400">Avg. savings per trip</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">NID-Verified</div>
              <div className="text-xs sm:text-sm text-slate-400">Govt ID + Liveness Check</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-teal-300">0% Strangers</div>
              <div className="text-xs sm:text-sm text-slate-400">Host approves all requests</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Single Supplement Calculator (Core Hook) */}
      <section className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <TrendingDown size={18} />
                LIVE COST CALCULATOR
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                See how much you save with Sathi
              </h2>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
              Kills up to 75% of your trip cost
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2 text-slate-700">
                  <span>Accommodation Cost (Hotel / Resort)</span>
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
                <div className="flex justify-between text-sm font-medium mb-2 text-slate-700">
                  <span>Shared Transport (Car / Chander Gari / Boat)</span>
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
                <div className="flex justify-between text-sm font-medium mb-2 text-slate-700">
                  <span>Group Size</span>
                  <span className="text-emerald-700 font-bold">{groupSize} Travelers</span>
                </div>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGroupSize(num)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                        groupSize === num
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white text-center shadow-lg">
              <div className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
                Your Price Per Person
              </div>
              <div className="text-4xl font-extrabold">{formatCurrency(splitCost)}</div>
              <div className="text-sm text-emerald-100 mt-1">
                vs {formatCurrency(soloCost)} traveling solo
              </div>

              <div className="mt-6 pt-6 border-t border-emerald-500/40 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-100">Single Supplement Saved:</span>
                  <span className="font-bold text-white">{formatCurrency(savings)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-100">Savings Percentage:</span>
                  <span className="font-bold text-emerald-200">{savingsPercent}% OFF</span>
                </div>
              </div>

              <Link
                href="/trips"
                className="mt-6 block w-full py-2.5 rounded-xl bg-white text-emerald-800 font-bold hover:bg-emerald-50 transition text-sm shadow-sm"
              >
                Find Companions Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Sathi Works */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How Sathi Works</h2>
          <p className="text-slate-600 mt-2">
            No random Facebook comments. A structured, safe flow from post to verified trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Verify Identity</h3>
            <p className="text-sm text-slate-600">
              National ID + selfie face match via KYC check. No anonymous troll profiles allowed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Post or Browse</h3>
            <p className="text-sm text-slate-600">
              Set destination, budget, group cap, room-sharing preferences, and trip pace.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Host Approves</h3>
            <p className="text-sm text-slate-600">
              The trip creator reviews each profile & badge before accepting. Quality control is yours.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Chat & Split</h3>
            <p className="text-sm text-slate-600">
              Approved travelers unlock group chat, coordinates, and watch per-person costs drop.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Trust Features */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold mb-2">
              <ShieldCheck size={18} />
              TRUST & SAFETY FIRST
            </div>
            <h2 className="text-3xl font-bold">Engineered for Safe Travel in Bangladesh</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl">
              <Lock className="text-emerald-400 mb-4" size={28} />
              <h3 className="font-bold text-lg mb-2">Hidden Sensitive Details</h3>
              <p className="text-sm text-slate-300">
                Exact hotel names, booking numbers, and meeting points are only revealed after the host approves your request.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl">
              <CheckCircle2 className="text-emerald-400 mb-4" size={28} />
              <h3 className="font-bold text-lg mb-2">Biometric Verification</h3>
              <p className="text-sm text-slate-300">
                NID validity + liveness face check ensures every profile is tied to a real person. Zero anonymity.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl">
              <Sparkles className="text-emerald-400 mb-4" size={28} />
              <h3 className="font-bold text-lg mb-2">Mutual Reputation Score</h3>
              <p className="text-sm text-slate-300">
                Post-trip reviews on punctuality, communication, and trustworthiness build lifetime travel credibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Popular Destinations</h2>
            <p className="text-slate-600 mt-1">Trending trips posted by community members</p>
          </div>
          <Link href="/trips" className="text-emerald-600 font-semibold hover:text-emerald-700 text-sm flex items-center gap-1">
            View All Trips <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/trips?destination=${encodeURIComponent(dest.name)}`}
              className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition block"
            >
              <div className="h-40 relative overflow-hidden bg-slate-200">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-lg leading-tight">{dest.name}</h3>
                  <p className="text-xs text-slate-200">{dest.tagline}</p>
                </div>
              </div>
              <div className="p-3 text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>{dest.trips}</span>
                <span className="text-emerald-600 group-hover:translate-x-1 transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            Ready for your next weekend gateway?
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-base">
            Create an account in 60 seconds, verify your identity, and meet trustworthy travel buddies across Bangladesh.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-emerald-800 font-bold hover:bg-emerald-50 transition shadow-lg"
            >
              Join Sathi Free
            </Link>
            <Link
              href="/verify"
              className="px-8 py-3.5 rounded-xl bg-emerald-800/60 border border-emerald-400/30 text-white font-medium hover:bg-emerald-800/90 transition"
            >
              Verify Your NID
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
