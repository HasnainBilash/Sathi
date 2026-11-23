"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  MapPin,
  Calendar as CalendarIcon,
  DollarSign,
  Users,
  Compass,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Info,
  Clock,
  Sparkles,
  Building,
  Navigation,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import CostSplitCalculator from "@/components/CostSplitCalculator";
import { CostItem } from "@/types/costs";

function NewTripContent() {
  const router = useRouter();
  const { data: session } = useSession();

  const [todayStr, setTodayStr] = useState("");
  useEffect(() => {
    setTodayStr(new Date().toISOString().split("T")[0]);
  }, []);

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
    // Private details
    hotelName: "",
    hotelAddress: "",
    meetingPoint: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [costItems, setCostItems] = useState<CostItem[]>([]);

  const handleCostItemsChange = (items: CostItem[], perPersonBudget: number) => {
    setCostItems(items);
    if (perPersonBudget > 0) {
      setForm((prev) => ({
        ...prev,
        budgetPerPerson: String(perPersonBudget),
      }));
    }
  };

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

  // Quick Date Presets
  const setDatePreset = (preset: "thisWeekend" | "nextWeekend" | "nextWeek") => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 5 is Friday

    if (preset === "thisWeekend") {
      // Find upcoming Friday
      const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
      const start = new Date(today);
      start.setDate(today.getDate() + daysUntilFriday);
      const end = new Date(start);
      end.setDate(start.getDate() + 2); // Sunday
      setForm((prev) => ({
        ...prev,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      }));
    } else if (preset === "nextWeekend") {
      const daysUntilFriday = ((5 - dayOfWeek + 7) % 7 || 7) + 7;
      const start = new Date(today);
      start.setDate(today.getDate() + daysUntilFriday);
      const end = new Date(start);
      end.setDate(start.getDate() + 2);
      setForm((prev) => ({
        ...prev,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      }));
    } else if (preset === "nextWeek") {
      const start = new Date(today);
      start.setDate(today.getDate() + 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 4);
      setForm((prev) => ({
        ...prev,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      }));
    }
  };

  // Calculate duration
  const tripDuration = useMemo(() => {
    if (!form.startDate || !form.endDate) return null;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24)) + 1;
    if (diffDays <= 0) return "Invalid date range";
    const nights = Math.max(0, diffDays - 1);
    return `${diffDays} Days, ${nights} Night${nights !== 1 ? "s" : ""}`;
  }, [form.startDate, form.endDate]);

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

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date cannot be earlier than start date");
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
          costBreakdown: costItems.length > 0 ? costItems : undefined,
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
            Fill in your travel plan. Verified travelers across Bangladesh can view your post and request to join.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Trip Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3-Day Relaxed Trip to Sajek Cloud Cottage"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Destination in Bangladesh *
              </label>
              <select
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
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
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            )}
          </div>

          {/* DATES WITH CALENDAR PICKER & QUICK PRESETS */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CalendarIcon size={16} className="text-emerald-600" />
                Select Trip Dates *
              </label>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 font-medium mr-1">Presets:</span>
                <button
                  type="button"
                  onClick={() => setDatePreset("thisWeekend")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 font-semibold transition whitespace-nowrap shadow-2xs"
                >
                  This Weekend
                </button>
                <button
                  type="button"
                  onClick={() => setDatePreset("nextWeekend")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 font-semibold transition whitespace-nowrap shadow-2xs"
                >
                  Next Weekend
                </button>
                <button
                  type="button"
                  onClick={() => setDatePreset("nextWeek")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 font-semibold transition whitespace-nowrap shadow-2xs"
                >
                  Next Week
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-slate-600 mb-1">
                  Start Date (Departure)
                </span>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 bg-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-600 mb-1">
                  End Date (Return)
                </span>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={form.startDate || todayStr}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 bg-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Live Duration Preview Badge */}
            {tripDuration && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-200/80">
                <Clock size={14} className="text-emerald-700" />
                <span>Estimated Duration: {tripDuration}</span>
                {form.startDate && form.endDate && (
                  <span className="font-normal text-emerald-900 ml-auto">
                    ({formatDate(form.startDate)} – {formatDate(form.endDate)})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* AI-Powered Cost Split Architecture */}
          <div className="space-y-3 pt-2">
            <CostSplitCalculator
              initialDestination={
                form.destination === "Other"
                  ? form.customDestination || "Sajek Valley"
                  : form.destination
              }
              initialGroupSize={parseInt(form.maxGroupSize) || 4}
              onItemsChange={handleCostItemsChange}
            />
          </div>

          {/* Budget & Group Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Calculated Budget Per Person (৳ BDT) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
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
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Auto-calculated from your itemized expenses above, or fine-tune manually.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Max Group Size (Inc. You) *
              </label>
              <select
                value={form.maxGroupSize}
                onChange={(e) => setForm({ ...form, maxGroupSize: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Trip Pace
              </label>
              <select
                value={form.pace}
                onChange={(e) => setForm({ ...form, pace: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="RELAXED">🧘 Relaxed (Chilling, cafe, scenic)</option>
                <option value="MODERATE">🚶 Moderate (Balanced sightseeing)</option>
                <option value="ADVENTUROUS">🏔️ Adventurous (Hiking, early mornings)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Room Sharing Preference
              </label>
              <select
                value={form.roomSharing}
                onChange={(e) => setForm({ ...form, roomSharing: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="FLEXIBLE">Flexible (Twin bed or separate)</option>
                <option value="WILLING">Willing to share twin room (cheapest)</option>
                <option value="NOT_WILLING">Private room preferred</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Trip Details & Companion Preferences
            </label>
            <textarea
              rows={4}
              placeholder="Tell others what you plan to do, your travel style, food preferences, and what kind of companions you'd love to join..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-normal"
            />
          </div>

          {/* PRIVATE DETAILS (VISIBLE HIGH-CONTRAST TEXTBOXES) */}
          <div className="bg-amber-50/50 border-2 border-amber-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Lock size={18} className="text-amber-600" />
              <span>Private Logistics (Protected Details)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              🔒 <span className="font-semibold text-slate-900">Privacy & Safety Guardrail:</span> Anything you write below stays completely hidden on the public board. It will automatically unlock only for travelers whose join requests you explicitly accept.
            </p>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Building size={14} className="text-emerald-700" />
                  Hotel / Cottage / Resort Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meghalaya Resort (Konglak Para)"
                  value={form.hotelName}
                  onChange={(e) =>
                    setForm({ ...form, hotelName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-950 bg-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-700" />
                  Exact Address / Booking Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ruilui Para, Sajek, Baghaichhari (Room #204)"
                  value={form.hotelAddress}
                  onChange={(e) =>
                    setForm({ ...form, hotelAddress: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-950 bg-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Navigation size={14} className="text-emerald-700" />
                  Meeting Point & Departure Time (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sayedabad Counter / Khagrachhari Bus Stand (08:00 AM Friday)"
                  value={form.meetingPoint}
                  onChange={(e) =>
                    setForm({ ...form, meetingPoint: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-950 bg-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition shadow-md shadow-emerald-600/20 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
          >
            {loading ? "Publishing Trip..." : "Publish Trip to Board"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewTripPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading trip planner...</p>
        </div>
      }
    >
      <NewTripContent />
    </Suspense>
  );
}
