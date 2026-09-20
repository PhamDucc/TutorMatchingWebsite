import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Lấy hồ sơ gia sư của chính mình
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 });
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: payload.userId },
  });

  return NextResponse.json({ profile }, { status: 200 });
}

// Tạo hoặc cập nhật hồ sơ gia sư
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 });
    }

    if (payload.role !== "TUTOR") {
      return NextResponse.json(
        { error: "Chỉ tài khoản Gia sư mới có thể tạo hồ sơ này" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      subjects,
      degree,
      experienceYears,
      pricePerHour,
      teachingMode,
      location,
      bio,
    } = body;

    if (!subjects || subjects.length === 0 || !pricePerHour || !teachingMode) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const profile = await prisma.tutorProfile.upsert({
      where: { userId: payload.userId },
      update: {
        subjects,
        degree,
        experienceYears: experienceYears ? Number(experienceYears) : 0,
        pricePerHour: Number(pricePerHour),
        teachingMode,
        location,
        bio,
      },
      create: {
        userId: payload.userId,
        subjects,
        degree,
        experienceYears: experienceYears ? Number(experienceYears) : 0,
        pricePerHour: Number(pricePerHour),
        teachingMode,
        location,
        bio,
      },
    });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}