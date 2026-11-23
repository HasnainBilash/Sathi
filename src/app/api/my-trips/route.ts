import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/my-trips — get current user's hosted trips, joined trips, and sent join requests
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Trips created/hosted by this user
    const hostedTrips = await prisma.trip.findMany({
      where: { creatorId: userId },
      include: {
        creator: {
          select: { id: true, name: true, image: true, isVerified: true },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, image: true, isVerified: true } },
          },
        },
        joinRequests: {
          where: { status: "PENDING" },
          include: {
            user: { select: { id: true, name: true, image: true, isVerified: true } },
          },
        },
        _count: { select: { members: true, joinRequests: true, messages: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Trips joined by this user (where user is not the creator)
    const joinedMemberships = await prisma.tripMember.findMany({
      where: {
        userId,
        trip: { creatorId: { not: userId } },
      },
      include: {
        trip: {
          include: {
            creator: {
              select: { id: true, name: true, image: true, isVerified: true },
            },
            members: {
              include: {
                user: { select: { id: true, name: true, image: true, isVerified: true } },
              },
            },
            _count: { select: { members: true, messages: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const joinedTrips = joinedMemberships.map((m) => m.trip);

    // 3. Sent join requests waiting for host response
    const sentRequests = await prisma.joinRequest.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            creator: {
              select: { id: true, name: true, image: true, isVerified: true },
            },
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      hostedTrips,
      joinedTrips,
      sentRequests,
    });
  } catch (error) {
    console.error("Error fetching user trips:", error);
    return NextResponse.json({ error: "Failed to fetch your trips" }, { status: 500 });
  }
}
