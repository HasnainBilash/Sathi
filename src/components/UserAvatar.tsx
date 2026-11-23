import { ShieldCheck, Star } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  isVerified?: boolean;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export default function UserAvatar({
  name,
  image,
  isVerified,
  size = "md",
  showBadge = true,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <div className="relative inline-flex">
      {image ? (
        <img
          src={image}
          alt={name}
          className={cn("rounded-full object-cover", sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center",
            sizeClasses[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {showBadge && isVerified && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5">
          <ShieldCheck className="text-white" size={size === "sm" ? 10 : size === "md" ? 12 : 16} />
        </div>
      )}
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
}

export function StarRating({ rating, max = 5, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200"
          )}
        />
      ))}
    </div>
  );
}
