"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Filter,
  PlusCircle,
  Search,
  Compass,
  AlertCircle,
  Sparkles,
  Palmtree,
  Mountain,
  Coffee,
  Waves,
  Trees,
  ShieldCheck,
} from "lucide-react";
import TripCard from "@/components/TripCard";
import { Button } from "@/components/ui/button";

// Fallback prototype data so the board is always populated
const SAMPLE_TRIPS = [
  {
    id: "sample-1",
    title: "Weekend Cloud Camping at Sajek Valley",
    destination: "Sajek Valley",
    description: "Looking for 2 travel partners to share a 4WD Chander Gari from Khagrachhari and split a cottage at Konglak Para.",
    startDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    budgetPerPerson: 5500,
    maxGroupSize: 4,
    pace: "MODERATE",
    roomSharing: "FLEXIBLE",
    status: "OPEN",
    creator: {
      id: "user-1",
      name: "Tanvir Ahmed",
      isVerified: true,
      image: null,
    },
    members: [
      { user: { id: "user-1", name: "Tanvir Ahmed", image: null } },
      { user: { id: "user-2", name: "Rakib Hassan", image: null } },
    ],
    _count: { members: 2 },
  },
  {
    id: "sample-2",
    title: "Cox's Bazar Workation & Sunset Strolls",
    destination: "Cox's Bazar",
    description: "Renting a 2-bedroom sea view apartment near Kolatoli. Need someone chill who works remotely or wants a peaceful beach stay.",
    startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    budgetPerPerson: 7000,
    maxGroupSize: 3,
    pace: "RELAXED",
    roomSharing: "WILLING",
    status: "OPEN",
    creator: {
      id: "user-3",
      name: "Nusrat Jahan",
      isVerified: true,
      image: null,
    },
    members: [
      { user: { id: "user-3", name: "Nusrat Jahan", image: null } },
    ],
    _count: { members: 1 },
  },
  {
    id: "sample-3",
    title: "Srimangal Tea Trails & Lawachara Forest Trek",
    destination: "Srimangal",
    description: "Cycling through tea gardens, tasting 7-layer tea, and early morning bird watching in Lawachara. Splitting eco-resort cottage.",
    startDate: new Date(Date.now() + 86400000 * 8).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 11).toISOString(),
    budgetPerPerson: 4200,
    maxGroupSize: 4,
    pace: "ADVENTUROUS",
    roomSharing: "FLEXIBLE",
    status: "OPEN",
    creator: {
      id: "user-4",
      name: "Fahim Shahriar",
      isVerified: true,
      image: null,
    },
    members: [
      { user: { id: "user-4", name: "Fahim Shahriar", image: null } },
      { user: { id: "user-5", name: "Mehedi Hasan", image: null } },
      { user: { id: "user-6", name: "Sadia Islam", image: null } },
    ],
    _count: { members: 3 },
  },
  {
    id: "sample-4",
    title: "Keokradong Summit Trek & Boga Lake Night Stay",
    destination: "Bandarban",
    description: "Hike to Keokradong via Ruma Bazar and stay at indigenous wooden huts around Boga Lake. Splitting guide & jeep hire.",
    startDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 19).toISOString(),
    budgetPerPerson: 6500,
    maxGroupSize: 5,
    pace: "ADVENTUROUS",
    roomSharing: "WILLING",
    status: "OPEN",
    creator: {
      id: "user-7",
      name: "Arif Chowdhury",
      isVerified: true,
      image: null,
    },
    members: [
      { user: { id: "user-7", name: "Arif Chowdhury", image: null } },
      { user: { id: "user-8", name: "Kamrul Islam", image: null } },
    ],
    _count: { members: 2 },
  },
  {
    id: "sample-5",
    title: "Tanguar Haor Luxury Houseboat Cruise",
    destination: "Tanguar Haor",
    description: "Booked a premium houseboat for Sunamganj & Tanguar Haor. 2 cabin berths available. Sharing chef, boat crew, and kayak.",
    startDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 23).toISOString(),
    budgetPerPerson: 8500,
    maxGroupSize: 6,
    pace: "RELAXED",
    roomSharing: "FLEXIBLE",
    status: "OPEN",
    creator: {
      id: "user-9",
      name: "Tahmina Akter",
      isVerified: true,
      image: null,
    },
    members: [
      { user: { id: "user-9", name: "Tahmina Akter", image: null } },
      { user: { id: "user-10", name: "Zubair Al Mahmud", image: null } },
      { user: { id: "user-11", name: "Afsana Mimi", image: null } },
      { user: { id: "user-12", name: "Shakil Ahmed", image: null } },
    ],
    _count: { members: 4 },
  },
  {
    id: "sample-6",
    title: "Sylhet Ratargul Swamp & Jaflong Day Trip",
    destination: "Sylhet",
    description: "Cruising the freshwater swamp forest and stone collection river in Jaflong. Looking for 2 people to split microbus.",
    startDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    budgetPerPerson: 4800,
    maxGroupSize: 4,
    pace: "MODERATE",
    roomSharing: "FLEXIBLE",
    status: "OPEN",
    creator: {
      id: "user-13",
      name: "Sadia Islam",
      isVerified: true,
      image: null,
    },
    members: [
      { user: { id: "user-13", name: "Sadia Islam", image: null } },
    ],
    _count: { members: 1 },
  },
];

