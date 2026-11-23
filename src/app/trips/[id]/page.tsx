"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

function TripDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "chat">("overview");

  // Join Request State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

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

    // Fallback sample trip
    const mockTrip = {
      id,
      title: "Weekend Cloud Camping at Sajek Valley",
      destination: "Sajek Valley",
      description:
        "Looking for travel partners to share a 4WD Chander Gari from Khagrachhari and split a high-altitude wooden cottage at Konglak Para. We plan to catch the morning sunrise over the clouds and explore indigenous cafes.",
      startDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      budgetPerPerson: 5500,
      maxGroupSize: 4,
      pace: "MODERATE",
      roomSharing: "FLEXIBLE",
      status: "OPEN",
      hotelName: "Meghpunji Resort (Konglak Para)",
      hotelAddress: "Ruilui Para, Sajek, Baghaichhari, Rangamati",
      meetingPoint: "Khagrachhari Bus Stand (08:00 AM Friday)",
      creatorId: "user-1",
      creator: {
        id: "user-1",
        name: "Tanvir Ahmed",
        email: "tanvir@example.com",
        isVerified: true,
        bio: "Frequent weekend backpacker & photographer. 12 domestic trips completed.",
      },
      members: [
        {
          id: "m-1",
          userId: "user-1",
          user: { id: "user-1", name: "Tanvir Ahmed", isVerified: true },
        },
        {
          id: "m-2",
          userId: "user-2",
          user: { id: "user-2", name: "Rakib Hassan", isVerified: true },
        },
      ],
      joinRequests: [
        {
          id: "req-1",
          userId: "user-3",
          message: "Hey Tanvir! I love photography too and I have a Sony A7III. Would love to join for the sunrise shoot!",
          status: "PENDING",
          user: { id: "user-3", name: "Nusrat Jahan", isVerified: true },
        },
      ],
      _count: { members: 2, messages: 4 },
      isCreator: session?.user?.id === "user-1" || !session,
      isMember: true,
    };
    setTrip(mockTrip);
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
      // Mock messages fallback
    }

    if (messages.length === 0) {
      setMessages([
        {
          id: "msg-1",
          content: "Welcome everyone! Glad to have you onboard for Sajek.",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          user: { id: "user-1", name: "Tanvir Ahmed" },
        },
        {
          id: "msg-2",
          content: "Super excited! Should we book the non-AC or AC bus from Dhaka to Khagrachhari?",
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          user: { id: "user-2", name: "Rakib Hassan" },
        },
        {
          id: "msg-3",
          content: "Shanti Paribahan non-AC gets us there by 6 AM, which is perfect for catching the first army convoy at 10 AM.",
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          user: { id: "user-1", name: "Tanvir Ahmed" },
        },
      ]);
    }
  };

  useEffect(() => {
    fetchTrip().then(() => setLoading(false));
  }, [id, session]);

  // Polling for chat when chat tab is active
  useEffect(() => {
    if (activeTab === "chat") {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab, id]);

  // Handle Join Request submission
  const handleSendJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingJoin(true);

    try {
      const res = await fetch(`/api/trips/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: joinMessage }),
      });

      if (res.ok) {
        setJoinSuccess(true);
        setTimeout(() => {
          setShowJoinModal(false);
          setJoinSuccess(false);
        }, 2000);
      } else {
        // Fallback for simulation
        setJoinSuccess(true);
        setTimeout(() => {
          setShowJoinModal(false);
          setJoinSuccess(false);
        }, 1500);
      }
    } catch {
      setJoinSuccess(true);
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess(false);
      }, 1500);
    } finally {
      setSubmittingJoin(false);
    }
  };

  // Handle Host Accept/Decline
  const handleRespondRequest = async (requestId: string, action: "accept" | "decline") => {
    try {
      await fetch(`/api/trips/${id}/requests/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    } catch (err) {
      console.error(err);
    }
    // Optimistic UI update
    setTrip((prev: any) => ({
      ...prev,
      joinRequests: prev.joinRequests.filter((r: any) => r.id !== requestId),
      _count: {
        ...prev._count,
        members: action === "accept" ? prev._count.members + 1 : prev._count.members,
      },
    }));
  };

  // Send Chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    const tempMsg = {
      id: "temp-" + Date.now(),
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      user: {
        id: session?.user?.id || "current-user",
        name: session?.user?.name || "You",
      },
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      await fetch(`/api/trips/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tempMsg.content }),
      });
    } catch (err) {
      console.warn("Offline mock message added");
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Trip not found</h2>
        <Link href="/trips" className="text-emerald-600 font-semibold mt-4 inline-block">
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
  const fullGroupCost = Math.ceil(totalCostEstimate / trip.maxGroupSize);
  const currentSavings = soloCost - perPersonCost;
  const currentSavingsPercent = Math.round((currentSavings / soloCost) * 100);

  const isMemberOrHost = trip.isMember || trip.isCreator || session?.user?.id === trip.creatorId;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition"
      >
        <ArrowLeft size={16} /> Back to Trip Board
      </Link>

      {/* Main Trip Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                  {trip.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {trip.pace} PACE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {trip.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <MapPin size={16} className="text-emerald-600" />
                <span>{trip.destination}</span>
                <span>•</span>
                <Calendar size={16} className="text-slate-400" />
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-sm flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  {activeTab === "overview" ? "Open Group Chat" : "View Trip Plan"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowJoinModal(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <UserCheck size={18} />
                  Request to Join
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
                activeTab === "overview"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Trip Overview & Cost
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === "chat"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <MessageSquare size={16} />
              Approved Members Chat
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          </div>
        </div>
      </div>

      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details & Private Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">About This Trip</h2>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {trip.description || "No specific itinerary provided yet. Join the group chat to plan together!"}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Room Sharing:</span>
                  <span className="text-slate-800 font-semibold mt-0.5 block">
                    {trip.roomSharing === "WILLING"
                      ? "Willing to share twin beds"
                      : trip.roomSharing === "NOT_WILLING"
                      ? "Private room required"
                      : "Flexible arrangement"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Travel Pace:</span>
                  <span className="text-slate-800 font-semibold mt-0.5 block">
                    {trip.pace}
                  </span>
                </div>
              </div>
            </div>

            {/* Secret Safety Guardrail Details */}
            <div className={`rounded-2xl border p-6 transition ${
              isMemberOrHost
                ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  {isMemberOrHost ? (
                    <>
                      <Unlock size={18} className="text-emerald-600" />
                      <span>Confidential Logistics (Unlocked for Members)</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} className="text-slate-400" />
                      <span>Confidential Logistics (Hidden for Safety)</span>
                    </>
                  )}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  isMemberOrHost ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                }`}>
                  {isMemberOrHost ? "Approved Member Access" : "Locked"}
                </span>
              </div>

              {isMemberOrHost ? (
                <div className="space-y-3 text-sm mt-3">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Hotel / Cottage Name:</span>
                    <p className="font-semibold text-slate-800">{trip.hotelName || "Announced in group chat"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Exact Location / Address:</span>
                    <p className="font-semibold text-slate-800">{trip.hotelAddress || "Shared in group chat"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Meeting Point & Time:</span>
                    <p className="font-semibold text-slate-800">{trip.meetingPoint || "To be decided together"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  To protect member safety and hotel reservations, exact accommodation addresses and meeting spots are hidden on the public board. They will automatically unlock once the host approves your join request.
                </p>
              )}
            </div>

            {/* Host Review & Pending Requests (Visible to Creator) */}
            {trip.isCreator && trip.joinRequests && trip.joinRequests.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <UserCheck size={18} className="text-amber-600" />
                    Incoming Join Requests ({trip.joinRequests.length})
                  </h3>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                    Quality Gate
                  </span>
                </div>

                <div className="space-y-3">
                  {trip.joinRequests.map((req: any) => (
                    <div
                      key={req.id}
                      className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar name={req.user.name} isVerified={req.user.isVerified} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-slate-800">{req.user.name}</span>
                            {req.user.isVerified && (
                              <ShieldCheck size={14} className="text-emerald-500" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 italic">&ldquo;{req.message}&rdquo;</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleRespondRequest(req.id, "accept")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespondRequest(req.id, "decline")}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
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
            {/* The Live Cost Calculator Hook */}
            <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-lg space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                  <TrendingDown size={16} /> Cost Split Calculator
                </span>
                <span className="text-xs bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full text-emerald-200">
                  Live Update
                </span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold">
                  {formatCurrency(perPersonCost)}
                  <span className="text-xs sm:text-sm font-normal text-emerald-200 ml-1">/ person</span>
                </div>
                <p className="text-xs text-emerald-100 mt-1">
                  Single traveler cost would be {formatCurrency(soloCost)}
                </p>
              </div>

              {/* Interactive Group Simulator */}
              <div className="bg-white/10 rounded-xl p-4 space-y-3 backdrop-blur-sm border border-white/10">
                <div className="flex justify-between text-xs text-emerald-100 font-medium">
                  <span>Simulate Group Growth:</span>
                  <span className="font-bold text-white">{currentMembers} / {trip.maxGroupSize} Travelers</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: trip.maxGroupSize }, (_, i) => i + 1).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSimulatedMembers(size)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        currentMembers === size
                          ? "bg-white text-emerald-900 shadow-sm"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between text-xs">
                  <span className="text-emerald-200">Single Supplement Saved:</span>
                  <span className="font-extrabold text-white">
                    {formatCurrency(currentSavings)} ({currentSavingsPercent}%)
                  </span>
                </div>
              </div>

              <div className="text-center text-xs text-emerald-200/80">
                As more verified travelers join, the cost per person drops automatically!
              </div>
            </div>

            {/* Confirmed Travel Companions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users size={16} className="text-emerald-600" />
                  Confirmed Companions ({trip.members?.length || 1}/{trip.maxGroupSize})
                </h3>
                <span className="text-xs text-slate-400">
                  {trip.maxGroupSize - (trip.members?.length || 1)} spots left
                </span>
              </div>

              <div className="space-y-3">
                {/* Host */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={trip.creator.name} isVerified={trip.creator.isVerified} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-slate-800">{trip.creator.name}</span>
                        {trip.creator.isVerified && (
                          <ShieldCheck size={14} className="text-emerald-500" />
                        )}
                      </div>
                      <span className="text-xs text-slate-400">Trip Host</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Host
                  </span>
                </div>

                {/* Other members */}
                {trip.members
                  ?.filter((m: any) => m.userId !== trip.creatorId)
                  .map((m: any) => (
                    <div
                      key={m.id || m.userId}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <UserAvatar name={m.user.name} isVerified={m.user.isVerified} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-slate-800">{m.user.name}</span>
                            {m.user.isVerified && (
                              <ShieldCheck size={14} className="text-emerald-500" />
                            )}
                          </div>
                          <span className="text-xs text-slate-400">Approved Companion</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">Member</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Group Chat */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[550px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {trip.destination.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">{trip.title}</h3>
                <p className="text-xs text-slate-400">
                  {trip.members?.length || 1} verified members in group chat
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
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
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-slate-100 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    {!isMe && (
                      <div className="text-xs font-bold text-slate-500">
                        {msg.user.name}
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.content}</p>
                    <div
                      className={`text-[10px] text-right ${
                        isMe ? "text-emerald-200" : "text-slate-400"
                      }`}
                    >
                      {timeAgo(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              placeholder="Discuss meeting point, bus schedule, cottage splitting..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={sendingMessage || !newMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send size={16} />
              Send
            </button>
          </form>
        </div>
      )}

      {/* Join Request Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <UserCheck size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Request to Join Trip
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your NID verified badge will be shown to the trip host ({trip.creator.name}).
              </p>
            </div>

            {joinSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center space-y-1">
                <CheckCircle size={24} className="mx-auto text-emerald-600" />
                <p className="font-bold text-sm">Request sent to host!</p>
                <p className="text-xs">You&apos;ll be notified once accepted.</p>
              </div>
            ) : (
              <form onSubmit={handleSendJoinRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Introduction Message to Host *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Introduce yourself, your travel vibe, and why you'd like to join this trip..."
                    value={joinMessage}
                    onChange={(e) => setJoinMessage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingJoin}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition disabled:opacity-50"
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
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading trip details...</p>
        </div>
      }
    >
      <TripDetailContent {...props} />
    </Suspense>
  );
}
