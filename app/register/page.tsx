"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Ruler,
  Lightbulb,
  NotebookPen,
  BookOpen,
  Laptop,
  Globe,
  Calculator,
  Award,
  User,
  Mail,
  Lock,
  Users,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "STUDENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng ký thất bại");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Mảng bên trái - thương hiệu, chỉ hiện trên màn lớn */}
      <div className="hidden lg:flex flex-col justify-between bg-navy-900 text-white px-16 py-12 relative overflow-hidden">
        {/* Các icon trang trí rải rác toàn mảng */}
        <GraduationCap className="absolute top-[21%] left-[14%] w-23 h-23 text-white/10 -rotate-6" strokeWidth={1.25} />
        <Ruler className="absolute top-[16%] left-[45%] w-16 h-16 text-white/10 rotate-12" strokeWidth={1.25} />
        <Lightbulb className="absolute top-[6%] right-[10%] w-20 h-20 text-white/10" strokeWidth={1.25} />
        <Globe className="absolute top-[32%] right-[12%] w-23 h-23  text-white/10" strokeWidth={1.25} />
        <Calculator className="absolute top-[80%] left-[16%] w-14 h-14 text-white/10 -rotate-6" strokeWidth={1.25} />
        <NotebookPen className="absolute top-[72%] left-[44%] w-21 h-21 text-white/10 rotate-6" strokeWidth={1.25} />
        <Laptop className="absolute top-[58%] right-[8%] w-20 h-20 text-white/10 -rotate-3" strokeWidth={1.25} />
        <Award className="absolute top-[78%] right-[10%] w-12 h-12 text-white/10 rotate-6" strokeWidth={1.25} />
        <BookOpen className="absolute top-[46%] left-[35%] w-14 h-14 text-white/10" strokeWidth={1.25} />

        <div className="font-display text-xl font-semibold relative z-10">
          TutorMatch
        </div>

        <div className="max-w-md relative z-10">
          <h1 className="font-display text-4xl font-semibold leading-tight mb-6">
            Học đúng người, đúng lúc.
          </h1>
          <p className="text-navy-500 text-lg leading-relaxed">
            Nền tảng kết nối học sinh với gia sư phù hợp — theo môn học,
            ngân sách và lịch học của bạn.
          </p>
        </div>

        <p className="text-sm text-navy-500 relative z-10">© 2026 TutorMatch</p>
      </div>

      {/* Banner ngắn cho mobile */}
      <div className="lg:hidden bg-navy-900 text-white px-6 py-10">
        <div className="font-display text-xl font-semibold mb-2">
          TutorMatch
        </div>
        <p className="text-navy-500">
          Tìm gia sư phù hợp với bạn.
        </p>
      </div>

      {/* Form bên phải */}
      <div className="relative flex items-center justify-center px-6 py-12 lg:py-0 overflow-hidden bg-white">
        {/* Mảng gradient mờ tạo chiều sâu, không cạnh tranh với nội dung */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-100 blur-3xl opacity-70" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-navy-500/10 blur-3xl" />

        <div className="w-full max-w-sm relative z-10">
          <div className="w-10 h-1 rounded-full bg-amber-500 mb-6" />

          <h2 className="font-display text-2xl font-semibold text-ink mb-1.5">
            Tạo tài khoản
          </h2>
          <p className="text-ink/50 text-sm mb-8">
            Miễn phí, chỉ mất chưa đến một phút.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-ink mb-1.5">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" strokeWidth={1.5} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-navy-500/30 rounded pl-10 pr-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" strokeWidth={1.5} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-navy-500/30 rounded pl-10 pr-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" strokeWidth={1.5} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full border border-navy-500/30 rounded pl-10 pr-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">Bạn là ai?</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" strokeWidth={1.5} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-navy-500/30 rounded pl-10 pr-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 transition-colors bg-white appearance-none"
                >
                  <option value="STUDENT">Học sinh — tìm gia sư</option>
                  <option value="TUTOR">Gia sư — tìm học sinh</option>
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 text-white py-2.5 rounded hover:bg-navy-700 disabled:opacity-50 transition-all font-medium shadow-lg shadow-navy-900/20 hover:shadow-navy-900/30 hover:-translate-y-0.5"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-sm text-ink/60 mt-6">
            Đã có tài khoản?{" "}
            <a href="/login" className="text-navy-700 font-medium hover:underline">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}