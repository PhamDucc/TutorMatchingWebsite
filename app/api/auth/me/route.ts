import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, fullName: true, email: true, role: true },
  });

  return NextResponse.json({ user }, { status: 200 });
}