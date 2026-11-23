import Link from "next/link";
import { MapPin, Calendar, Users, TrendingDown, ShieldCheck, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";

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

const DESTINATION_IMAGES: Record<string, string> = {
  "Sajek Valley": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
  "Cox's Bazar": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
  "Srimangal": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
  "Bandarban": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "Tanguar Haor": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  "Sylhet": "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80",
};

export default function TripCard({ trip }: TripCardProps) {
  const memberCount = trip._count.members || trip.members?.length || 1;
  const costPerPerson = Math.ceil(trip.budgetPerPerson);
  const totalCost = trip.budgetPerPerson * trip.maxGroupSize;
  const currentSoloCost = totalCost;
  const savings = currentSoloCost - costPerPerson;
  const savingsPercent = Math.round((savings / currentSoloCost) * 100);

  const spotsLeft = trip.maxGroupSize - memberCount;

  const bgImage =
    DESTINATION_IMAGES[trip.destination] ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";

  return (
    <Link href={`/trips/${trip.id}`} className="group block focus:outline-none">
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full">
        {/* Cover Image Header */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={bgImage}
            alt={trip.destination}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/90 text-slate-800 shadow-xs">
              {trip.destination}
            </span>

            {trip.creator.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
                <ShieldCheck size={13} className="text-emerald-200" />
                Verified Host
              </span>
            )}
          </div>

          {/* Bottom Overlay on Image: Spots left */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Calendar size={13} className="text-white/80" />
              <span>
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-emerald-300">
              {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left` : "Full Group"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition line-clamp-2">
              {trip.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                {trip.pace}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {memberCount}/{trip.maxGroupSize} joined
              </span>
            </div>
          </div>

          {/* Cost Splitting Highlight Pill (Better-Design style) */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Per person cost</div>
              <div className="text-lg font-extrabold text-slate-900">
                {formatCurrency(costPerPerson)}
              </div>
            </div>

            {savingsPercent > 0 && (
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <TrendingDown size={12} />
                  Save {savingsPercent}%
                </span>
                <div className="text-[10px] text-slate-400 mt-0.5">vs solo travel</div>
              </div>
            )}
          </div>

          {/* Footer: Host Info & Action Arrow */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserAvatar
                name={trip.creator.name}
                image={trip.creator.image}
                isVerified={trip.creator.isVerified}
                size="sm"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block leading-tight">
                  {trip.creator.name}
                </span>
                <span className="text-[10px] text-slate-400">Host</span>
              </div>
            </div>

            <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-500 flex items-center justify-center transition duration-200">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
