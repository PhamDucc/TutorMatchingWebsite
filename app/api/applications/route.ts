import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Lấy danh sách yêu cầu mà gia sư đang đăng nhập đã ứng tuyển
export async function GET() {
  const payload = await getPayload();

  if (!payload || payload.role !== "TUTOR") {
    return NextResponse.json({ appliedRequestIds: [] }, { status: 200 });
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: payload.userId },
    select: { id: true },
  });

  if (!profile) {
    return NextResponse.json({ appliedRequestIds: [] }, { status: 200 });
  }

  const applications = await prisma.application.findMany({
    where: { tutorId: profile.id },
    select: { requestId: true },
  });

  return NextResponse.json(
    { appliedRequestIds: applications.map((a) => a.requestId) },
    { status: 200 }
  );
}

// Gia sư ứng tuyển vào 1 yêu cầu
export async function POST(req: Request) {
  try {
    const payload = await getPayload();

    if (!payload) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    if (payload.role !== "TUTOR") {
      return NextResponse.json(
        { error: "Chỉ tài khoản Gia sư mới có thể ứng tuyển" },
        { status: 403 }
      );
    }

    const { requestId, message } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "Thiếu thông tin yêu cầu cần ứng tuyển" },
        { status: 400 }
      );
    }

    if (message && String(message).length > 500) {
      return NextResponse.json(
        { error: "Lời nhắn tối đa 500 ký tự" },
        { status: 400 }
      );
    }

    // Application liên kết tới TutorProfile (không phải User), nên phải có hồ sơ trước
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: payload.userId },
    });

    if (!profile) {
      return NextResponse.json(
        {
          error: "Bạn cần tạo hồ sơ gia sư trước khi ứng tuyển",
          code: "NO_PROFILE",
        },
        { status: 400 }
      );
    }

    const studentRequest = await prisma.studentRequest.findUnique({
      where: { id: requestId },
    });

    if (!studentRequest || studentRequest.status !== "OPEN") {
      return NextResponse.json(
        { error: "Yêu cầu này không còn mở để ứng tuyển" },
        { status: 404 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: {
        tutorId_requestId: { tutorId: profile.id, requestId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bạn đã ứng tuyển yêu cầu này rồi" },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        tutorId: profile.id,
        requestId,
        message: message ? String(message).trim() : null,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
