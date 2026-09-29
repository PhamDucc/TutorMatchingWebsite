import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const teachingMode = searchParams.get("teachingMode");

  const profiles = await prisma.tutorProfile.findMany({
    where: {
      ...(subject ? { subjects: { has: subject } } : {}),
      ...(teachingMode ? { teachingMode: teachingMode as any } : {}),
    },
    include: {
      user: {
        select: { fullName: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ profiles }, { status: 200 });
}