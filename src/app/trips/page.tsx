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
} from "lucide-react";
import TripCard from "@/components/TripCard";

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
      // If DB empty or not yet connected, use sample trips
      setTrips(SAMPLE_TRIPS);
      setLoading(false);
    }
    loadTrips();
  }, []);

  const destinations = ["ALL", "Cox's Bazar", "Sajek Valley", "Srimangal", "Bandarban", "Tanguar Haor", "Sylhet"];

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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Trip Board <span className="text-emerald-600">ভ্রমণ সাথী</span>
          </h1>
          <p className="text-slate-600 mt-1">
            Browse verified trips, split travel costs, and request to join trusted companions.
          </p>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-md shadow-emerald-600/20"
        >
          <PlusCircle size={18} />
          Post a Trip
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by trip title or destination (e.g. Sajek, Sea Beach)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPace}
              onChange={(e) => setSelectedPace(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Paces</option>
              <option value="RELAXED">Relaxed</option>
              <option value="MODERATE">Moderate</option>
              <option value="ADVENTUROUS">Adventurous</option>
            </select>
          </div>
        </div>

        {/* Destination Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm scrollbar-none">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1 mr-1">
            <MapPin size={12} /> Routes:
          </span>
          {destinations.map((dest) => (
            <button
              key={dest}
              type="button"
              onClick={() => setSelectedDestination(dest)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition ${
                selectedDestination === dest
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {dest === "ALL" ? "All Bangladesh" : dest}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading verified trips...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Compass size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No trips match your filter</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Be the first to post a trip for this route and gather companions to split the costs!
          </p>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500"
          >
            <PlusCircle size={16} /> Post This Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
