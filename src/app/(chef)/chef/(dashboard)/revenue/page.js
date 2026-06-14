"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Wallet,
  TrendingUp,
  History,
  ArrowUpRight,
  PlusCircle,
  Loader2,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card, Button, Modal, Input } from "@/components/ui";
import { settlementService, withdrawalService } from "@/services";

export default function RevenuePage() {
  const [wallet, setWallet] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({ amount: "", notes: "" });
  const [requestLoading, setRequestLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletRes, earningsRes, withdrawalsRes] = await Promise.all([
        settlementService.getWallet(),
        settlementService.getEarnings(),
        withdrawalService.getHistory(),
      ]);
      setWallet(walletRes.data);
      setEarnings(earningsRes.data || []);
      setWithdrawals(withdrawalsRes.data || []);
    } catch (error) {
      console.error("Failed to load revenue data:", error);
      toast.error("Failed to load revenue data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(requestData.amount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount greater than zero");
      return;
    }

    if (wallet && amount > wallet.availableBalance) {
      toast.error("Withdrawal amount cannot exceed available balance");
      return;
    }

    try {
      setRequestLoading(true);
      const response = await withdrawalService.requestWithdrawal({
        amount,
        notes: requestData.notes.trim() || undefined,
      });

      if (response.success) {
        toast.success("Withdrawal request submitted successfully!");
        setIsModalOpen(false);
        setRequestData({ amount: "", notes: "" });

        // Refresh wallet and withdrawal history
        const [walletRes, withdrawalsRes] = await Promise.all([
          settlementService.getWallet(),
          withdrawalService.getHistory(),
        ]);
        setWallet(walletRes.data);
        setWithdrawals(withdrawalsRes.data || []);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit withdrawal request";
      toast.error(message);
    } finally {
      setRequestLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "approved":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case "rejected":
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-[#7e6a63] font-medium animate-pulse">
          Loading revenue data...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500">
      {/* Wallet Summary Section */}
      <section>
        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <Card className="flex flex-1 flex-col justify-between border border-[#ebdfd9] bg-white p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#7e6a63]">
                  Available Balance
                </p>
                <h3 className="mt-2 text-4xl font-bold text-[#2f221d]">
                  ${wallet?.availableBalance?.toFixed(2) || "0.00"}
                </h3>
              </div>
              <div className="rounded-2xl bg-[#f6efed] p-4 text-primary">
                <Wallet size={32} />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={!wallet || wallet.availableBalance <= 0}
                className={`flex-1 rounded-xl py-4 text-sm font-bold transition flex items-center justify-center gap-2 ${
                  !wallet || wallet.availableBalance <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-none"
                    : "bg-primary text-white hover:bg-primary-container"
                }`}
              >
                <ArrowUpRight size={18} />
                Request Withdrawal
              </Button>
            </div>
          </Card>

          <Card className="hidden flex-1 flex-col justify-between border border-[#ebdfd9] bg-white p-8 md:flex">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#7e6a63]">
                  Total Earned
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[#2f221d]">
                  $
                  {earnings
                    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
                    .toFixed(2)}
                </h3>
                <p className="mt-2 text-xs text-[#7e6a63]">
                  Lifetime earnings from orders
                </p>
              </div>
              <div className="rounded-2xl bg-green-50 p-4 text-green-600">
                <TrendingUp size={32} />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 p-3 rounded-lg">
              <TrendingUp size={16} />
              <span>Keep up the great work, Chef!</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Tables Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Earnings History */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <DollarSign className="text-primary" size={20} />
            <h2 className="text-xl font-bold text-[#2f221d]">
              Earnings History
            </h2>
          </div>

          <Card className="overflow-hidden border border-[#ebdfd9]">
            <div className="overflow-x-auto">
              {earnings.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcf9f8] text-[#7e6a63] border-b border-[#ebdfd9]">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                        Date
                      </th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                        Order #
                      </th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebdfd9]">
                    {earnings.map((earning) => (
                      <tr
                        key={earning._id}
                        className="hover:bg-[#faf8f6] transition-colors"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-[#2f221d]">
                          {earning.createdAt
                            ? new Date(earning.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-[#7e6a63]">
                          {earning.orderId
                            ? String(earning.orderId)
                                .substring(0, 8)
                                .toUpperCase()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">
                          +${(Number(earning.amount) || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="rounded-full bg-[#f6efed] p-4 text-primary">
                    <DollarSign size={32} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#2f221d]">
                    No earnings yet
                  </h3>
                  <p className="mt-2 text-sm text-[#7e6a63]">
                    Once you complete orders, your earnings will appear here.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Withdrawal History */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <History className="text-primary" size={20} />
            <h2 className="text-xl font-bold text-[#2f221d]">
              Withdrawal History
            </h2>
          </div>

          <Card className="overflow-hidden border border-[#ebdfd9]">
            <div className="overflow-x-auto">
              {withdrawals.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcf9f8] text-[#7e6a63] border-b border-[#ebdfd9]">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                        Date
                      </th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                        Amount
                      </th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebdfd9]">
                    {withdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal._id}
                        className="hover:bg-[#faf8f6] transition-colors"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-[#2f221d]">
                          {withdrawal.createdAt
                            ? new Date(
                                withdrawal.createdAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#2f221d]">
                          ${(Number(withdrawal.amount) || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(withdrawal.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="rounded-full bg-[#f6efed] p-4 text-primary">
                    <History size={32} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#2f221d]">
                    No withdrawals yet
                  </h3>
                  <p className="mt-2 text-sm text-[#7e6a63]">
                    When you request a payout, it will show up here for
                    tracking.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>

      {/* Withdrawal Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !requestLoading && setIsModalOpen(false)}
        title="Request Withdrawal"
      >
        <form onSubmit={handleRequestSubmit} className="space-y-6">
          <div className="rounded-xl bg-[#fcf9f8] p-4 border border-[#ebdfd9]">
            <p className="text-xs font-medium text-[#7e6a63]">
              Current Balance
            </p>
            <p className="text-2xl font-bold text-[#2f221d]">
              ${wallet?.availableBalance?.toFixed(2) || "0.00"}
            </p>
          </div>

          <Input
            label="Withdrawal Amount ($)"
            type="number"
            step="0.01"
            min="0.01"
            max={wallet?.availableBalance}
            placeholder="0.00"
            value={requestData.amount}
            onChange={(e) =>
              setRequestData({ ...requestData, amount: e.target.value })
            }
            required
            disabled={requestLoading}
            className="focus:ring-primary focus:border-primary"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#2f221d]">
              Notes (Optional)
            </label>
            <textarea
              className="w-full rounded-md border border-[#ebdfd9] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all disabled:bg-gray-50"
              rows={3}
              placeholder="Any additional details..."
              value={requestData.notes}
              onChange={(e) =>
                setRequestData({ ...requestData, notes: e.target.value })
              }
              disabled={requestLoading}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={requestLoading}
              className="flex-1 rounded-xl py-3 border border-[#ebdfd9] bg-white text-[#5f5652] hover:bg-[#f3ece9]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={requestLoading}
              className="flex-1 rounded-xl py-3 bg-primary text-white hover:bg-primary-container flex items-center justify-center gap-2"
            >
              {requestLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
