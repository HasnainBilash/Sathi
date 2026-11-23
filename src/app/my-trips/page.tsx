"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  MessageSquare,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";

function MyTripsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"hosted" | "joined" | "requests">("hosted");
  const [data, setData] = useState<{
    hostedTrips: any[];
    joinedTrips: any[];
    sentRequests: any[];
  }>({
    hostedTrips: [],
    joinedTrips: [],
    sentRequests: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/my-trips");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/my-trips")
        .then((res) => (res.ok ? res.json() : null))
        .then((resData) => {
          if (resData) {
            setData(resData);
          }
        })
        .catch((err) => console.error("Error loading my trips", err))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (loading || status === "loading") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Loading your planned trips...</p>
      </div>
    );
  }

  const pendingRequestsCount = data.hostedTrips.reduce(
    (acc, trip) => acc + (trip.joinRequests?.length || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Compass size={14} className="text-emerald-600" />
            Travel Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Planned & Hosted Trips
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your posts, review traveler join requests, and access your group chats.
          </p>
        </div>

        <Link
          href="/trips/new"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 active:scale-[0.97]"
        >
          <PlusCircle size={15} />
          Post New Trip
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("hosted")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "hosted"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Hosted by Me ({data.hostedTrips.length})
          {pendingRequestsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("joined")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "joined"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Trips I&apos;ve Joined ({data.joinedTrips.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "requests"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          My Sent Requests ({data.sentRequests.length})
        </button>
      </div>

      {/* TAB 1: HOSTED TRIPS */}
      {activeTab === "hosted" && (
        <div className="space-y-4">
          {data.hostedTrips.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Compass size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                You haven&apos;t posted any trips yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Got a weekend trip in mind? Post your itinerary and let verified travelers request to split the costs.
              </p>
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
              >
                <PlusCircle size={15} /> Post Your First Trip
              </Link>
            </div>
          ) : (
            data.hostedTrips.map((trip) => {
              const pendingRequests = trip.joinRequests?.length || 0;
              const membersCount = trip.members?.length || 1;
              const spotsLeft = trip.maxGroupSize - membersCount;

              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4 hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800">
                          {trip.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {trip.pace} PACE
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {trip.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin size={13} className="text-emerald-600" />
                          {trip.destination}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Users size={13} />
                          {membersCount}/{trip.maxGroupSize} joined ({spotsLeft} spots left)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <MessageSquare size={14} />
                        Manage & Chat
                      </Link>
                    </div>
                  </div>

                  {/* Pending Join Requests Alert for Host */}
                  {pendingRequests > 0 ? (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
                        <UserCheck size={16} className="text-amber-700 shrink-0" />
                        <span>
                          {pendingRequests} companion request{pendingRequests !== 1 ? "s" : ""} waiting for your review!
                        </span>
                      </div>
                      <Link
                        href={`/trips/${trip.id}`}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap"
                      >
                        Review Requests
                      </Link>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                      <span>No pending join requests right now.</span>
                      <span className="text-emerald-700 font-semibold">
                        Estimated split: {formatCurrency(Math.ceil(trip.budgetPerPerson))} / person
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: JOINED TRIPS */}
      {activeTab === "joined" && (
        <div className="space-y-4">
          {data.joinedTrips.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                You haven&apos;t joined any trips yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Browse verified trips on the board and request to join fellow backpackers.
              </p>
              <Link
                href="/trips"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
              >
                Browse Trip Board
              </Link>
            </div>
          ) : (
            data.joinedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {trip.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin size={13} className="text-emerald-600" />
                        {trip.destination}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/trips/${trip.id}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <MessageSquare size={14} />
                    Open Group Chat
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <UserAvatar name={trip.creator.name} isVerified={trip.creator.isVerified} size="sm" />
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        Hosted by {trip.creator.name}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(Math.ceil(trip.budgetPerPerson))} / person
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: SENT REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {data.sentRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No active join requests
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                When you click &ldquo;Request to Join&rdquo; on any trip, your request and status will appear here.
              </p>
              <Link
                href="/trips"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Find a Trip to Join
              </Link>
            </div>
          ) : (
            data.sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <Link
                      href={`/trips/${req.trip.id}`}
                      className="text-base font-bold text-slate-900 hover:text-emerald-700 transition"
                    >
                      {req.trip.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={12} className="text-emerald-600" />
                      <span>{req.trip.destination}</span>
                      <span>•</span>
                      <span>Host: {req.trip.creator.name}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      req.status === "PENDING"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : req.status === "ACCEPTED"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {req.status === "PENDING"
                      ? "⏳ Waiting for Host Approval"
                      : req.status === "ACCEPTED"
                      ? "✓ Accepted — Welcome to the Trip!"
                      : "✕ Declined"}
                  </span>
                </div>

                {req.message && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    Your note: &ldquo;{req.message}&rdquo;
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function MyTripsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading your planned trips...</p>
        </div>
      }
    >
      <MyTripsContent />
    </Suspense>
  );
}
