"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  MapPin,
  Menu,
  X,
  LogOut,
  User,
  PlusCircle,
  ShieldCheck,
  Search,
  Compass,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-[#155e39] group-hover:bg-[#114b2d] rounded-xl flex items-center justify-center transition shadow-2xs">
              <Compass className="text-white" size={22} />
            </div>
            <div>
              <span className="text-xl font-extrabold text-stone-900 tracking-tight block leading-none">
                সাথী <span className="text-[#155e39] font-bold text-sm">Sathi</span>
              </span>
              <span className="text-[10px] text-stone-400 font-medium tracking-wide">
                Verified Trip Partners
              </span>
            </div>
          </Link>

          {/* Center Search Pill */}
          <Link
            href="/trips"
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-stone-200 bg-white hover:border-stone-300 hover:shadow-2xs transition text-xs font-semibold text-stone-700 divide-x divide-stone-200"
          >
            <span className="text-stone-900 font-bold flex items-center gap-1.5 pl-1">
              <MapPin size={13} className="text-[#155e39]" /> Anywhere in Bangladesh
            </span>
            <span className="pl-3 text-stone-600">Browse Trips</span>
            <span className="pl-3 pr-1 text-stone-400 font-normal flex items-center gap-2">
              Split Costs
              <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <Search size={12} />
              </div>
            </span>
          </Link>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/trips/new"
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              Post a Trip
            </Link>

            {session && (
              <Link
                href="/my-trips"
                className="px-3.5 py-2 rounded-full text-xs font-semibold text-stone-700 hover:bg-stone-100 transition flex items-center gap-1.5"
              >
                <Compass size={14} className="text-[#155e39]" />
                My Trips
              </Link>
            )}

            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-[#155e39] bg-stone-100 hover:bg-stone-200/70 border border-stone-200 transition"
            >
              <ShieldCheck size={14} className="text-[#155e39]" />
              NID Verify
            </Link>

            {session ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-stone-200 hover:shadow-2xs transition"
                >
                  <UserAvatar
                    name={session.user?.name || "Traveler"}
                    size="sm"
                    showBadge={false}
                  />
                  <span className="text-xs font-bold text-stone-800">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign Out"
                  className="p-2 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-full text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-2xs"
                >
                  Join Sathi
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 py-4 space-y-2 bg-white">
            <Link
              href="/trips"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-xl"
            >
              Explore Trip Board
            </Link>
            <Link
              href="/trips/new"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-xl"
            >
              Post a Trip
            </Link>
            {session && (
              <Link
                href="/my-trips"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-xl"
              >
                My Planned & Hosted Trips
              </Link>
            )}
            <Link
              href="/verify"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-[#155e39] bg-stone-50 rounded-xl"
            >
              Verify NID Identity
            </Link>

            {session ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-xl"
                >
                  My Profile & References
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-stone-700 bg-stone-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-white bg-stone-900 rounded-xl"
                >
                  Join Sathi
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
