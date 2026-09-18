"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b border-navy-500/20 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold text-navy-900">
          TutorMatch
        </Link>

        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <Link href="/dashboard" className="text-sm text-ink hover:text-navy-700">
                Xin chào, {user.fullName}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-white bg-navy-900 px-4 py-2 rounded hover:bg-navy-700 transition-colors"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-ink hover:text-navy-700">
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="text-sm text-white bg-navy-900 px-4 py-2 rounded hover:bg-navy-700 transition-colors"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}