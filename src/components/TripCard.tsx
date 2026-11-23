import Link from "next/link";
import { MapPin, Calendar, Users, TrendingDown, ShieldCheck, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
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
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-sm hover:border-stone-300 transition flex flex-col h-full">
        {/* Cover Image Header */}
        <div className="relative h-48 w-full overflow-hidden bg-stone-100">
          <img
            src={bgImage}
            alt={trip.destination}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/95 text-stone-800 shadow-2xs">
              {trip.destination}
            </span>

            {trip.creator.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#155e39] text-white shadow-2xs">
                <ShieldCheck size={13} className="text-emerald-200" />
                Verified Host
              </span>
            )}
          </div>

          {/* Bottom Overlay on Image: Spots left & dates */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Calendar size={13} className="text-white/80" />
              <span>
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-stone-100">
              {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left` : "Full Group"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-[#155e39] transition line-clamp-2">
              {trip.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="px-2 py-0.5 rounded-md bg-stone-100 font-medium text-stone-700">
                {trip.pace} Pace
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {memberCount}/{trip.maxGroupSize} joined
              </span>
            </div>
          </div>

          {/* Cost Splitting Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Estimated Split</div>
              <div className="text-lg font-extrabold text-stone-900">
                {formatCurrency(costPerPerson)}
                <span className="text-xs font-normal text-stone-500 ml-1">/ person</span>
              </div>
            </div>

            {savingsPercent > 0 && (
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80">
                  <TrendingDown size={12} />
                  Save {savingsPercent}%
                </span>
                <div className="text-[10px] text-stone-400 mt-0.5">vs solo trip</div>
              </div>
            )}
          </div>

          {/* Footer: Host Info & Action Arrow */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserAvatar
                name={trip.creator.name}
                image={trip.creator.image}
                isVerified={trip.creator.isVerified}
                size="sm"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-800 block leading-tight">
                  {trip.creator.name}
                </span>
                <span className="text-[10px] text-stone-400">Trip Host</span>
              </div>
            </div>

            <span className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white text-stone-500 flex items-center justify-center transition">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
