"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Users,
  TrendingDown,
  ShieldCheck,
  Lock,
  Unlock,
  MessageSquare,
  Send,
  UserCheck,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate, timeAgo } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import CostSplitCalculator from "@/components/CostSplitCalculator";
import { CostItem } from "@/types/costs";

function TripDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "chat">("overview");

  // Join Request State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Group Chat State
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Simulation members count for interactive cost demonstration
  const [simulatedMembers, setSimulatedMembers] = useState<number | null>(null);

  // Fetch trip details
  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTrip(data);
        return;
      }
    } catch (err) {
      console.warn("Falling back to sample trip data", err);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/trips/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        return;
      }
    } catch {
      // Chat load error handled gracefully
    }
  };

  useEffect(() => {
    fetchTrip().then(() => setLoading(false));
  }, [id, session]);

  // Polling for chat when chat tab is active
  useEffect(() => {
    if (activeTab === "chat") {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, id]);

  // Handle Join Request submission
  const handleSendJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=/trips/${id}`);
      return;
    }

    setSubmittingJoin(true);
    setJoinError("");

    try {
      const res = await fetch(`/api/trips/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: joinMessage }),
      });

      const resData = await res.json();

      if (!res.ok) {
        setJoinError(resData.error || "Failed to send join request");
        setSubmittingJoin(false);
        return;
      }

      setJoinSuccess(true);
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess(false);
        fetchTrip();
      }, 1800);
    } catch {
      setJoinError("Network error. Please try again.");
    } finally {
      setSubmittingJoin(false);
    }
  };

  // Handle Host Accept/Decline
  const handleRespondRequest = async (requestId: string, action: "accept" | "decline") => {
    try {
      const res = await fetch(`/api/trips/${id}/requests/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchTrip();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send Chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch(`/api/trips/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-500 text-sm">Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-2xl font-bold text-stone-900">Trip not found</h2>
        <Link href="/trips" className="text-[#155e39] font-semibold text-sm underline inline-block">
          Return to Trip Board
        </Link>
      </div>
    );
  }

  // Cost calculations
  const actualMembers = trip._count?.members || trip.members?.length || 1;
  const currentMembers = simulatedMembers ?? actualMembers;
  const totalCostEstimate = trip.budgetPerPerson * trip.maxGroupSize;
  const soloCost = totalCostEstimate;
  const perPersonCost = Math.ceil(totalCostEstimate / currentMembers);
  const currentSavings = soloCost - perPersonCost;
  const currentSavingsPercent = Math.round((currentSavings / soloCost) * 100);

  let parsedCostItems: CostItem[] | undefined = undefined;
  if (trip.costBreakdown) {
    try {
      parsedCostItems =
        typeof trip.costBreakdown === "string"
          ? JSON.parse(trip.costBreakdown)
          : trip.costBreakdown;
    } catch (e) {
      console.error("Failed to parse trip costBreakdown", e);
    }
  }

  const isMemberOrHost = trip.isMember || trip.isCreator || session?.user?.id === trip.creatorId;
  const isCreator = trip.isCreator || session?.user?.id === trip.creatorId;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-[#fafaf9]">
      {/* Back button */}
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition"
      >
        <ArrowLeft size={15} /> Back to Trip Board
      </Link>

      {/* Main Trip Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
                  {trip.status}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  {trip.pace} PACE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {trip.title}
              </h1>
              <div className="flex items-center gap-2 text-stone-600 text-sm font-medium">
                <MapPin size={16} className="text-[#155e39]" />
                <span>{trip.destination}</span>
                <span>•</span>
                <Calendar size={16} className="text-stone-400" />
                <span>
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                </span>
              </div>
            </div>

            {/* CTA Join or Chat button */}
            <div className="flex items-center gap-3">
              {isMemberOrHost ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "overview" ? "chat" : "overview")}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition shadow-2xs flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={15} />
                  {activeTab === "overview" ? "Open Group Chat" : "View Trip Plan"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowJoinModal(true)}
                  className="px-6 py-3 rounded-xl bg-[#155e39] hover:bg-[#114b2d] text-white font-bold text-xs transition shadow-2xs flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck size={16} />
                  Request to Join
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "overview"
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              Trip Overview & Cost
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === "chat"
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              <MessageSquare size={14} />
              Companion Chat
              <span className="w-2 h-2 rounded-full bg-[#155e39]" />
            </button>
          </div>
        </div>
      </div>

      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details & Private Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-stone-900">About This Trip</h2>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                {trip.description || "No specific itinerary notes provided yet. Join the group chat to plan together!"}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 block font-medium">Room Sharing:</span>
                  <span className="text-stone-800 font-semibold mt-0.5 block">
                    {trip.roomSharing === "WILLING"
                      ? "Willing to share twin beds"
                      : trip.roomSharing === "NOT_WILLING"
                      ? "Private room required"
                      : "Flexible arrangement"}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Travel Pace:</span>
                  <span className="text-stone-800 font-semibold mt-0.5 block">
                    {trip.pace} Pace
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Cost Architecture & Fair-Share Split */}
            <CostSplitCalculator
              initialDestination={trip.destination}
              initialGroupSize={currentMembers}
              initialItems={parsedCostItems}
              editable={false}
              showPostTripButton={false}
            />

            {/* Secret Safety Guardrail Details */}
            <div className={`rounded-2xl border p-6 transition ${
              isMemberOrHost
                ? "bg-stone-50 border-stone-200 text-stone-800"
                : "bg-stone-100/60 border-stone-200 text-stone-500"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
                  {isMemberOrHost ? (
                    <>
                      <Unlock size={17} className="text-[#155e39]" />
                      <span>Confidential Logistics (Unlocked for Approved Members)</span>
                    </>
                  ) : (
                    <>
                      <Lock size={17} className="text-stone-400" />
                      <span>Confidential Logistics (Hidden on Public Board)</span>
                    </>
                  )}
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                  isMemberOrHost ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-600"
                }`}>
                  {isMemberOrHost ? "Unlocked" : "Locked"}
                </span>
              </div>

              {isMemberOrHost ? (
                <div className="space-y-3 text-sm mt-3 pt-3 border-t border-stone-200">
                  <div>
                    <span className="text-xs text-stone-400 font-medium">Hotel / Cottage Name:</span>
                    <p className="font-semibold text-stone-900">{trip.hotelName || "Shared inside group chat"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 font-medium">Exact Address:</span>
                    <p className="font-semibold text-stone-900">{trip.hotelAddress || "Shared inside group chat"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 font-medium">Meeting Point & Time:</span>
                    <p className="font-semibold text-stone-900">{trip.meetingPoint || "To be discussed in chat"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500 leading-relaxed mt-1 font-normal">
                  For traveler safety, exact hotel addresses and meeting spots are hidden on the public board. They will automatically unlock once the host approves your join request.
                </p>
              )}
            </div>

            {/* Host Review & Pending Requests (Visible to Creator) */}
            {isCreator && trip.joinRequests && trip.joinRequests.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <UserCheck size={18} className="text-amber-700" />
                    Incoming Join Requests ({trip.joinRequests.length})
                  </h3>
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                    Review Required
                  </span>
                </div>

                <div className="space-y-3">
                  {trip.joinRequests.map((req: any) => (
                    <div
                      key={req.id}
                      className="bg-white p-4 rounded-xl border border-amber-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar name={req.user.name} isVerified={req.user.isVerified} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-stone-900">{req.user.name}</span>
                            {req.user.isVerified && (
                              <ShieldCheck size={14} className="text-[#155e39]" />
                            )}
                          </div>
                          {req.message && (
                            <p className="text-xs text-stone-600 mt-1 italic">&ldquo;{req.message}&rdquo;</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleRespondRequest(req.id, "accept")}
                          className="px-3.5 py-1.5 rounded-lg bg-[#155e39] hover:bg-[#114b2d] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespondRequest(req.id, "decline")}
                          className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Dynamic Cost-Per-Person Calculator & Members */}
          <div className="lg:col-span-5 space-y-6">
            {/* The Live Cost Calculator Card */}
            <div className="bg-stone-900 rounded-2xl p-6 text-white shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                  <TrendingDown size={16} /> Cost Split Calculator
                </span>
                <span className="text-[11px] bg-stone-800 border border-stone-700 px-2 py-0.5 rounded-full text-stone-300">
                  Live Update
                </span>
              </div>

              <div>
                <div className="text-3xl font-extrabold">
                  {formatCurrency(perPersonCost)}
                  <span className="text-xs font-normal text-stone-400 ml-1">/ person</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Single traveler cost would be {formatCurrency(soloCost)}
                </p>
              </div>

              {/* Interactive Group Simulator */}
              <div className="bg-stone-800/80 rounded-xl p-4 space-y-3 border border-stone-700">
                <div className="flex justify-between text-xs text-stone-300 font-medium">
                  <span>Simulate Group Growth:</span>
                  <span className="font-bold text-white">{currentMembers} / {trip.maxGroupSize} Travelers</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: trip.maxGroupSize }, (_, i) => i + 1).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSimulatedMembers(size)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentMembers === size
                          ? "bg-white text-stone-950 shadow-2xs"
                          : "bg-stone-700/60 hover:bg-stone-700 text-stone-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-700 flex justify-between text-xs">
                  <span className="text-stone-400">Single Supplement Saved:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(currentSavings)} ({currentSavingsPercent}%)
                  </span>
                </div>
              </div>

              <div className="text-center text-[11px] text-stone-400">
                As more verified companions join, your per-person cost drops.
              </div>
            </div>

            {/* Confirmed Travel Companions */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Users size={16} className="text-[#155e39]" />
                  Confirmed Companions ({trip.members?.length || 1}/{trip.maxGroupSize})
                </h3>
                <span className="text-xs text-stone-400">
                  {trip.maxGroupSize - (trip.members?.length || 1)} spots left
                </span>
              </div>

              <div className="space-y-3">
                {/* Host */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={trip.creator.name} isVerified={trip.creator.isVerified} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-stone-800">{trip.creator.name}</span>
                        {trip.creator.isVerified && (
                          <ShieldCheck size={14} className="text-[#155e39]" />
                        )}
                      </div>
                      <span className="text-xs text-stone-400">Trip Host</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-700 bg-stone-200/80 px-2 py-0.5 rounded-full">
                    Host
                  </span>
                </div>

                {/* Other members */}
                {trip.members
                  ?.filter((m: any) => m.userId !== trip.creatorId)
                  .map((m: any) => (
                    <div
                      key={m.id || m.userId}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100"
                    >
                      <div className="flex items-center gap-3">
                        <UserAvatar name={m.user.name} isVerified={m.user.isVerified} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-stone-800">{m.user.name}</span>
                            {m.user.isVerified && (
                              <ShieldCheck size={14} className="text-[#155e39]" />
                            )}
                          </div>
                          <span className="text-xs text-stone-400">Approved Companion</span>
                        </div>
                      </div>
                      <span className="text-xs text-stone-500">Member</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Group Chat */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col h-[550px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                {trip.destination.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-800">{trip.title}</h3>
                <p className="text-xs text-stone-400">
                  {trip.members?.length || 1} verified companions in group discussion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#155e39] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#155e39] animate-pulse" />
              Live Sync
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No messages yet. Say hi and start coordinating your trip!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe =
                  msg.user.id === session?.user?.id ||
                  msg.user.name === "You" ||
                  (session && msg.user.id === session.user.id);

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <UserAvatar name={msg.user.name} size="sm" showBadge={false} />
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-sm space-y-1 ${
                        isMe
                          ? "bg-stone-900 text-white rounded-tr-none"
                          : "bg-stone-100 text-stone-800 rounded-tl-none"
                      }`}
                    >
                      {!isMe && (
                        <div className="text-xs font-bold text-stone-500">
                          {msg.user.name}
                        </div>
                      )}
                      <p className="leading-relaxed">{msg.content}</p>
                      <div
                        className={`text-[10px] text-right ${
                          isMe ? "text-stone-400" : "text-stone-400"
                        }`}
                      >
                        {timeAgo(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-stone-100 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              placeholder="Discuss departure times, tickets, cottage split..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 text-stone-800"
            />
            <button
              type="submit"
              disabled={sendingMessage || !newMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={15} />
              Send
            </button>
          </form>
        </div>
      )}

      {/* Join Request Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-3">
                <UserCheck size={20} />
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                Request to Join Trip
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your NID verified badge will be presented to the host ({trip.creator.name}).
              </p>
            </div>

            {joinError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {joinError}
              </div>
            )}

            {joinSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-1">
                <CheckCircle size={24} className="mx-auto text-[#155e39]" />
                <p className="font-bold text-sm">Request sent to host!</p>
                <p className="text-xs text-stone-600">The host will review your profile and companion note.</p>
              </div>
            ) : (
              <form onSubmit={handleSendJoinRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Introduction Note to Host *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell the host about your travel style, schedule flexibility, and why you'd like to join..."
                    value={joinMessage}
                    onChange={(e) => setJoinMessage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinModal(false);
                      setJoinError("");
                    }}
                    className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingJoin}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingJoin ? "Sending..." : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TripDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-500 text-sm">Loading trip details...</p>
        </div>
      }
    >
      <TripDetailContent {...props} />
    </Suspense>
  );
}
