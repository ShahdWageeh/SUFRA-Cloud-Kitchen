"use client";

import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function Footer() {
  const router = useRouter();
  const { clearSession } = useAuth();

  const handleLogout = () => {
    clearSession();

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("jwt");
      localStorage.removeItem("admin_token");
    }

    router.replace("/admin/login");
  };

  return (
    <footer className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5 border-t" style={{ borderColor: '#ECE8E5' }}>
      {/* System status */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm text-gray-400">
          System Status:{' '}
          <span className="font-semibold text-emerald-600">All services operational</span>
        </span>
      </div>

      {/* Right links */}
      <div className="flex items-center gap-5">
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Privacy Policy
        </button>
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Audit Logs
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
          style={{ color: '#DC2626' }}
        >
          Logout
        </button>
      </div>
    </footer>
  )
}
