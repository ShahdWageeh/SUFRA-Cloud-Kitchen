"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faReceipt,
  faTruck,
  faCircleCheck,
  faClock,
  faLocationDot,
  faPhone,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { ordersService } from "@/services";
import { Button } from "@/components/ui";
import ReviewModal from "@/components/customer/ReviewModal";

const STATUS_CONFIG = {
  awaiting_payment: {
    label: "Awaiting Payment",
    color: "bg-amber-100 text-amber-700",
    icon: faClock,
  },
  preparing: {
    label: "Preparing",
    color: "bg-blue-100 text-blue-700",
    icon: faReceipt,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-primary/10 text-primary",
    icon: faTruck,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
    icon: faCircleCheck,
  },
};

export default function OrderDetailsPage({ params }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    mealId: null,
    mealName: "",
  });

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        const result = await ordersService.getOrderById(orderId);
        if (result.success) {
          setOrder(result.data);
        }
      } catch (error) {
        const message = error.response?.data?.message || "Failed to load order details";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Order not found
        </h1>
        <div className="mt-10">
          <Link href="/customer/orders">
            <Button size="lg" className="rounded-full px-8">
              Back to My Orders
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const status = STATUS_CONFIG[order.status] || {
    label: order.status,
    color: "bg-gray-100 text-gray-700",
    icon: faReceipt,
  };

  const openReviewModal = (mealId, mealName) => {
    setReviewModal({
      isOpen: true,
      mealId,
      mealName,
    });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link 
          href="/customer/orders" 
          className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
          Back to My Orders
        </Link>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Order Details
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Order #{order._id.toUpperCase()}
            </p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${status.color}`}>
            <FontAwesomeIcon icon={status.icon} className="h-3 w-3" />
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          {/* Order Items */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 lg:p-8">
            <h2 className="text-lg font-bold text-text-primary mb-6">Order Items</h2>
            <ul className="divide-y divide-primary-container">
              {order.items.map((item, idx) => (
                <li key={`${order._id}-item-${idx}`} className="flex flex-col py-6 first:pt-0 last:pb-0 sm:flex-row">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary-container">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4 flex flex-1 flex-col justify-between sm:ml-6 sm:mt-0">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-text-primary">{item.name}</h4>
                        <p className="mt-1 text-xs text-text-secondary line-clamp-2">{item.description}</p>
                      </div>
                      <p className="font-bold text-primary">${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-text-tertiary">Quantity: {item.quantity}</p>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-extrabold text-text-primary">Subtotal: ${item.subtotal.toFixed(2)}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-[10px] h-8 px-3 flex items-center gap-1.5"
                          onClick={() => openReviewModal(item.mealId, item.name)}
                        >
                          <FontAwesomeIcon icon={faStar} className="h-2.5 w-2.5" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-8">
          {/* Delivery & Summary */}
          <section className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 lg:p-8">
              <h2 className="text-lg font-bold text-text-primary mb-6">Delivery Information</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Shipping Address</p>
                    <p className="mt-1 text-sm font-medium text-text-secondary leading-relaxed">
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Contact Phone</p>
                    <p className="mt-1 text-sm font-medium text-text-secondary">
                      {order.contactPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 lg:p-8">
              <h2 className="text-lg font-bold text-text-primary mb-6">Order Summary</h2>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-text-secondary">Subtotal</dt>
                  <dd className="text-sm font-bold text-text-primary">${order.totalAmount.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-text-secondary">Shipping</dt>
                  <dd className="text-sm font-bold text-primary">FREE</dd>
                </div>
                <div className="flex items-center justify-between border-t border-primary-container pt-4">
                  <dt className="text-base font-bold text-text-primary">Total Paid</dt>
                  <dd className="text-base font-extrabold text-primary">${order.totalAmount.toFixed(2)}</dd>
                </div>
              </dl>
              <div className="mt-6 rounded-xl bg-background p-4 text-center">
                <p className="text-xs font-bold text-text-secondary">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
        mealId={reviewModal.mealId}
        mealName={reviewModal.mealName}
      />
    </main>
  );
}
