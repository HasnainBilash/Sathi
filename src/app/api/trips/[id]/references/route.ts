import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/trips/[id]/references — leave a reference
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
    const { receiverId, punctuality, communication, trustworthiness, overallRating, comment } =
      await req.json();

    // Verify trip is completed
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.status !== "COMPLETED") {
      return NextResponse.json({ error: "Trip must be completed first" }, { status: 400 });
    }

    // Verify both users are members
    const [giverMember, receiverMember] = await Promise.all([
      prisma.tripMember.findUnique({
        where: { tripId_userId: { tripId, userId: session.user.id } },
      }),
      prisma.tripMember.findUnique({
        where: { tripId_userId: { tripId, userId: receiverId } },
      }),
    ]);

    if (!giverMember || !receiverMember) {
      return NextResponse.json({ error: "Both users must be trip members" }, { status: 400 });
    }

    if (session.user.id === receiverId) {
      return NextResponse.json({ error: "Cannot review yourself" }, { status: 400 });
    }

    // Check if already reviewed
    const existing = await prisma.reference.findUnique({
      where: {
        tripId_giverId_receiverId: {
          tripId,
          giverId: session.user.id,
          receiverId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 400 });
    }

    const reference = await prisma.reference.create({
      data: {
        tripId,
        giverId: session.user.id,
        receiverId,
        punctuality: Math.min(5, Math.max(1, punctuality)),
        communication: Math.min(5, Math.max(1, communication)),
        trustworthiness: Math.min(5, Math.max(1, trustworthiness)),
        overallRating: Math.min(5, Math.max(1, overallRating)),
        comment,
      },
    });

    return NextResponse.json(reference, { status: 201 });
  } catch (error) {
    console.error("Error creating reference:", error);
    return NextResponse.json({ error: "Failed to create reference" }, { status: 500 });
  }
}
