"use client";

import { useState, useEffect, useMemo } from "react";
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
  HelpCircle,
  TrendingDown,
  RotateCcw,
  Check,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CostSplitCalculatorProps {
  initialDestination?: string;
  initialGroupSize?: number;
  initialItems?: CostItem[];
  editable?: boolean;
  onItemsChange?: (items: CostItem[], perPersonBudget: number) => void;
}

const CATEGORY_META: Record<
  CostCategory,
  { label: string; icon: typeof Hotel; color: string; bg: string }
> = {
  ACCOMMODATION: {
    label: "Stay / Hotel",
    icon: Hotel,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  TRANSPORT: {
    label: "Transport",
    icon: Car,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  FOOD: {
    label: "Food & Dining",
    icon: Utensils,
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
  },
  ACTIVITIES: {
    label: "Activities",
    icon: Compass,
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  OTHER: {
    label: "Other",
    icon: Layers,
    color: "text-stone-700",
    bg: "bg-stone-50 border-stone-200",
  },
};

const POPULAR_DESTINATIONS = [
  "Sajek Valley",
  "Sreemangal",
  "Cox's Bazar",
  "Bandarban",
  "Tanguar Haor",
  "Saint Martin",
  "Sylhet",
];

export default function CostSplitCalculator({
  initialDestination = "Sajek Valley",
  initialGroupSize = 4,
  initialItems,
  editable = true,
  onItemsChange,
}: CostSplitCalculatorProps) {
  const [destination, setDestination] = useState(initialDestination);
  const [groupSize, setGroupSize] = useState(initialGroupSize);
  const [items, setItems] = useState<CostItem[]>(initialItems || []);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSource, setAiSource] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // New item draft form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<CostCategory>("ACCOMMODATION");
  const [newItemAmount, setNewItemAmount] = useState<number | "">("");
  const [newItemIsShared, setNewItemIsShared] = useState(true);
  const [newItemNotes, setNewItemNotes] = useState("");

  // Fetch initial breakdown from API if not provided
  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      fetchCostResearch(destination);
    }
  }, []);

  const fetchCostResearch = async (targetDest: string) => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/gemini/research-costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: targetDest,
          durationDays: 3,
          groupSize,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setAiSource(data.source || "curated_benchmark");
        setAiSummary(data.summary || null);
      }
    } catch (err) {
      console.error("Failed to fetch cost research:", err);
    } finally {
      setLoadingAi(false);
    }
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

  // Notify parent component if callback provided
  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(items, summary.perPersonCost);
    }
  }, [items, summary.perPersonCost, onItemsChange]);

  // Handlers for modifying items
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
      notes: newItemNotes.trim() || undefined,
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemName("");
    setNewItemAmount("");
    setNewItemNotes("");
    setIsAddingItem(false);
  };

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest);
    fetchCostResearch(dest);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
      {/* Top Banner / Header */}
      <div className="p-6 sm:p-8 bg-stone-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Sparkles size={14} />
              Fair-Share Cost Split Engine
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Where the Money Goes
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-xl">
              Shared expenses (cottages, 4WD jeeps, guides) drop with every partner who joins. Individual costs (food, personal entry) stay fixed.
            </p>
          </div>

          {/* AI Trigger Button */}
          {editable && (
            <button
              type="button"
              onClick={() => fetchCostResearch(destination)}
              disabled={loadingAi}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition duration-150 disabled:opacity-50 shrink-0 shadow-sm"
            >
              {loadingAi ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Researching Rates...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Research with Gemini AI
                </>
              )}
            </button>
          )}
        </div>

        {/* Quick Destination Chips */}
        {editable && (
          <div className="mt-6 pt-5 border-t border-stone-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Select Destination:
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DESTINATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDestinationSelect(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    destination.toLowerCase() === d.toLowerCase()
                      ? "bg-white text-stone-900 shadow-sm"
                      : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Group Size Controls & Comparison Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Member Slider / Selector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <Users size={15} className="text-[#155e39]" />
                Confirmed Travelers:
              </span>
              <span className="text-base text-stone-900 font-black">
                {groupSize} {groupSize === 1 ? "Person (Solo)" : "Travel Partners"}
              </span>
            </div>

            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGroupSize(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    groupSize === num
                      ? "bg-[#155e39] text-white shadow-sm ring-2 ring-[#155e39]/20"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {num} {num === 1 ? "Solo" : "P"}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              {groupSize === 1
                ? "Traveling alone forces you to bear 100% of the room and vehicle cost (the Single Supplement penalty)."
                : `By traveling with ${groupSize} partners, each shared vehicle and room is split ${groupSize} ways.`}
            </p>
          </div>

          {/* Real-Time Cost Differential Card */}
          <div className="lg:col-span-7 bg-stone-50 rounded-2xl border border-stone-200/90 p-5">
            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-stone-200">
              {/* Solo Cost */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  If Solo
                </div>
                <div className="text-lg sm:text-xl font-bold text-stone-600 line-through">
                  {formatCurrency(summary.totalSoloCost)}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">100% on you</div>
              </div>

              {/* Your Share */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#155e39] mb-1">
                  Your Share
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900">
                  {formatCurrency(summary.perPersonCost)}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  per traveler
                </div>
              </div>

              {/* Savings */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  You Save
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#155e39]">
                  {formatCurrency(summary.savingsPerPerson)}
                </div>
                <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-0.5">
                  <TrendingDown size={11} />
                  {summary.savingsPercent}% Cheaper
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight or Benchmark Note */}
        {aiSummary && (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles size={16} className="text-[#155e39] shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 leading-relaxed">
              <span className="font-bold text-stone-900">
                {aiSource === "gemini_ai" ? "Gemini AI Rate Analysis: " : "Verified Benchmark Note: "}
              </span>
              {aiSummary}
            </div>
          </div>
        )}

        {/* Items Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Itemized Expenses ({items.length} items)
            </h4>
            <span className="text-xs text-stone-500">
              Click <span className="font-semibold text-stone-800">&quot;Shared / Individual&quot;</span> to toggle split behavior
            </span>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => {
              const meta = CATEGORY_META[item.category] || CATEGORY_META.OTHER;
              const Icon = meta.icon;
              const perPersonShare = item.isShared
                ? Math.ceil(item.amount / Math.max(1, groupSize))
                : item.amount;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition duration-150 ${
                    item.isShared
                      ? "bg-white border-stone-200 hover:border-stone-300"
                      : "bg-stone-50/70 border-stone-200/80"
                  }`}
                >
                  {/* Left: Category Icon & Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.bg} ${meta.color}`}
                    >
                      <Icon size={18} />
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
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Amounts, Shared Toggle, & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {/* Amounts breakdown */}
                    <div className="text-right">
                      <div className="text-sm font-black text-stone-900">
                        {formatCurrency(perPersonShare)}
                        <span className="text-[10px] text-stone-500 font-normal"> / person</span>
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Total: {formatCurrency(item.amount)}
                      </div>
                    </div>

                    {/* Shared vs Individual Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => handleToggleShared(item.id)}
                      disabled={!editable}
                      title={
                        item.isShared
                          ? "Click to make this an individual expense"
                          : "Click to split this expense with all partners"
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        item.isShared
                          ? "bg-emerald-100 text-[#155e39] border border-emerald-300/60 hover:bg-emerald-200/70"
                          : "bg-stone-200/80 text-stone-700 border border-stone-300 hover:bg-stone-300"
                      }`}
                    >
                      {item.isShared ? (
                        <>
                          <Users size={12} />
                          Shared (÷ {groupSize})
                        </>
                      ) : (
                        <>
                          <Check size={12} />
                          Individual (Fixed)
                        </>
                      )}
                    </button>

                    {/* Delete item button */}
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

            {items.length === 0 && (
              <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-6">
                <p className="text-xs text-stone-500">No expense items yet.</p>
                <button
                  type="button"
                  onClick={() => fetchCostResearch(destination)}
                  className="mt-2 text-xs font-bold text-[#155e39] hover:underline"
                >
                  Load {destination} benchmarks →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Custom Item Section */}
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
                className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Add New Expense Item
                  </h5>
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
                      placeholder="e.g. Speedboat hire, Eco-cottage room"
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

                  <div className="sm:col-span-8">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 nights package, includes fuel"
                      value={newItemNotes}
                      onChange={(e) => setNewItemNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-[#155e39]/20 focus:border-[#155e39] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-4 flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                      <input
                        type="checkbox"
                        checked={newItemIsShared}
                        onChange={(e) => setNewItemIsShared(e.target.checked)}
                        className="rounded text-[#155e39] focus:ring-[#155e39] w-4 h-4"
                      />
                      <span className="text-xs font-bold text-stone-700">
                        Split with partners
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
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
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
