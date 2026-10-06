"use client";

import { useState } from "react";

const SUBJECT_OPTIONS = ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Anh", "Sử", "Địa"];

export default function StudentRequestsPage() {
  const [formData, setFormData] = useState({
    subject: "",
    budget: "",
    schedule: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/student-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({ subject: "", budget: "", schedule: "", description: "" });
      setLoading(false);
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <a
          href="/dashboard"
          className="text-sm text-navy-700 hover:underline mb-4 inline-block"
        >
          ← Quay lại Dashboard
        </a>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="w-10 h-1 rounded-full bg-amber-500 mb-6" />
          <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">
            Đăng yêu cầu tìm gia sư
          </h1>
          <p className="text-ink/50 text-sm mb-8">
            Mô tả nhu cầu của bạn để gia sư phù hợp có thể liên hệ.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-ink mb-2">
                Môn học <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_OPTIONS.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => setFormData({ ...formData, subject })}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      formData.subject === subject
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-ink border-navy-500/30 hover:border-navy-700"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">
                Ngân sách (nghìn VNĐ / giờ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min={0}
                className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
              />
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">
                Lịch rảnh
              </label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="VD: Tối thứ 2 - 4 - 6"
                className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
              />
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">
                Mô tả nhu cầu
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Mục tiêu học tập, trình độ hiện tại, mong muốn cụ thể..."
                className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded">
                Đã đăng yêu cầu thành công!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 text-white py-2.5 rounded hover:bg-navy-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? "Đang đăng..." : "Đăng yêu cầu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}