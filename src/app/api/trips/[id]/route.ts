import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/trips/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true, image: true, isVerified: true, bio: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, image: true, isVerified: true },
            },
          },
        },
        joinRequests: {
          include: {
            user: {
              select: { id: true, name: true, image: true, isVerified: true },
            },
          },
        },
        _count: { select: { members: true, messages: true } },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Check if user is a member
    const isMember = trip.members.some((m) => m.userId === userId);
    const isCreator = trip.creatorId === userId;

    // Hide sensitive info from non-members
    const tripData = {
      ...trip,
      hotelName: isMember ? trip.hotelName : null,
      hotelAddress: isMember ? trip.hotelAddress : null,
      meetingPoint: isMember ? trip.meetingPoint : null,
      joinRequests: isCreator ? trip.joinRequests : [],
      isMember,
      isCreator,
    };

    return NextResponse.json(tripData);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 });
  }
}
