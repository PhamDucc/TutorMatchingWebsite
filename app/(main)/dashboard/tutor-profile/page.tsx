"use client";

import { useEffect, useState } from "react";

const SUBJECT_OPTIONS = ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Anh", "Sử", "Địa"];

export default function TutorProfilePage() {
  const [formData, setFormData] = useState({
    subjects: [] as string[],
    degree: "",
    experienceYears: "",
    pricePerHour: "",
    teachingMode: "ONLINE",
    location: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/tutor-profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setFormData({
            subjects: data.profile.subjects,
            degree: data.profile.degree || "",
            experienceYears: String(data.profile.experienceYears),
            pricePerHour: String(data.profile.pricePerHour),
            teachingMode: data.profile.teachingMode,
            location: data.profile.location || "",
            bio: data.profile.bio || "",
          });
        }
      })
      .finally(() => setFetching(false));
  }, []);

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/tutor-profile", {
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
      setLoading(false);
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink/50">Đang tải...</p>
      </div>
    );
  }

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
            Hồ sơ gia sư
          </h1>
          <p className="text-ink/50 text-sm mb-8">
            Thông tin này sẽ hiển thị công khai để học sinh tìm và liên hệ bạn.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-ink mb-2">
                Môn dạy <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_OPTIONS.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      formData.subjects.includes(subject)
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-ink border-navy-500/30 hover:border-navy-700"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ink mb-1.5">Bằng cấp</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="VD: Cử nhân Sư phạm Toán"
                  className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
                />
              </div>

              <div>
                <label className="block text-sm text-ink mb-1.5">
                  Số năm kinh nghiệm
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min={0}
                  className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ink mb-1.5">
                  Giá / giờ (nghìn VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  required
                  min={0}
                  className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
                />
              </div>

              <div>
                <label className="block text-sm text-ink mb-1.5">
                  Hình thức dạy <span className="text-red-500">*</span>
                </label>
                <select
                  name="teachingMode"
                  value={formData.teachingMode}
                  onChange={handleChange}
                  className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white"
                >
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="BOTH">Cả hai</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">
                Khu vực dạy (nếu offline)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="VD: Quận 1, TP.HCM"
                className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
              />
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">
                Giới thiệu bản thân
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Chia sẻ kinh nghiệm giảng dạy, phương pháp, thành tích..."
                className="w-full border border-navy-500/30 rounded px-3 py-2.5 text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded">
                Đã lưu hồ sơ thành công!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 text-white py-2.5 rounded hover:bg-navy-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? "Đang lưu..." : "Lưu hồ sơ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}