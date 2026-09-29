"use client";

import { useEffect, useState } from "react";

const SUBJECT_OPTIONS = ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Anh", "Sử", "Địa"];

type TutorProfile = {
  id: string;
  subjects: string[];
  degree: string | null;
  experienceYears: number;
  pricePerHour: number;
  teachingMode: string;
  location: string | null;
  bio: string | null;
  user: {
    fullName: string;
  };
};

export default function TutorsPage() {
  const [profiles, setProfiles] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    setLoading(true);
    const query = selectedSubject ? `?subject=${encodeURIComponent(selectedSubject)}` : "";
    fetch(`/api/tutors${query}`)
      .then((res) => res.json())
      .then((data) => setProfiles(data.profiles))
      .finally(() => setLoading(false));
  }, [selectedSubject]);

  const teachingModeLabel = (mode: string) => {
    if (mode === "ONLINE") return "Online";
    if (mode === "OFFLINE") return "Offline";
    return "Online & Offline";
  };

  return (
    <div className="min-h-screen bg-sky-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="w-10 h-1 rounded-full bg-amber-500 mb-6" />
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">
          Tìm gia sư phù hợp
        </h1>
        <p className="text-ink/50 mb-8">
          Lọc theo môn học để tìm gia sư phù hợp với nhu cầu của bạn.
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
        ) : profiles.length === 0 ? (
          <p className="text-ink/50">Chưa có gia sư nào phù hợp.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-navy-500/10"
              >
                <h2 className="font-display text-lg font-semibold text-ink mb-1">
                  {profile.user.fullName}
                </h2>
                {profile.degree && (
                  <p className="text-sm text-ink/50 mb-3">{profile.degree}</p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profile.subjects.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-sky-100 text-navy-700 px-2 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-sm text-ink/70 space-y-1 mb-4">
                  <p>{profile.experienceYears} năm kinh nghiệm</p>
                  <p>{teachingModeLabel(profile.teachingMode)}</p>
                  {profile.location && <p>{profile.location}</p>}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-navy-500/10">
                  <span className="font-semibold text-navy-900">
                    {profile.pricePerHour.toLocaleString("vi-VN")}k / giờ
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}