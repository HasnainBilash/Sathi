import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/trips — list all open trips
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get("destination");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = { status: "OPEN" };

    if (destination) {
      where.destination = { contains: destination, mode: "insensitive" };
    }
    if (startDate) {
      where.startDate = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.endDate = { lte: new Date(endDate) };
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, image: true, isVerified: true },
        },
        members: { include: { user: { select: { id: true, name: true, image: true } } } },
        _count: { select: { joinRequests: true, members: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

// POST /api/trips — create a new trip
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, destination, description, startDate, endDate,
      budgetPerPerson, maxGroupSize, pace, roomSharing,
      hotelName, hotelAddress, meetingPoint, costBreakdown,
    } = body;

    if (!title || !destination || !startDate || !endDate || !budgetPerPerson) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        destination,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budgetPerPerson: parseFloat(budgetPerPerson),
        maxGroupSize: parseInt(maxGroupSize) || 5,
        pace: pace || "MODERATE",
        roomSharing: roomSharing || "FLEXIBLE",
        hotelName,
        hotelAddress,
        meetingPoint,
        costBreakdown:
          typeof costBreakdown === "string"
            ? costBreakdown
            : costBreakdown
            ? JSON.stringify(costBreakdown)
            : undefined,
        creatorId: session.user.id,
        members: {
          create: { userId: session.user.id },
        },
      },
      include: {
        creator: { select: { id: true, name: true, image: true, isVerified: true } },
        members: { include: { user: { select: { id: true, name: true, image: true } } } },
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
