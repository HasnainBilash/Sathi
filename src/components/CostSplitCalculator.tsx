"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CostItem,
  CostCategory,
  CostSummary,
} from "@/types/costs";
import {
  Sparkles,
  Plus,
  Trash2,
  Users,
  Hotel,
  Car,
  Utensils,
  Compass,
  Layers,
  TrendingDown,
  ArrowRight,
  Check,
  Key,
  MapPin,
  Calendar,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CostSplitCalculatorProps {
  initialDestination?: string;
  initialGroupSize?: number;
  initialItems?: CostItem[];
  editable?: boolean;
  onItemsChange?: (items: CostItem[], perPersonBudget: number) => void;
  showPostTripButton?: boolean;
}

const CATEGORY_META: Record<
  CostCategory,
  { label: string; icon: typeof Hotel; color: string; bg: string }
> = {
  ACCOMMODATION: {
    label: "Stay / Hotel",
    icon: Hotel,
    color: "text-amber-800",
    bg: "bg-amber-50 border-amber-200/80",
  },
  TRANSPORT: {
    label: "Transport / Vehicle",
    icon: Car,
    color: "text-blue-800",
    bg: "bg-blue-50 border-blue-200/80",
  },
  FOOD: {
    label: "Dining & Food",
    icon: Utensils,
    color: "text-orange-800",
    bg: "bg-orange-50 border-orange-200/80",
  },
  ACTIVITIES: {
    label: "Activities & Guide",
    icon: Compass,
    color: "text-emerald-800",
    bg: "bg-emerald-50 border-emerald-200/80",
  },
  OTHER: {
    label: "Other Expense",
    icon: Layers,
    color: "text-stone-800",
    bg: "bg-stone-50 border-stone-200/80",
  },
};

const TRENDING_DESTINATIONS = [
  "Sajek Valley",
  "Tanguar Haor",
  "Kuakata",
  "Sreemangal",
  "Bandarban",
  "Cox's Bazar",
  "Saint Martin",
  "Ratargul",
];

export default function CostSplitCalculator({
  initialDestination = "Sajek Valley",
  initialGroupSize = 4,
  initialItems,
  editable = true,
  onItemsChange,
  showPostTripButton = true,
}: CostSplitCalculatorProps) {
  const [destinationInput, setDestinationInput] = useState(initialDestination);
  const [activeDestination, setActiveDestination] = useState(initialDestination);
  const [durationDays, setDurationDays] = useState(3);
  const [groupSize, setGroupSize] = useState(initialGroupSize);
  const [items, setItems] = useState<CostItem[]>(initialItems || []);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSource, setAiSource] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Optional Custom API Key (saved in browser localStorage for testing anytime)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("sathi_gemini_api_key");
    if (savedKey) setCustomApiKey(savedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (key.trim()) {
      localStorage.setItem("sathi_gemini_api_key", key.trim());
    } else {
      localStorage.removeItem("sathi_gemini_api_key");
    }
    setShowApiKeyModal(false);
  };

  // Add Item Drawer State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<CostCategory>("ACCOMMODATION");
  const [newItemAmount, setNewItemAmount] = useState<number | "">("");
  const [newItemIsShared, setNewItemIsShared] = useState(true);

  // Initial load
  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      runAiTripResearch(initialDestination, durationDays, groupSize);
    }
  }, []);

  const runAiTripResearch = async (
    targetDest: string,
    targetDays = durationDays,
    targetGroup = groupSize
  ) => {
    const cleanDest = targetDest.trim() || "Sajek Valley";
    setLoadingAi(true);
    setActiveDestination(cleanDest);

    try {
      const res = await fetch("/api/gemini/research-costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: cleanDest,
          durationDays: targetDays,
          groupSize: targetGroup,
          customApiKey: customApiKey || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setAiSource(data.source || null);
        setAiSummary(data.summary || null);
      }
    } catch (err) {
      console.error("AI trip research error:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationInput.trim()) return;
    runAiTripResearch(destinationInput.trim(), durationDays, groupSize);
  };

  // Calculations
  const summary: CostSummary = useMemo(() => {
    let totalSharedAmount = 0;
    let totalIndividualAmount = 0;

    items.forEach((item) => {
      if (item.isShared) {
        totalSharedAmount += item.amount;
      } else {
        totalIndividualAmount += item.amount;
      }
    });

    const safeGroupSize = Math.max(1, groupSize);
    const sharedPerPerson = Math.ceil(totalSharedAmount / safeGroupSize);
    const perPersonCost = sharedPerPerson + totalIndividualAmount;
    const totalSoloCost = totalSharedAmount + totalIndividualAmount;
    const savingsPerPerson = Math.max(0, totalSoloCost - perPersonCost);
    const savingsPercent =
      totalSoloCost > 0 ? Math.round((savingsPerPerson / totalSoloCost) * 100) : 0;

    return {
      totalSoloCost,
      perPersonCost,
      totalSharedAmount,
      sharedPerPerson,
      totalIndividualAmount,
      savingsPerPerson,
      savingsPercent,
    };
  }, [items, groupSize]);

  // Callback to parent
  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(items, summary.perPersonCost);
    }
  }, [items, summary.perPersonCost, onItemsChange]);

  const handleToggleShared = (id: string) => {
    if (!editable) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isShared: !item.isShared } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    if (!editable) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemAmount || Number(newItemAmount) <= 0) return;

    const newItem: CostItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      amount: Number(newItemAmount),
      isShared: newItemIsShared,
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemName("");
    setNewItemAmount("");
    setIsAddingItem(false);
  };

  return (
    <div className="space-y-6">
      {/* ─── AI PLANNER SEARCH BAR (CLEAN & SPACIOUS) ─── */}
      {editable && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#155e39]/10 text-[#155e39] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={14} />
                AI Trip Architect
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Let AI Plan Your Trip & Fair-Share Costs
              </h2>
              <p className="text-stone-500 text-sm mt-1 max-w-xl">
                Type any destination across Bangladesh. Gemini models real hotel tariffs, vehicle charters, and local dining so you see how traveling with partners kills the single supplement.
              </p>
            </div>

            {/* API Key Modal Button */}
            <button
              type="button"
              onClick={() => setShowApiKeyModal(true)}
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-600 hover:text-stone-900 text-xs font-semibold transition"
            >
              <Key size={13} className={customApiKey ? "text-[#155e39]" : "text-stone-400"} />
              {customApiKey ? "Gemini Key Active" : "Add Gemini Key"}
            </button>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-stone-50 p-2 sm:p-2.5 rounded-2xl border border-stone-200/90"
          >
            {/* Destination Input */}
            <div className="sm:col-span-5 relative flex items-center">
              <MapPin size={18} className="absolute left-3.5 text-[#155e39]" />
              <input
                type="text"
                required
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder="Where to? (e.g. Kuakata, Nilgiri, Tanguar Haor)"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-stone-200 text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] transition"
              />
            </div>

            {/* Duration Selector */}
            <div className="sm:col-span-3 relative flex items-center">
              <Calendar size={18} className="absolute left-3.5 text-stone-400" />
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] transition"
              >
                <option value={2}>2 Days (Quick Weekend)</option>
                <option value={3}>3 Days (Full Weekend)</option>
                <option value={4}>4 Days (Extended Trip)</option>
                <option value={5}>5 Days (Holiday Trek)</option>
              </select>
            </div>

            {/* Group Size Selector */}
            <div className="sm:col-span-2 relative flex items-center">
              <Users size={18} className="absolute left-3.5 text-stone-400" />
              <select
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] transition"
              >
                <option value={1}>1 Solo</option>
                <option value={2}>2 Partners</option>
                <option value={3}>3 Partners</option>
                <option value={4}>4 Partners</option>
                <option value={5}>5 Partners</option>
                <option value={6}>6 Partners</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loadingAi}
                className="w-full h-full py-3 px-4 rounded-xl bg-[#155e39] hover:bg-[#114b2d] active:scale-[0.98] text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingAi ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Planning...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Plan with AI</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Trending Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-stone-400 font-semibold">Try exploring:</span>
            {TRENDING_DESTINATIONS.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => {
                  setDestinationInput(dest);
                  runAiTripResearch(dest, durationDays, groupSize);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  activeDestination.toLowerCase() === dest.toLowerCase()
                    ? "bg-[#155e39] text-white shadow-xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── OUTPUT: THE TRIP PLAN & SAVINGS RESULT ─── */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Header Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {activeDestination}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                {durationDays} Days • {groupSize} {groupSize === 1 ? "Traveler" : "Travel Partners"}
              </span>
            </div>

            {aiSource && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155e39] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <Sparkles size={13} />
                {aiSource === "gemini_ai" ? "Gemini Live Rate Research" : "Verified Benchmark Plan"}
              </span>
            )}
          </div>

          {aiSummary && (
            <p className="text-stone-600 text-sm leading-relaxed max-w-3xl pt-1">
              {aiSummary}
            </p>
          )}
        </div>

        {/* ─── THE BIG COMPARISON CARDS (SPACIOUS & ELEGANT) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Solo Card */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200/90 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-500">
              <span>Traveling Solo (1 Person)</span>
              <span className="bg-stone-200/80 text-stone-600 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                Full Supplement Penalty
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-stone-700">
              {formatCurrency(summary.totalSoloCost)}
            </div>
            <p className="text-xs text-stone-500 leading-normal">
              You are forced to pay 100% of the entire hotel room and private vehicle charter out of pocket.
            </p>
          </div>

          {/* Sathi Partners Card */}
          <div className="bg-[#155e39] text-white rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-200">
              <span>Your Share with {groupSize} Partners</span>
              <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                {summary.savingsPercent}% Cheaper
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {formatCurrency(summary.perPersonCost)}
              <span className="text-xs text-emerald-200 font-normal ml-2">/ person</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#155e39] text-xs font-bold shadow-xs">
              <TrendingDown size={14} />
              You Save {formatCurrency(summary.savingsPerPerson)} per traveler
            </div>
          </div>
        </div>

        {/* ─── GROUP SIZE QUICK SIMULATOR PILLS ─── */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200/80 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Users size={15} className="text-[#155e39]" />
              Simulate Partner Savings:
            </span>
            <span className="text-stone-900">
              {groupSize} Confirmed Travelers
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setGroupSize(num)}
                className={`py-2 rounded-xl text-xs font-bold transition ${
                  groupSize === num
                    ? "bg-[#155e39] text-white shadow-sm ring-2 ring-[#155e39]/20"
                    : "bg-white text-stone-700 hover:bg-stone-200 border border-stone-200"
                }`}
              >
                {num === 1 ? "1 Solo" : `${num} Partners`}
              </button>
            ))}
          </div>
        </div>

        {/* ─── ITEMIZED EXPENSE BREAKDOWN (CLEAN, NO CLUTTER) ─── */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
              Itemized Expenses ({items.length} items)
            </h3>
            <span className="text-xs text-stone-500">
              Click pill to switch between <span className="font-semibold text-stone-800">Shared</span> & <span className="font-semibold text-stone-800">Personal</span>
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const meta = CATEGORY_META[item.category] || CATEGORY_META.OTHER;
              const Icon = meta.icon;
              const perPersonShare = item.isShared
                ? Math.ceil(item.amount / Math.max(1, groupSize))
                : item.amount;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition duration-150 gap-4 ${
                    item.isShared
                      ? "bg-white border-stone-200 hover:border-stone-300"
                      : "bg-stone-50/70 border-stone-200/80"
                  }`}
                >
                  {/* Left: Icon & Title */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.bg} ${meta.color}`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-stone-900">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          {meta.label}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Amounts & Shared Switch */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {/* Amount */}
                    <div className="text-right">
                      <div className="text-base font-black text-stone-900">
                        {formatCurrency(perPersonShare)}
                        <span className="text-[10px] text-stone-500 font-normal"> / person</span>
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Total: {formatCurrency(item.amount)}
                      </div>
                    </div>

                    {/* Shared Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => handleToggleShared(item.id)}
                      disabled={!editable}
                      title={
                        item.isShared
                          ? "Click to make this a personal expense"
                          : "Click to split this expense with all partners"
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        item.isShared
                          ? "bg-emerald-100 text-[#155e39] border border-emerald-300/80 hover:bg-emerald-200"
                          : "bg-stone-200 text-stone-700 border border-stone-300 hover:bg-stone-300"
                      }`}
                    >
                      {item.isShared ? (
                        <>
                          <Users size={13} />
                          Shared (÷ {groupSize})
                        </>
                      ) : (
                        <>
                          <Check size={13} />
                          Personal (Fixed)
                        </>
                      )}
                    </button>

                    {/* Delete button */}
                    {editable && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom expense button / form */}
          {editable && (
            <div className="pt-2">
              {!isAddingItem ? (
                <button
                  type="button"
                  onClick={() => setIsAddingItem(true)}
                  className="w-full py-3 rounded-2xl border border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Plus size={16} className="text-[#155e39]" />
                  Add Custom Expense (e.g. Resort, Boat, Guide)
                </button>
              ) : (
                <form
                  onSubmit={handleAddItem}
                  className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Add New Expense Item
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingItem(false)}
                      className="text-xs text-stone-400 hover:text-stone-700 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Expense Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Resort cottage, 4WD Jeep"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Category
                      </label>
                      <select
                        value={newItemCategory}
                        onChange={(e) =>
                          setNewItemCategory(e.target.value as CostCategory)
                        }
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] outline-none"
                      >
                        <option value="ACCOMMODATION">Stay / Hotel</option>
                        <option value="TRANSPORT">Transport</option>
                        <option value="FOOD">Food & Dining</option>
                        <option value="ACTIVITIES">Activities</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Total Cost (৳ BDT) *
                      </label>
                      <input
                        type="number"
                        required
                        min="50"
                        placeholder="5000"
                        value={newItemAmount}
                        onChange={(e) =>
                          setNewItemAmount(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] outline-none font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newItemIsShared}
                        onChange={(e) => setNewItemIsShared(e.target.checked)}
                        className="rounded text-[#155e39] focus:ring-[#155e39] w-4 h-4"
                      />
                      <span className="text-xs font-bold text-stone-700">
                        Split with all travel partners
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingItem(false)}
                        className="px-4 py-2 rounded-xl text-stone-600 text-xs font-semibold hover:bg-stone-200/60"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#155e39] hover:bg-[#114b2d] text-white text-xs font-bold shadow-sm"
                      >
                        Add Expense
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* CTA: Post This Trip */}
        {showPostTripButton && (
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Ready to find verified travel partners for {activeDestination}?
              </h4>
              <p className="text-xs text-stone-500">
                Post this trip on Sathi to start reviewing partner join requests.
              </p>
            </div>
            <Link
              href={`/trips/new?destination=${encodeURIComponent(activeDestination)}&budget=${summary.perPersonCost}&groupSize=${groupSize}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#155e39] hover:bg-[#114b2d] active:scale-[0.98] text-white font-bold text-xs transition duration-150 shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              Post this Trip on Sathi
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* ─── OPTIONAL API KEY MODAL ─── */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <Key size={16} className="text-[#155e39]" />
                Google Gemini API Key
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              If you have a Google AI Studio API key, paste it here. It will be stored in your browser session for live dynamic AI research on any location.
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs font-mono focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] outline-none"
            />

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#155e39] hover:underline"
              >
                Get free key on Google AI Studio ↗
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveApiKey("")}
                  className="px-3 py-1.5 rounded-xl text-stone-500 text-xs font-semibold hover:bg-stone-100"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveApiKey(customApiKey)}
                  className="px-4 py-1.5 rounded-xl bg-[#155e39] text-white text-xs font-bold shadow-xs hover:bg-[#114b2d]"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
