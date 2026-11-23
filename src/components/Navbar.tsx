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
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">
              সাথী <span className="text-emerald-600 text-sm font-normal">Sathi</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/trips" className="text-gray-600 hover:text-emerald-600 font-medium transition">
              Trip Board
            </Link>

            {session ? (
              <>
                <Link
                  href="/trips/new"
                  className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-600 font-medium transition"
                >
                  <PlusCircle size={18} />
                  Post Trip
                </Link>
                <Link
                  href="/verify"
                  className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-600 font-medium transition"
                >
                  <ShieldCheck size={18} />
                  Verify
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-600 font-medium transition"
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 font-medium transition"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-600 hover:text-emerald-600 font-medium transition">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition"
                >
                  Join Sathi
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-800"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link
              href="/trips"
              className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Trip Board
            </Link>
            {session ? (
              <>
                <Link
                  href="/trips/new"
                  className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Post a Trip
                </Link>
                <Link
                  href="/verify"
                  className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Verify Identity
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-emerald-600 text-white rounded-lg font-medium text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Join Sathi
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
