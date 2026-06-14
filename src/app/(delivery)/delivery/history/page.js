"use client";

import { useEffect, useMemo, useState } from "react";
import { deliveryService } from "@/services";
import { PackageCheck } from "lucide-react";
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

export default function DeliveryHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await deliveryService.getDeliveryHistory();

        setOrders(response?.data || []);
      } catch (error) {
        toast.error("Failed to load delivery history");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE)),
    [orders],
  );

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return orders.slice(start, start + ITEMS_PER_PAGE);
  }, [orders, currentPage]);

  if (loading) {
    return <div className="p-6">Loading delivery history...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Delivery History
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          View all completed deliveries.
        </p>
      </div>

      {/* Empty State */}

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <PackageCheck size={60} className="mx-auto mb-4 text-gray-400" />

          <h2 className="text-xl font-semibold">No Deliveries Yet</h2>

          <p className="mt-2 text-text-secondary">
            Completed deliveries will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Order ID
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order._id} className="border-b last:border-0">
                      <td className="px-5 py-4 font-medium">
                        #{order._id?.slice(-6)}
                      </td>

                      <td className="px-5 py-4">
                        {order.customerId?.firstName || "-"}{" "}
                        {order.customerId?.lastName || ""}
                      </td>

                      <td className="px-5 py-4">{order.contactPhone || "-"}</td>

                      <td className="px-5 py-4 font-semibold">
                        {order.totalAmount} EGP
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Delivered
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-text-secondary">
                        {new Date(
                          order.updatedAt || order.createdAt,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}

            <div className="flex flex-col gap-4 border-t px-5 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-text-secondary">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                {" - "}
                {Math.min(currentPage * ITEMS_PER_PAGE, orders.length)} of{" "}
                {orders.length} orders
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Summary Card */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-text-secondary">
              Total Completed Deliveries
            </p>

            <p className="mt-2 text-3xl font-bold text-primary">
              {orders.length}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
