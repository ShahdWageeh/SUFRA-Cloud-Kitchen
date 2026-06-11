"use client";

import { useState, useEffect, useCallback } from "react";
import useAuth from "@/hooks/useAuth";
import {
  Check,
  X,
  FileText,
  RefreshCw,
  ShieldAlert,
  User,
  ChefHat,
} from "lucide-react";

export default function ChefVerificationModeration() {
  const { token: contextToken, logout } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadPendingRequests = useCallback(async () => {
    setError(null);

    // Bulletproof Token Recovery
    let activeToken = contextToken;
    if (!activeToken && typeof window !== "undefined") {
      activeToken =
        localStorage.getItem("Sufra_token") ||
        localStorage.getItem("jwt") ||
        localStorage.getItem("admin_token");
    }

    if (!activeToken) {
      setError(
        "No authorization token detected. Please make sure your Local Storage key is named exactly 'token'.",
      );
      return;
    }

    setLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

      const response = await fetch(`${baseUrl}/verification-request/pending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (response.status === 401) {
        setError("Session expired. Please log out and back in.");
        if (logout) logout();
        return;
      }

      if (response.status === 403) {
        setError(
          "Forbidden (403): The token found belongs to a user who does not have an Admin role.",
        );
        return;
      }

      const result = await response.json();

      if (response.ok) {
        // Handle variations in backend payload structures safely
        if (Array.isArray(result)) {
          setRequests(result);
        } else if (result && Array.isArray(result.data)) {
          setRequests(result.data);
        } else {
          setRequests([]);
        }
      } else {
        throw new Error(
          result.message || `Server returned status: ${response.status}`,
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "An unexpected network exception halted the data streaming.",
      );
    } finally {
      setLoading(false);
    }
  }, [contextToken, logout]);

  useEffect(() => {
    if (isMounted) {
      loadPendingRequests();
    }
  }, [loadPendingRequests, isMounted]);

  const handleUpdateStatus = async (requestId, targetStatus) => {
    setProcessingId(requestId);
    try {
      let activeToken = contextToken;
      if (!activeToken && typeof window !== "undefined") {
        activeToken =
          localStorage.getItem("token") || localStorage.getItem("jwt");
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
      const response = await fetch(
        `${baseUrl}/verification-request/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({ status: targetStatus }),
        },
      );

      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
      } else {
        const result = await response.json();
        alert(result.message || "Failed to update verification status.");
      }
    } catch (err) {
      alert("Network exception updating status parameters.");
    } finally {
      setProcessingId(null);
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 pb-20 pt-6 flex min-h-[300px] flex-col gap-3 items-center justify-center">
        <RefreshCw size={32} className="animate-spin text-[#964326]" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Initializing Interface...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-20 pt-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Chef Onboarding Approvals
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review legal documentation, kitchen spaces, and identity credentials
            to authorize storefront operations.
          </p>
        </div>
        <button
          onClick={loadPendingRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Requests
        </button>
      </div>

      {/* Global Error Banner Display */}
      {error && (
        <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium items-center">
          <ShieldAlert className="shrink-0 text-red-600" size={20} />
          <div className="flex-1">
            <span className="font-bold">System Alert:</span> {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] flex-col gap-3 items-center justify-center">
          <RefreshCw size={32} className="animate-spin text-[#964326]" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            Loading compliance data from server...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <FileText className="mx-auto text-slate-300 mb-3" size={36} />
          <p className="text-sm font-semibold text-slate-700">All caught up!</p>
          <p className="text-xs text-slate-400 mt-1">
            No pending chef validation submissions require audit right now.
          </p>
        </div>
      ) : (
        /* Document Cards Stream */
        <div className="space-y-6">
          {requests.map((request) => {
            //Check if chefId is populated as an object
            const isChefObject =
              request.chefId && typeof request.chefId === "object";
            const kitchenName = isChefObject
              ? request.chefId.kitchenName
              : "Unnamed Kitchen";
            const chefFullName = isChefObject
              ? `${request.chefId.firstName} ${request.chefId.lastName}`
              : "Unknown Chef";
            const chefContact = isChefObject
              ? `${request.chefId.email} | ${request.chefId.phone || "No Phone"}`
              : "";

            return (
              <div
                key={request._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid lg:grid-cols-[1fr_320px]"
              >
                <div className="p-6 space-y-6">
                  {/* Top Header Information Details safely extracted as specific primitives */}
                  <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 text-slate-900">
                      <ChefHat className="text-[#964326]" size={20} />
                      <h3 className="text-lg font-bold">{kitchenName}</h3>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 items-center">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {chefFullName}
                      </span>
                      {chefContact && (
                        <span className="text-xs text-slate-400">
                          {chefContact}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 mt-2">
                      Request Token ID: {request._id}
                    </p>
                  </div>

                  {/* Identity Files */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-500">
                        National ID (Front)
                      </span>
                      <a
                        href={request.nationalIdImage}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-[4/3] rounded-xl border overflow-hidden bg-slate-50"
                      >
                        <img
                          src={request.nationalIdImage}
                          alt="ID Front"
                          className="h-full w-full object-cover hover:scale-105 transition duration-200"
                        />
                      </a>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-500">
                        National ID (Back)
                      </span>
                      <a
                        href={request.nationalIdBackImage}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-[4/3] rounded-xl border overflow-hidden bg-slate-50"
                      >
                        <img
                          src={request.nationalIdBackImage}
                          alt="ID Back"
                          className="h-full w-full object-cover hover:scale-105 transition duration-200"
                        />
                      </a>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-500">
                        Health Certificate
                      </span>
                      <a
                        href={request.healthCertificateImage}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-[4/3] rounded-xl border overflow-hidden bg-slate-50"
                      >
                        <img
                          src={request.healthCertificateImage}
                          alt="Certificate"
                          className="h-full w-full object-cover hover:scale-105 transition duration-200"
                        />
                      </a>
                    </div>
                  </div>

                  {/* Kitchen Workspace Photos */}
                  {request.kitchenImages &&
                    request.kitchenImages.length > 0 && (
                      <div className="space-y-2 border-t border-slate-100 pt-4">
                        <span className="text-xs font-semibold text-slate-500 block mb-2">
                          Kitchen Workspaces ({request.kitchenImages.length}{" "}
                          Photos)
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {request.kitchenImages.map((imgUrl, idx) => (
                            <a
                              key={idx}
                              href={imgUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="h-20 w-20 rounded-lg border overflow-hidden bg-slate-50 block hover:border-slate-400 transition"
                            >
                              <img
                                src={imgUrl}
                                alt="Kitchen space"
                                className="h-full w-full object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Approval Box Panel */}
                <div className="bg-slate-50/60 p-6 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Validation Actions
                    </h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      Pending Evaluation
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6 lg:mt-0">
                    <button
                      onClick={() => handleUpdateStatus(request._id, "failed")}
                      disabled={processingId !== null}
                      className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-red-200 bg-white text-xs font-bold text-red-600 shadow-sm hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <X size={15} />
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(request._id, "approved")
                      }
                      disabled={processingId !== null}
                      className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      <Check size={15} />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
