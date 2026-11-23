import Link from "next/link";
import { MapPin, Calendar, Users, TrendingDown, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    budgetPerPerson: number;
    maxGroupSize: number;
    pace: string;
    roomSharing: string;
    status: string;
    creator: {
      id: string;
      name: string;
      image?: string | null;
      isVerified: boolean;
    };
    members: Array<{
      user: { id: string; name: string; image?: string | null };
    }>;
    _count: { members: number };
  };
}

export default function TripCard({ trip }: TripCardProps) {
  const memberCount = trip._count.members;
  const costPerPerson = Math.ceil(trip.budgetPerPerson);
  const originalCost = trip.budgetPerPerson * trip.maxGroupSize;
  const currentTotalSplit = Math.ceil(originalCost / memberCount);
  const savings = memberCount > 1 ? Math.round(((currentTotalSplit - costPerPerson) / currentTotalSplit) * 100) : 0;

  const paceLabel = {
    RELAXED: "🧘 Relaxed",
    MODERATE: "🚶 Moderate",
    ADVENTUROUS: "🏔️ Adventurous",
  }[trip.pace] || trip.pace;

  const spotsLeft = trip.maxGroupSize - memberCount;

  return (
    <Link href={`/trips/${trip.id}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
        {/* Top colored bar */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-700 transition line-clamp-1">
                {trip.title}
              </h3>
              <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                <MapPin size={14} />
                <span className="text-sm font-medium">{trip.destination}</span>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                trip.status === "OPEN"
                  ? "bg-emerald-50 text-emerald-700"
                  : trip.status === "FULL"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              {trip.status === "OPEN" ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left` : trip.status}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users size={14} />
              <span>
                {memberCount}/{trip.maxGroupSize} members
              </span>
            </div>
          </div>

          {/* Cost section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Cost per person</p>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(costPerPerson)}</p>
              </div>
              {memberCount < trip.maxGroupSize && (
                <div className="text-right">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingDown size={14} />
                    <span className="text-xs font-medium">
                      Could be {formatCurrency(Math.ceil(originalCost / trip.maxGroupSize))}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">with full group</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-semibold">
                {trip.creator.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600">{trip.creator.name}</span>
              {trip.creator.isVerified && (
                <ShieldCheck size={14} className="text-emerald-500" />
              )}
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {paceLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
