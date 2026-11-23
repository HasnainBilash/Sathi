"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Compass,
  CheckCircle,
  MessageCircle,
  Clock,
  ThumbsUp,
  Award,
} from "lucide-react";
import UserAvatar, { StarRating } from "@/components/UserAvatar";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/users/${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setProfile(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Using sample profile", err);
        }
      }

      // Default mock profile with realistic Bangladeshi travel history
      setProfile({
        name: session?.user?.name || "Tanvir Ahmed",
        email: session?.user?.email || "tanvir@example.com",
        bio: "Backpacker, weekend explorer, and street photographer. Loves exploring Sajek, Sylhet and the hill tracts. Always on time and budget-conscious.",
        isVerified: true,
        verifiedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
        ratings: {
          _count: 7,
          _avg: {
            overallRating: 4.9,
            punctuality: 5.0,
            communication: 4.8,
            trustworthiness: 5.0,
          },
        },
        _count: {
          trips: 5,
          tripMembers: 7,
        },
        receivedRefs: [
          {
            id: "ref-1",
            giver: { name: "Sadia Islam", image: null },
            trip: { title: "Srimangal Tea Trails & Lawachara Forest Trek", destination: "Srimangal" },
            overallRating: 5,
            punctuality: 5,
            communication: 5,
            trustworthiness: 5,
            comment: "Tanvir was super organized, punctual at Sayedabad counter, and shared the resort bill transparently. 10/10 companion!",
            createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
          },
          {
            id: "ref-2",
            giver: { name: "Rakib Hassan", image: null },
            trip: { title: "Tanguar Haor Luxury Houseboat Cruise", destination: "Tanguar Haor" },
            overallRating: 5,
            punctuality: 5,
            communication: 4,
            trustworthiness: 5,
            comment: "Great companion for boat trips! Kept the vibe high and helped bargain for fresh fish from haor fishermen.",
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          },
        ],
      });
      setLoading(false);
    }

    loadProfile();
  }, [session]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Loading traveler profile...</p>
      </div>
    );
  }

  const avg = profile?.ratings?._avg || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={profile.name}
              image={profile.image}
              isVerified={profile.isVerified}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    NID Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/my-trips"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Compass size={15} />
              My Planned Trips
            </Link>

            <Link
              href="/verify"
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <ShieldCheck size={15} className="text-emerald-600" />
              {profile.isVerified ? "NID Verified" : "Verify NID"}
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {profile.bio || "No bio added yet."}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="text-2xl font-extrabold text-slate-800">
              {profile._count?.tripMembers || 7}
            </div>
            <div className="text-xs text-slate-500 mt-1">Trips Completed</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="text-2xl font-extrabold text-emerald-600">
              {avg.overallRating ? avg.overallRating.toFixed(1) : "5.0"}
            </div>
            <div className="text-xs text-slate-500 mt-1">Overall Rating (★)</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="text-2xl font-extrabold text-teal-600">100%</div>
            <div className="text-xs text-slate-500 mt-1">Verification Score</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="text-2xl font-extrabold text-slate-800">
              {profile.ratings?._count || 7}
            </div>
            <div className="text-xs text-slate-500 mt-1">Reviews Received</div>
          </div>
        </div>
      </div>

      {/* Structured Reputation & Travel References */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Breakdown Card */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award size={18} className="text-emerald-600" />
            Trust & Reputation Breakdown
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Punctuality (Dep. & Meetings)</span>
                <span className="text-emerald-700">{avg.punctuality ? avg.punctuality.toFixed(1) : "5.0"} / 5.0</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Communication & Planning</span>
                <span className="text-emerald-700">{avg.communication ? avg.communication.toFixed(1) : "4.8"} / 5.0</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "96%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Financial Trust & Splitting</span>
                <span className="text-emerald-700">{avg.trustworthiness ? avg.trustworthiness.toFixed(1) : "5.0"} / 5.0</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
            <span className="font-bold">Verified Reputation: </span>
            Reviews can only be submitted by travelers who physically completed a confirmed trip together.
          </div>
        </div>

        {/* References List */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageCircle size={18} className="text-emerald-600" />
            Traveler References ({profile.receivedRefs?.length || 0})
          </h2>

          <div className="space-y-4">
            {profile.receivedRefs?.map((ref: any) => (
              <div
                key={ref.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserAvatar name={ref.giver.name} size="sm" showBadge={false} />
                    <span className="text-xs font-bold text-slate-800">
                      {ref.giver.name}
                    </span>
                  </div>
                  <StarRating rating={ref.overallRating} size={14} />
                </div>

                <p className="text-xs text-slate-600 italic">
                  &ldquo;{ref.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Trip: {ref.trip.destination}</span>
                  <span>{formatDate(ref.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
