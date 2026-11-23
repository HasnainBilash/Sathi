import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/[id] — get user profile
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        isVerified: true,
        verifiedAt: true,
        createdAt: true,
        _count: {
          select: {
            trips: true,
            tripMembers: true,
          },
        },
        receivedRefs: {
          include: {
            giver: { select: { id: true, name: true, image: true } },
            trip: { select: { id: true, title: true, destination: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate average ratings
    const avgRatings = await prisma.reference.aggregate({
      where: { receiverId: id },
      _avg: {
        punctuality: true,
        communication: true,
        trustworthiness: true,
        overallRating: true,
      },
      _count: true,
    });

    return NextResponse.json({ ...user, ratings: avgRatings });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
