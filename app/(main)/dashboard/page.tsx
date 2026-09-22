import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);

  if (!payload) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">
          Xin chào, {user.fullName}
        </h1>
        <p className="text-ink/60 mb-6">
          {user.role === "STUDENT"
            ? "Bạn đang đăng nhập với vai trò Học sinh"
            : "Bạn đang đăng nhập với vai trò Gia sư"}
        </p>
        <div className="text-sm text-ink/50 space-y-1 mb-6">
          <p>Email: {user.email}</p>
          <p>Tham gia từ: {new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
        </div>

        {user.role === "TUTOR" && (
          <a
            href="/dashboard/tutor-profile"
            className="block w-full text-center bg-navy-900 text-white py-2.5 rounded hover:bg-navy-700 transition-colors font-medium"
          >
            Chỉnh sửa hồ sơ gia sư
          </a>
        )}
      </div>
    </div>
  );
}