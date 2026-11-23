"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Compass,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Info,
} from "lucide-react";

export default function NewTripPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    title: "",
    destination: "Cox's Bazar",
    customDestination: "",
    description: "",
    startDate: "",
    endDate: "",
    budgetPerPerson: "5000",
    maxGroupSize: "4",
    pace: "MODERATE",
    roomSharing: "FLEXIBLE",
    // Hidden fields
    hotelName: "",
    hotelAddress: "",
    meetingPoint: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const destinations = [
    "Cox's Bazar",
    "Sajek Valley",
    "Srimangal",
    "Bandarban",
    "Tanguar Haor",
    "Sylhet",
    "Sundarbans",
    "Saint Martin",
    "Kuakata",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session) {
      router.push("/login?callbackUrl=/trips/new");
      return;
    }

    const destination =
      form.destination === "Other"
        ? form.customDestination.trim()
        : form.destination;

    if (!destination) {
      setError("Please specify a destination");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError("Please select trip dates");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          destination,
          description: form.description,
          startDate: form.startDate,
          endDate: form.endDate,
          budgetPerPerson: parseFloat(form.budgetPerPerson),
          maxGroupSize: parseInt(form.maxGroupSize),
          pace: form.pace,
          roomSharing: form.roomSharing,
          hotelName: form.hotelName || undefined,
          hotelAddress: form.hotelAddress || undefined,
          meetingPoint: form.meetingPoint || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create trip");
        setLoading(false);
        return;
      }

      router.push(`/trips/${data.id}`);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 mb-6 transition"
      >
        <ArrowLeft size={16} /> Back to Trip Board
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Compass size={14} /> New Trip Post
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Post a Trip & Find Travel Partners
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Fill in your travel plan. Verified travelers can view your post and request to join.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Trip Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3-Day Relaxed Trip to Sajek Cloud Cottage"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Destination in Bangladesh *
              </label>
              <select
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {destinations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {form.destination === "Other" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Specify Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nijhum Dwip, Tetulia"
                  value={form.customDestination}
                  onChange={(e) =>
                    setForm({ ...form, customDestination: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Budget & Group Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Target Budget Per Person (৳ BDT) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ৳
                </span>
                <input
                  type="number"
                  required
                  min="500"
                  step="100"
                  value={form.budgetPerPerson}
                  onChange={(e) =>
                    setForm({ ...form, budgetPerPerson: e.target.value })
                  }
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Max Group Size (Inc. You) *
              </label>
              <select
                value={form.maxGroupSize}
                onChange={(e) => setForm({ ...form, maxGroupSize: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} travelers max
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pace and Room Sharing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Trip Pace
              </label>
              <select
                value={form.pace}
                onChange={(e) => setForm({ ...form, pace: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="RELAXED">🧘 Relaxed (Chilling, cafe, scenic)</option>
                <option value="MODERATE">🚶 Moderate (Balanced sightseeing)</option>
                <option value="ADVENTUROUS">🏔️ Adventurous (Hiking, early mornings)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Room Sharing Preference
              </label>
              <select
                value={form.roomSharing}
                onChange={(e) => setForm({ ...form, roomSharing: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="FLEXIBLE">Flexible (Twin bed or separate)</option>
                <option value="WILLING">Willing to share twin room (cheapest)</option>
                <option value="NOT_WILLING">Private room preferred</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Trip Details & Companion Preferences
            </label>
            <textarea
              rows={4}
              placeholder="Tell others what you plan to do, your travel style, food preferences, and what kind of companions you'd love to join..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Safety Guardrail Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Lock size={16} className="text-emerald-600" />
              Private Details (Visible ONLY to Approved Travelers)
            </div>
            <p className="text-xs text-slate-500">
              For your safety, exact accommodation names, room numbers, and meeting spots are hidden on the public board.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Hotel / Cottage Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meghalaya Resort, Sajek"
                  value={form.hotelName}
                  onChange={(e) =>
                    setForm({ ...form, hotelName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Meeting Point / Departure
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sayedabad Bus Terminal / Khagrachhari"
                  value={form.meetingPoint}
                  onChange={(e) =>
                    setForm({ ...form, meetingPoint: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? "Publishing Trip..." : "Publish Trip to Board"}
          </button>
        </form>
      </div>
    </div>
  );
}
