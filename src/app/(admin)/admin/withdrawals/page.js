"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import StatsCard from "@/components/admin/ui/StatsCard";
import { PaginationFooter } from "@/components/admin/meals/PaginationFooter";
import { adminWithdrawalService } from "@/services";

export default function WithdrawalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");

  const [activePage, setActivePage] = useState(1);
  const pageSize = 10;
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response =
        await adminWithdrawalService.getAllRequests(statusFilter);

      setRequests(response?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load withdrawal requests",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };
  }, [requests]);

  const paginatedRequests = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    const end = start + pageSize;

    return requests.slice(start, end);
  }, [requests, activePage]);

  const totalPages = Math.ceil(requests.length / pageSize) || 1;

  const approveRequest = async (id) => {
    try {
      await adminWithdrawalService.approveRequest(id);

      toast.success("Withdrawal approved successfully");

      fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to approve withdrawal",
      );
    }
  };

  const rejectRequest = async (id) => {
    const notes = prompt("Enter rejection reason") || "";

    try {
      await adminWithdrawalService.rejectRequest(id, notes);

      toast.success("Withdrawal rejected successfully");

      fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to reject withdrawal",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Withdrawal Requests
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Review and manage chef withdrawal requests.
        </p>
      </div>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          icon="Wallet"
          iconBg="#FEF3C7"
          iconColor="#D97706"
          metric={stats.total}
          label="Total Requests"
        />

        <StatsCard
          icon="Wallet"
          iconBg="#FEF3C7"
          iconColor="#D97706"
          metric={stats.pending}
          label="Pending"
        />

        <StatsCard
          icon="Wallet"
          iconBg="#DCFCE7"
          iconColor="#16A34A"
          metric={stats.approved}
          label="Approved"
        />

        <StatsCard
          icon="Wallet"
          iconBg="#FEE2E2"
          iconColor="#DC2626"
          metric={stats.rejected}
          label="Rejected"
        />
      </div>
      {/* Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">
            Filter By Status
          </span>

          <select
            value={statusFilter}
            onChange={(e) => {
              setActivePage(1);
              setStatusFilter(e.target.value);
            }}
            className="border border-slate-300 rounded-lg px-1 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Chef
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Amount
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Requested At
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-5 py-4 text-center font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading && paginatedRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No withdrawal requests found
                  </td>
                </tr>
              )}

              {paginatedRequests.map((request) => (
                <tr key={request._id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {request.chefId?.firstName} {request.chefId?.lastName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {request.chefId?.kitchenName || "No Kitchen"}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    EGP {request.amount}
                  </td>

                  <td className="px-5 py-4">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : request.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : request.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {request.status === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => approveRequest(request._id)}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectRequest(request._id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="flex justify-center text-slate-400 text-xs">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationFooter
          loading={loading}
          total={requests.length}
          activePage={activePage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setActivePage}
        />
      </div>
    </div>
  );
}
