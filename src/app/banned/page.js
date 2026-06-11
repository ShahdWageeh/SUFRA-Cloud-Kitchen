"use client";

import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { ShieldOff, Home, Mail } from "lucide-react";

export default function BannedPage() {
  const router = useRouter();
  const { clearSession } = useAuth();

  const handleGoHome = () => {
    clearSession();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center">
            <ShieldOff size={36} className="text-rose-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Account Suspended
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Your account has been suspended by our moderation team. You can still
          browse the marketplace as a guest. If you believe this was a mistake,
          please contact support.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldOff size={15} className="text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Why was my account suspended?
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accounts may be suspended for violating community guidelines,
                suspicious activity, or following a report from other users.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Home size={16} />
            Go to Home
          </button>

          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm cursor-default"
            style={{ background: "#B84A2E" }}
          >
            <Mail size={16} />
            Contact Us
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          Matbakhna · Community Standards Enforcement
        </p>
      </div>
    </div>
  );
}
