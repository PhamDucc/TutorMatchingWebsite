"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SUBJECT_OPTIONS = ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Anh", "Sử", "Địa"];

type StudentRequest = {
  id: string;
  subject: string;
  budget: number;
  schedule: string | null;
  description: string | null;
  createdAt: string;
  student: {
    fullName: string;
  };
};

type CurrentUser = {
  id: string;
  fullName: string;
  role: string;
} | null;

export default function RequestsPage() {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [user, setUser] = useState<CurrentUser>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const [openFormId, setOpenFormId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [needProfile, setNeedProfile] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/student-requests").then((res) => res.json()),
      fetch("/api/auth/me").then((res) => res.json()),
      fetch("/api/applications").then((res) => res.json()),
    ])
      .then(([requestData, meData, applicationData]) => {
        setRequests(requestData.requests);
        setUser(meData.user);
        setAppliedIds(applicationData.appliedRequestIds);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedSubject
    ? requests.filter((r) => r.subject === selectedSubject)
    : requests;

  const openForm = (id: string) => {
    setOpenFormId(id);
    setMessage("");
    setError("");
    setNeedProfile(false);
  };

  const closeForm = () => {
    setOpenFormId(null);
    setMessage("");
    setError("");
    setNeedProfile(false);
  };

  const handleApply = async (requestId: string) => {
    setError("");
    setNeedProfile(false);
    setSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra");
        setNeedProfile(data.code === "NO_PROFILE");
        setSubmitting(false);
        return;
      }

      setAppliedIds((prev) => [...prev, requestId]);
      closeForm();
      setSubmitting(false);
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="w-10 h-1 rounded-full bg-amber-500 mb-6" />
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">
          Yêu cầu tìm gia sư
        </h1>
        <p className="text-ink/50 mb-8">
          Xem nhu cầu của học sinh và ứng tuyển nếu bạn thấy phù hợp.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedSubject("")}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              selectedSubject === ""
                ? "bg-navy-900 text-white border-navy-900"
                : "bg-white text-ink border-navy-500/30 hover:border-navy-700"
            }`}
          >
            Tất cả
          </button>
          {SUBJECT_OPTIONS.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selectedSubject === subject
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white text-ink border-navy-500/30 hover:border-navy-700"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-ink/50">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink/50">Chưa có yêu cầu nào phù hợp.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {filtered.map((req) => {
              const applied = appliedIds.includes(req.id);
              const formOpen = openFormId === req.id;

              return (
                <div
                  key={req.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-navy-500/10 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs bg-sky-100 text-navy-700 px-2 py-1 rounded-full">
                      {req.subject}
                    </span>
                    <span className="text-xs text-ink/40">
                      {new Date(req.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-semibold text-ink mb-1">
                    Cần gia sư {req.subject}
                  </h2>
                  <p className="text-sm text-ink/50 mb-3">
                    Đăng bởi {req.student.fullName}
                  </p>

                  {req.description && (
                    <p className="text-sm text-ink/70 mb-3 line-clamp-3">
                      {req.description}
                    </p>
                  )}

                  {req.schedule && (
                    <p className="text-sm text-ink/70 mb-4">
                      Lịch rảnh: {req.schedule}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-navy-500/10">
                    <p className="font-semibold text-navy-900 mb-3">
                      Ngân sách: {req.budget.toLocaleString("vi-VN")}k / giờ
                    </p>

                    {!user ? (
                      <Link
                        href="/login"
                        className="block text-center text-sm text-navy-700 border border-navy-500/30 rounded py-2 hover:border-navy-700 transition-colors"
                      >
                        Đăng nhập để ứng tuyển
                      </Link>
                    ) : user.role !== "TUTOR" ? null : applied ? (
                      <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded text-center">
                        Đã ứng tuyển
                      </div>
                    ) : formOpen ? (
                      <div className="space-y-3">
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          maxLength={500}
                          placeholder="Lời nhắn gửi học sinh (kinh nghiệm, phương pháp, lịch dạy phù hợp...)"
                          className="w-full border border-navy-500/30 rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
                        />

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        {needProfile && (
                          <Link
                            href="/dashboard/tutor-profile"
                            className="block text-sm text-navy-700 hover:underline"
                          >
                            Tạo hồ sơ gia sư ngay →
                          </Link>
                        )}

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleApply(req.id)}
                            disabled={submitting}
                            className="flex-1 bg-navy-900 text-white text-sm py-2 rounded hover:bg-navy-700 disabled:opacity-50 transition-colors"
                          >
                            {submitting ? "Đang gửi..." : "Gửi ứng tuyển"}
                          </button>
                          <button
                            type="button"
                            onClick={closeForm}
                            className="px-4 text-sm text-ink border border-navy-500/30 rounded hover:border-navy-700 transition-colors"
                          >
                            Huỷ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openForm(req.id)}
                        className="w-full bg-navy-900 text-white text-sm py-2 rounded hover:bg-navy-700 transition-colors"
                      >
                        Ứng tuyển
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}