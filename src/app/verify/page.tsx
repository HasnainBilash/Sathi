"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Lock,
  Sparkles,
} from "lucide-react";

export default function VerifyPage() {
  const { data: session } = useSession();

  const [step, setStep] = useState<"nid" | "selfie" | "processing" | "success">("nid");
  const [nidNumber, setNidNumber] = useState("");
  const [dob, setDob] = useState("");
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const verificationStages = [
    "Validating National Identity Number (NID)...",
    "Running facial liveness detection algorithm...",
    "Matching live selfie to Election Commission record...",
    "Generating verified biometric token...",
  ];

  const handleStartSelfie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidNumber || nidNumber.length < 10) return;
    setStep("selfie");
  };

  const handleCaptureSelfie = () => {
    setSelfieCaptured(true);
    setTimeout(() => {
      setStep("processing");
      // Simulate multi-step verification pipeline
      let currentStage = 0;
      const interval = setInterval(() => {
        currentStage++;
        if (currentStage < verificationStages.length) {
          setLoadingStep(currentStage);
        } else {
          clearInterval(interval);
          // Call verification API
          fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nidNumber }),
          }).finally(() => {
            setStep("success");
          });
        }
      }, 1000);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#155e39]/10 text-[#155e39] flex items-center justify-center mx-auto">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            NID Identity Verification
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Sathi requires every traveler to pass government NID and selfie liveness verification. Trust is guaranteed.
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
          <span
            className={`px-3 py-1 rounded-full ${
              step === "nid"
                ? "bg-[#155e39] text-white"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            1. NID Details
          </span>
          <span className="text-stone-300">→</span>
          <span
            className={`px-3 py-1 rounded-full ${
              step === "selfie"
                ? "bg-[#155e39] text-white"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            2. Selfie Liveness
          </span>
          <span className="text-stone-300">→</span>
          <span
            className={`px-3 py-1 rounded-full ${
              step === "processing" || step === "success"
                ? "bg-[#155e39] text-white"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            3. Verified Badge
          </span>
        </div>

        {/* STEP 1: NID FORM */}
        {step === "nid" && (
          <form onSubmit={handleStartSelfie} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                National ID (Smart NID or 10/17 digit NID) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5508492019"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] font-mono tracking-wider"
              />
              <p className="text-xs text-stone-400 mt-1">
                Your NID number is encrypted and validated against the national database.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Date of Birth (as per NID) *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39]"
              />
            </div>

            {/* Privacy note */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 flex items-start gap-3">
              <Lock size={18} className="text-[#155e39] shrink-0 mt-0.5" />
              <div className="text-xs text-stone-600 leading-relaxed">
                <span className="font-semibold text-stone-800">Privacy Guarantee: </span>
                We do NOT store your raw NID number or sensitive data on our servers. We only store a cryptographic verification flag and timestamp.
              </div>
            </div>

            <button
              type="submit"
              disabled={nidNumber.length < 10 || !dob}
              className="w-full py-3.5 rounded-xl bg-[#155e39] hover:bg-[#114b2d] active:scale-[0.99] text-white font-bold text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue to Selfie Check
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: SELFIE & LIVENESS CHECK */}
        {step === "selfie" && (
          <div className="space-y-6 text-center">
            <div className="relative mx-auto w-64 h-64 rounded-full border-4 border-dashed border-[#155e39] overflow-hidden bg-stone-900 flex items-center justify-center shadow-inner">
              {/* Mock camera view */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-850 to-stone-900 flex flex-col items-center justify-center p-4 text-white">
                <Camera size={44} className="text-emerald-400 mb-3 animate-pulse" />
                <p className="text-xs font-medium text-emerald-200">
                  Position your face inside the circle
                </p>
                <p className="text-[10px] text-stone-400 mt-1">
                  Ensure good lighting and remove glasses
                </p>
              </div>

              {selfieCaptured && (
                <div className="absolute inset-0 bg-[#155e39]/80 flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-white animate-bounce" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-stone-900 text-lg">
                Biometric Liveness Match
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Click below to capture and match your live photo with the NID photo on record.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCaptureSelfie}
              disabled={selfieCaptured}
              className="px-8 py-3.5 rounded-xl bg-[#155e39] hover:bg-[#114b2d] active:scale-[0.99] text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              <Camera size={18} />
              Take Selfie & Verify
            </button>
          </div>
        )}

        {/* STEP 3: PROCESSING SIMULATOR */}
        {step === "processing" && (
          <div className="py-12 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-4 border-stone-200 border-t-[#155e39] rounded-full animate-spin" />
              <ShieldCheck
                size={24}
                className="absolute inset-0 m-auto text-[#155e39]"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-stone-900 text-lg">
                Verifying Your Identity...
              </h3>
              <p className="text-xs text-[#155e39] font-semibold animate-pulse">
                {verificationStages[loadingStep]}
              </p>
            </div>

            <div className="w-48 bg-stone-100 rounded-full h-2 mx-auto overflow-hidden">
              <div
                className="bg-[#155e39] h-full transition-all duration-700 ease-out"
                style={{
                  width: `${((loadingStep + 1) / verificationStages.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "success" && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#155e39]/10 text-[#155e39] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-stone-900">
                You are now a Verified Traveler!
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Your NID and biometric liveness matched. The green shield verified badge is now active on your profile and trip posts.
              </p>
            </div>

            <div className="bg-[#155e39]/10 border border-[#155e39]/20 rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-center gap-2 text-[#155e39] font-bold text-sm">
              <ShieldCheck size={20} className="text-[#155e39]" />
              Verified Sathi Badge Issued
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/trips"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#155e39] hover:bg-[#114b2d] text-white font-bold text-sm transition shadow-sm"
              >
                Browse Trip Board
              </Link>
              <Link
                href="/trips/new"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition"
              >
                Post a Trip
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
