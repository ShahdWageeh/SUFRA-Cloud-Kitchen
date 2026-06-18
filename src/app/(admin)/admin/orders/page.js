"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui";
import adminDeliveryService from "@/services/adminDeliveryService";
import { Truck, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [freeDeliveryPersonnel, setFreeDeliveryPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const loadDeliveryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminDeliveryService.getDeliveryManagementData();

      setUnassignedOrders(result.data?.unassignedOrders || []);
      setFreeDeliveryPersonnel(result.data?.freeDeliveryPersonnel || []);
    } catch (err) {
      console.error("Failed to load delivery data:", err);
      setError(
        err?.response?.data?.message || "Failed to load delivery management data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDelivery = async (orderId, deliveryId) => {
    try {
      setAssigning(orderId);
      setError(null);
      setSuccess(null);

      const response = await adminDeliveryService.assignDeliveryPerson(
        orderId,
        deliveryId,
      );

      console.log("Assignment response:", response);
      await loadDeliveryData();
      setSelectedOrder(null);
      setSelectedDelivery(null);
      setSuccess("Order assigned successfully!");
    } catch (err) {
      console.error("Assignment failed:", err);
      setError(err?.response?.data?.message || "Failed to assign order");
    } finally {
      setAssigning(null);
    }
  };

  useEffect(() => {
    loadDeliveryData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-slate-400 mb-2">Admin › Orders</p>
        <h1 className="text-3xl font-bold text-slate-900">Delivery Assignment</h1>
        <p className="text-sm text-slate-500 mt-2">
          Manage unassigned orders and assign them to free delivery personnel
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-emerald-600 mt-0.5 shrink-0" size={20} />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Unassigned Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Unassigned Orders ({unassignedOrders.length})
            </h2>

            {unassignedOrders.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-emerald-500 mb-3" size={40} />
                <p className="text-slate-600">All orders are assigned!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-150 overflow-y-auto">
                {unassignedOrders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order._id)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedOrder === order._id
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Order #{order._id?.slice(-6) || "N/A"}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Customer:{" "}
                          {order.customerId?.firstName || "N/A"}{" "}
                          {order.customerId?.lastName || ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {order.totalAmount} EGP
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.contactPhone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600">
                      📍 {order.shippingAddress || "Address not provided"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {order.items?.slice(0, 2).map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded"
                        >
                          {item.quantity}x {item.name?.substring(0, 10) || "Item"}
                        </span>
                      ))}
                      {order.items?.length > 2 && (
                        <span className="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Free Delivery Personnel & Assignment */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Truck size={20} className="text-primary" />
              Free Delivery Personnel ({freeDeliveryPersonnel.length})
            </h2>

            {freeDeliveryPersonnel.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No free delivery personnel available</p>
              </div>
            ) : (
              <div className="space-y-2 mb-6 max-h-75 overflow-y-auto">
                {freeDeliveryPersonnel.map((delivery) => (
                  <div
                    key={delivery._id}
                    onClick={() => setSelectedDelivery(delivery._id)}
                    className={`p-3 border rounded-lg cursor-pointer transition ${
                      selectedDelivery === delivery._id
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="font-medium text-slate-900">
                      {delivery.firstName} {delivery.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{delivery.email}</p>
                    <p className="text-xs text-slate-500">{delivery.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Assignment Button */}
            <button
              onClick={() => {
                if (selectedOrder && selectedDelivery) {
                  handleAssignDelivery(selectedOrder, selectedDelivery);
                }
              }}
              disabled={!selectedOrder || !selectedDelivery || assigning}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                selectedOrder && selectedDelivery && !assigning
                  ? "bg-primary text-white hover:opacity-90 cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {assigning ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  Assigning...
                </div>
              ) : (
                "Assign Order"
              )}
            </button>

            {!selectedOrder && (
              <p className="text-xs text-slate-400 mt-3 text-center">
                Select an order to begin
              </p>
            )}
            {selectedOrder && !selectedDelivery && (
              <p className="text-xs text-slate-400 mt-3 text-center">
                Select a delivery person
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