const CATEGORIES = [
  { name: "ALL", label: "All Destinations", icon: Compass },
  { name: "Cox's Bazar", label: "Beaches", icon: Palmtree },
  { name: "Sajek Valley", label: "Cloud Hills", icon: Mountain },
  { name: "Srimangal", label: "Tea Trails", icon: Coffee },
  { name: "Bandarban", label: "High Treks", icon: Mountain },
  { name: "Tanguar Haor", label: "Haor Cruise", icon: Waves },
  { name: "Sylhet", label: "Swamp & Falls", icon: Trees },
];

function TripBoardContent() {
  const searchParams = useSearchParams();
  const destQuery = searchParams.get("destination") || "ALL";

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string>(destQuery);
  const [selectedPace, setSelectedPace] = useState<string>("ALL");

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await fetch("/api/trips");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTrips(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Using sample trip board data", err);
      }
      setTrips(SAMPLE_TRIPS);
      setLoading(false);
    }
    loadTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchSearch =
        trip.title.toLowerCase().includes(search.toLowerCase()) ||
        trip.destination.toLowerCase().includes(search.toLowerCase());

      const matchDest =
        selectedDestination === "ALL" ||
        trip.destination.toLowerCase().includes(selectedDestination.toLowerCase());

      const matchPace =
        selectedPace === "ALL" || trip.pace === selectedPace;

      return matchSearch && matchDest && matchPace;
    });
  }, [trips, search, selectedDestination, selectedPace]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Category Icons Carousel */}
      <div className="border-b border-stone-200 pb-3">
        <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto scrollbar-none py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedDestination === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedDestination(cat.name)}
                className={`flex flex-col items-center gap-2 pb-2 px-1 border-b-2 whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? "border-stone-900 text-stone-900 font-bold opacity-100"
                    : "border-transparent text-stone-400 hover:text-stone-700 hover:border-stone-300 opacity-75 hover:opacity-100"
                }`}
              >
                <Icon size={20} className={isSelected ? "text-stone-900" : "text-stone-500"} />
                <span className="text-xs">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
          <input
            type="text"
            placeholder="Search destination, cottage, trek (e.g. Sajek, Sea Beach)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 text-stone-800 text-sm bg-stone-50/50"
          />
        </div>

        {/* Pace Filter & Actions */}
        <div className="flex items-center gap-3">
          <select
            value={selectedPace}
            onChange={(e) => setSelectedPace(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 cursor-pointer"
          >
            <option value="ALL">All Travel Paces</option>
            <option value="RELAXED">Relaxed Pace</option>
            <option value="MODERATE">Moderate Sightseeing</option>
            <option value="ADVENTUROUS">Adventurous Hiking</option>
          </select>

          <Link
            href="/trips/new"
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition shadow-2xs flex items-center gap-1.5 whitespace-nowrap active:scale-[0.97]"
          >
            <PlusCircle size={15} />
            Post Trip
          </Link>
        </div>
      </div>

      {/* Trip Counter & Context Header */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <div>
          Showing <span className="font-bold text-stone-900">{filteredTrips.length}</span> verified travel plans
          {selectedDestination !== "ALL" && (
            <span> in <span className="font-semibold text-stone-900">{selectedDestination}</span></span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[#155e39] font-semibold">
          <ShieldCheck size={14} className="text-[#155e39]" />
          Every post is NID-verified
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading verified trips...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Compass size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No trips match your filter</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Be the first verified traveler to post a plan for this destination!
          </p>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500"
          >
            <PlusCircle size={16} /> Post This Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TripBoardPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading verified trips...</p>
        </div>
      }
    >
      <TripBoardContent />
    </Suspense>
  );
}
