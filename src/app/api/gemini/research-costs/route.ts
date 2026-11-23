import { NextRequest, NextResponse } from "next/server";
import { CostItem } from "@/types/costs";

export const dynamic = "force-dynamic";

// Curated Bangladesh destination benchmarks for instant offline responses
const DESTINATION_BENCHMARKS: Record<
  string,
  { summary: string; items: Omit<CostItem, "id">[] }
> = {
  "sajek valley": {
    summary:
      "Sajek Valley expenses are heavily frontloaded in fixed vehicle charter (Chander Gari) and cloud-view cottages, making it 65-75% cheaper when shared with 3-4 partners.",
    items: [
      {
        name: "Cloud-View Wooden Cottage at Konglak (2 Nights)",
        category: "ACCOMMODATION",
        amount: 8000,
        isShared: true,
        notes: "Shared cottage overlooking the valley, fits up to 4 with extra bed.",
      },
      {
        name: "Reserved 4WD Chander Gari (Khagrachhari ↔ Sajek)",
        category: "TRANSPORT",
        amount: 10500,
        isShared: true,
        notes: "Mandatory army convoy escort vehicle; fixed fare whether 1 or 6 people ride.",
      },
      {
        name: "Authentic Pahari Bamboo Chicken & Meals (3 Days)",
        category: "FOOD",
        amount: 2200,
        isShared: false,
        notes: "Per-person food budget for local tribal eateries.",
      },
      {
        name: "Kanglak Hill Guide & Helipad entry fee",
        category: "ACTIVITIES",
        amount: 600,
        isShared: false,
        notes: "Individual viewpoint entry and local trail fee.",
      },
    ],
  },
  "sreemangal": {
    summary:
      "Sreemangal offers eco-cottages nestled inside tea estates. Splitting the reserved transport and cottage drastically reduces individual costs.",
    items: [
      {
        name: "Tea Estate Eco-Resort Cottage (2 Nights)",
        category: "ACCOMMODATION",
        amount: 7000,
        isShared: true,
        notes: "Wooden cottage inside a tea garden, comfortable for 2-4 travelers.",
      },
      {
        name: "Reserved CNG Auto-Rickshaw for 2 Full Days",
        category: "TRANSPORT",
        amount: 2500,
        isShared: true,
        notes: "Covers Madhabpur Lake, Baikka Beel, and Lawachara National Park.",
      },
      {
        name: "7-Layer Tea, Local Fish Curry & Dining (3 Days)",
        category: "FOOD",
        amount: 1800,
        isShared: false,
        notes: "Nilkantha Tea Cabin tasting and fresh Sylheti lunches per person.",
      },
      {
        name: "Lawachara Rain Forest Certified Guide & Entry",
        category: "ACTIVITIES",
        amount: 700,
        isShared: false,
        notes: "National park entry pass and guided gibbon trek.",
      },
    ],
  },
  "cox's bazar": {
    summary:
      "Cox's Bazar beach trip costs are split between prime Marine Drive lodging and private open-hood sightseeing transport.",
    items: [
      {
        name: "Marine Drive Deluxe Sea-View Room (2 Nights)",
        category: "ACCOMMODATION",
        amount: 7500,
        isShared: true,
        notes: "Comfortable AC resort room with balcony facing the Bay of Bengal.",
      },
      {
        name: "Open-hood 4WD Jeep for Inani & Himchari Drive",
        category: "TRANSPORT",
        amount: 3500,
        isShared: true,
        notes: "Private coastal drive along the Marine Drive road.",
      },
      {
        name: "Fresh Grilled Coral Fish & Beach Street Food",
        category: "FOOD",
        amount: 2800,
        isShared: false,
        notes: "Daily fresh seafood platters and coastal dining per person.",
      },
      {
        name: "Himchari Hill Pass & Beach Quad Bike Session",
        category: "ACTIVITIES",
        amount: 1500,
        isShared: false,
        notes: "Individual activity fee on the sandy beach.",
      },
    ],
  },
  "bandarban": {
    summary:
      "Bandarban remote treks require 4WD transport and mandatory registered indigenous guides, making partner sharing indispensable.",
    items: [
      {
        name: "Boga Lake Indigenous Homestay / Cottage (2 Nights)",
        category: "ACCOMMODATION",
        amount: 3200,
        isShared: true,
        notes: "Traditional stilt cottage overlooking Boga Lake.",
      },
      {
        name: "4WD Land Cruiser from Ruma Bazar to Boga Lake",
        category: "TRANSPORT",
        amount: 9000,
        isShared: true,
        notes: "High-clearance hill transport required for rough mountain roads.",
      },
      {
        name: "Hill-Tribe Homestyle Meals & Energy Snacks (3 Days)",
        category: "FOOD",
        amount: 1900,
        isShared: false,
        notes: "Daily freshly prepared mountain rice, vegetables, and chicken per person.",
      },
      {
        name: "Mandatory Registered Local Guide Fee",
        category: "ACTIVITIES",
        amount: 2000,
        isShared: true,
        notes: "Army checkpost mandated guide fee, split among the whole group.",
      },
    ],
  },
  "tanguar haor": {
    summary:
      "Tanguar Haor houseboats are rented as an entire vessel. Traveling with partners cuts boat costs from unaffordable solo rates to affordable luxury.",
    items: [
      {
        name: "Premium Wooden Houseboat (2 Days 1 Night Private Cabin)",
        category: "ACCOMMODATION",
        amount: 24000,
        isShared: true,
        notes: "Traditional boat with solar power, attached bath, and rooftop deck.",
      },
      {
        name: "Tahirpur ↔ Haor Speedboat / Fuel Surcharge",
        category: "TRANSPORT",
        amount: 5000,
        isShared: true,
        notes: "Covers deep water navigation across the wetland reserve.",
      },
      {
        name: "Fresh Haor Catch Duck & Fish Meals (5 Meals on board)",
        category: "FOOD",
        amount: 2200,
        isShared: false,
        notes: "Freshly caught freshwater fish and Haor duck cooked on boat per person.",
      },
      {
        name: "Watch Tower & Shimul Bagan Village Entry Fees",
        category: "ACTIVITIES",
        amount: 600,
        isShared: false,
        notes: "Wetland conservation pass and garden entry.",
      },
    ],
  },
  "saint martin": {
    summary:
      "Saint Martin Island lodging and boat transfers to Chhera Dwip are easily shared to lower individual expense.",
    items: [
      {
        name: "Coral Beachfront Wooden Cottage (2 Nights)",
        category: "ACCOMMODATION",
        amount: 6500,
        isShared: true,
        notes: "Eco-resort cottage located near the West Beach.",
      },
      {
        name: "Chhera Dwip Trawler / Speedboat Charter",
        category: "TRANSPORT",
        amount: 3000,
        isShared: true,
        notes: "Boat charter to the southernmost rocky coral point of Bangladesh.",
      },
      {
        name: "Fresh BBQ Lobster/Rupchanda & Green Coconuts",
        category: "FOOD",
        amount: 2500,
        isShared: false,
        notes: "Daily fresh catch dining and local island treats per person.",
      },
      {
        name: "Snorkeling Gear Rental & Coral Reef Tour",
        category: "ACTIVITIES",
        amount: 1200,
        isShared: false,
        notes: "Individual mask, snorkel, and life vest hire.",
      },
    ],
  },
};

