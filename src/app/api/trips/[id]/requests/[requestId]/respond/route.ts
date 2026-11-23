import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/trips/[id]/requests/[requestId]/respond
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: tripId, requestId } = await params;
    const { action } = await req.json(); // "accept" or "decline"

    // Verify user is the trip creator
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { _count: { select: { members: true } } },
    });

    if (!trip || trip.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
    });

    if (!joinRequest || joinRequest.tripId !== tripId) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (action === "accept") {
      // Check if trip is full
      if (trip._count.members >= trip.maxGroupSize) {
        return NextResponse.json({ error: "Trip is full" }, { status: 400 });
      }

      // Accept: update request status and add as member
      await prisma.$transaction([
        prisma.joinRequest.update({
          where: { id: requestId },
          data: { status: "ACCEPTED" },
        }),
        prisma.tripMember.create({
          data: { tripId, userId: joinRequest.userId },
        }),
      ]);

      // Check if trip is now full
      const newCount = trip._count.members + 1;
      if (newCount >= trip.maxGroupSize) {
        await prisma.trip.update({
          where: { id: tripId },
          data: { status: "FULL" },
        });
      }

      return NextResponse.json({ message: "Request accepted" });
    } else if (action === "decline") {
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: "DECLINED" },
      });

      return NextResponse.json({ message: "Request declined" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error responding to request:", error);
    return NextResponse.json({ error: "Failed to respond" }, { status: 500 });
  }
}
