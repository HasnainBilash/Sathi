import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/trips/[id]/join — request to join a trip
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: tripId } = await params;
    const { message } = await req.json();

    // Check trip exists and is open
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { _count: { select: { members: true } } },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.status !== "OPEN") {
      return NextResponse.json({ error: "Trip is no longer open" }, { status: 400 });
    }

    if (trip.creatorId === session.user.id) {
      return NextResponse.json({ error: "You are the creator of this trip" }, { status: 400 });
    }

    // Check if already a member
    const existingMember = await prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId, userId: session.user.id } },
    });

    if (existingMember) {
      return NextResponse.json({ error: "You are already a member" }, { status: 400 });
    }

    // Check if already requested
    const existingRequest = await prisma.joinRequest.findUnique({
      where: { tripId_userId: { tripId, userId: session.user.id } },
    });

    if (existingRequest) {
      return NextResponse.json({ error: "You have already sent a request" }, { status: 400 });
    }

    // Check if trip is full
    if (trip._count.members >= trip.maxGroupSize) {
      return NextResponse.json({ error: "Trip is full" }, { status: 400 });
    }

    const joinRequest = await prisma.joinRequest.create({
      data: {
        tripId,
        userId: session.user.id,
        message,
      },
      include: {
        user: { select: { id: true, name: true, image: true, isVerified: true } },
      },
    });

    return NextResponse.json(joinRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating join request:", error);
    return NextResponse.json({ error: "Failed to send join request" }, { status: 500 });
  }
}