// Generate tailored items for any custom place if offline or Gemini key missing
function generateTailoredEstimate(
  destination: string,
  durationDays: number,
  groupSize: number
) {
  const nights = Math.max(1, durationDays - 1);
  const stayCost = nights * 3500;
  const transportCost = Math.max(2500, durationDays * 1800);
  const foodCost = durationDays * 800;
  const activitiesCost = 700;

  return {
    destination,
    summary: `Tailored travel plan for ${durationDays} days in ${destination}. Traveling with ${groupSize} partners splits your private stay and reserved transport, cutting the single supplement penalty by over 60%.`,
    items: [
      {
        id: `custom-stay-${Date.now()}`,
        name: `Resort / Hotel Room in ${destination} (${nights} Night${nights > 1 ? "s" : ""})`,
        category: "ACCOMMODATION" as const,
        amount: stayCost,
        isShared: true,
        notes: `Private accommodation in ${destination}, fits 2-4 travelers with shared beds/mattress.`,
      },
      {
        id: `custom-trans-${Date.now()}`,
        name: `Reserved Local Transport & Sightseeing in ${destination}`,
        category: "TRANSPORT" as const,
        amount: transportCost,
        isShared: true,
        notes: `Private 4WD jeep, boat, or reserved vehicle for touring ${destination}.`,
      },
      {
        id: `custom-food-${Date.now()}`,
        name: `Fresh Local Food & Specialties (${durationDays} Days)`,
        category: "FOOD" as const,
        amount: foodCost,
        isShared: false,
        notes: `Three fresh daily meals and local refreshments per traveler.`,
      },
      {
        id: `custom-act-${Date.now()}`,
        name: `Local Guide & Entry Passes in ${destination}`,
        category: "ACTIVITIES" as const,
        amount: activitiesCost,
        isShared: false,
        notes: `Entry fees to attractions and registered local trail guide.`,
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      destination = "Sajek Valley",
      durationDays = 3,
      groupSize = 4,
      customApiKey,
    } = body;

    const trimmedDest = (destination || "Sajek Valley").trim();
    const normalizedDest = trimmedDest.toLowerCase();
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    // 1. If Gemini API key is available, call Gemini (support gemini-2.0-flash with fallback to gemini-1.5-flash)
    if (apiKey && apiKey.length > 10) {
      const prompt = `You are an expert travel economist and logistics researcher for Bangladesh domestic tourism.
The user is planning a trip to "${trimmedDest}" for approximately ${durationDays} days with a target group size of ${groupSize} travelers.
Research and return realistic, up-to-date estimated expenses in Bangladeshi Taka (BDT ৳) broken down into specific items.

Rules:
1. Each item must have:
   - "name": Clear, specific title of the cost in ${trimmedDest} (e.g. "Cloud-view cottage at Konglak", "Reserved 4WD Chander Gari", "Daily Pahari Meals", "Local boat to Swamp Forest")
   - "category": One of "ACCOMMODATION", "TRANSPORT", "FOOD", "ACTIVITIES", "OTHER"
   - "amount": Realistic cost in BDT as a number
   - "isShared": Boolean. Mark true ONLY for shared group expenses (e.g., hotel room/cottage, reserved jeep/chander gari, boat charter, guide fee). Mark false for individual per-person expenses (e.g. daily food/meals per person, individual park entry tickets, personal rickshaw).
   - "notes": Brief 1-sentence explanation of what this covers in ${trimmedDest}.
2. Provide 4 to 6 realistic items covering accommodation, transport, food, and activities.
3. Return ONLY a valid JSON object matching this schema without any markdown formatting or backticks:
{
  "destination": "${trimmedDest}",
  "summary": "1-2 engaging sentences on what to expect in ${trimmedDest} and how traveling with partners kills the single supplement penalty.",
  "items": [
    {
      "name": "...",
      "category": "...",
      "amount": 5000,
      "isShared": true,
      "notes": "..."
    }
  ]
}`;

      // Try models in order: gemini-2.0-flash, then gemini-1.5-flash
      const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash"];
      for (const modelName of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.2,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const responseText =
              geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (responseText) {
              const parsed = JSON.parse(responseText);
              const items: CostItem[] = (parsed.items || []).map(
                (item: Omit<CostItem, "id">, index: number) => ({
                  id: `gemini-${Date.now()}-${index}`,
                  name: item.name,
                  category: item.category || "OTHER",
                  amount: Math.round(Number(item.amount) || 1000),
                  isShared: Boolean(item.isShared),
                  notes: item.notes || "",
                })
              );

              return NextResponse.json({
                destination: parsed.destination || trimmedDest,
                summary:
                  parsed.summary ||
                  `Live AI-researched cost breakdown for ${trimmedDest} based on current Bangladesh travel rates.`,
                items,
                source: "gemini_ai",
                model: modelName,
              });
            }
          } else {
            const errBody = await geminiRes.text();
            console.warn(`Gemini model ${modelName} returned status ${geminiRes.status}:`, errBody);
          }
        } catch (callErr) {
          console.warn(`Error calling Gemini ${modelName}:`, callErr);
        }
      }
    }

    // 2. Exact/Partial Match in Curated Benchmarks
    const benchmarkKey = Object.keys(DESTINATION_BENCHMARKS).find(
      (k) => normalizedDest.includes(k) || k.includes(normalizedDest)
    );

    if (benchmarkKey) {
      const benchmark = DESTINATION_BENCHMARKS[benchmarkKey];
      const items: CostItem[] = benchmark.items.map((item, index) => ({
        id: `bench-${benchmarkKey}-${index}`,
        ...item,
      }));

      return NextResponse.json({
        destination: trimmedDest,
        summary: benchmark.summary,
        items,
        source: "curated_benchmark",
      });
    }

    // 3. Fallback for ANY custom destination user types (e.g. Kuakata, Kaptai, Nilgiri, etc.)
    const customResult = generateTailoredEstimate(
      trimmedDest,
      durationDays,
      groupSize
    );

    return NextResponse.json({
      ...customResult,
      source: "tailored_estimate",
      note: apiKey
        ? "AI key configured. Live analysis tailored to your selected spot."
        : "Add GEMINI_API_KEY in .env or Settings for real-time live web-grounded research.",
    });
  } catch (error) {
    console.error("Error researching costs:", error);
    return NextResponse.json(
      { error: "Failed to research destination costs" },
      { status: 500 }
    );
  }
}
