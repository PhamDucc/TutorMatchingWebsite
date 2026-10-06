import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Lấy danh sách yêu cầu (công khai, ai cũng xem được - gia sư dùng để tìm việc)
export async function GET() {
  const requests = await prisma.studentRequest.findMany({
    where: { status: "OPEN" },
    include: {
      student: {
        select: { fullName: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests }, { status: 200 });
}

// Tạo yêu cầu mới (chỉ học sinh)
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

    if (payload.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Chỉ tài khoản Học sinh mới có thể đăng yêu cầu" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { subject, budget, schedule, description } = body;

    if (!subject || !budget) {
      return NextResponse.json(
        { error: "Vui lòng điền môn học và ngân sách" },
        { status: 400 }
      );
    }

    const newRequest = await prisma.studentRequest.create({
      data: {
        studentId: payload.userId,
        subject,
        budget: Number(budget),
        schedule,
        description,
      },
    });

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}