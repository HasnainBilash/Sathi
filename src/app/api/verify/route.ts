import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/verify — mock verification for MVP
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nidNumber } = await req.json();

    if (!nidNumber || nidNumber.length < 10) {
      return NextResponse.json(
        { error: "Invalid NID number" },
        { status: 400 }
      );
    }

    // MVP: Mock verification — in production this would call Porichoy or Didit API
    // Simulate a brief delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update user as verified
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Identity verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
