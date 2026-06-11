"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faCalendarDays,
  faTruck,
  faCircleCheck,
  faClock,
  faChevronRight,
  faBagShopping,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { ordersService } from "@/services";
import { Button } from "@/components/ui";

const STATUS_CONFIG = {
  awaiting_payment: {
    label: "Awaiting Payment",
    color: "bg-amber-100 text-amber-700",
    icon: faClock,
  },
  preparing: {
    label: "Preparing",
    color: "bg-blue-100 text-blue-700",
    icon: faBagShopping,
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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const result = await ordersService.getMyOrders();
        if (result.success) {
          setOrders(result.data || []);
        }
      } catch (error) {
        const message = error.response?.data?.message || "Failed to load orders";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary-container text-primary">
            <FontAwesomeIcon icon={faReceipt} size="3x" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          No orders yet
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          You haven't placed any orders yet. Start exploring our delicious home-cooked meals!
        </p>
        <div className="mt-10">
          <Link href="/meals">
            <Button size="lg" className="rounded-full px-8">
              Explore Meals
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage and track your recent orders from your favorite home chefs.
        </p>
      </div>

      <div className="space-y-8">
        {orders.map((order) => {
          const status = STATUS_CONFIG[order.status] || {
            label: order.status,
            color: "bg-gray-100 text-gray-700",
            icon: faReceipt,
          };

          return (
            <article 
              key={order._id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary/10 transition-all hover:shadow-md"
            >
              {/* Order Header */}
              <div className="border-b border-primary-container bg-background/50 px-6 py-4 sm:flex sm:items-center sm:justify-between lg:px-8">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Order Number</p>
                    <p className="mt-1 text-sm font-bold text-text-primary">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Date Placed</p>
                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text-secondary">
                      <FontAwesomeIcon icon={faCalendarDays} className="h-3 w-3 text-primary" />
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Total Amount</p>
                    <p className="mt-1 text-sm font-extrabold text-primary">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${status.color}`}>
                    <FontAwesomeIcon icon={status.icon} className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="px-6 py-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                  {/* Items List */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-text-primary">Ordered Items</h3>
                    <ul className="divide-y divide-primary-container">
                      {order.items.map((item, idx) => (
                        <li key={`${order._id}-item-${idx}`} className="flex py-4 first:pt-0 last:pb-0">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary-container">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-5 flex flex-1 flex-col justify-center">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="text-sm font-bold text-text-primary">{item.name}</h4>
                                <p className="mt-1 text-xs font-semibold text-text-secondary line-clamp-1">{item.description}</p>
                              </div>
                              <p className="text-sm font-bold text-primary">${item.unitPrice.toFixed(2)}</p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <p className="text-xs font-bold text-text-tertiary">Qty: {item.quantity}</p>
                              <p className="text-xs font-extrabold text-text-primary">Subtotal: ${item.subtotal.toFixed(2)}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Delivery Info & Summary */}
                  <div className="space-y-6">
                    <div className="rounded-xl bg-background p-5 ring-1 ring-primary/5">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
                        Delivery Details
                      </h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex gap-3">
                          <p className="text-xs font-bold text-text-tertiary w-20">Address:</p>
                          <p className="text-xs font-semibold text-text-secondary leading-relaxed">
                            {order.shippingAddress || "Default Profile Address"}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <p className="text-xs font-bold text-text-tertiary w-20">Phone:</p>
                          <p className="text-xs font-semibold text-text-secondary">{order.contactPhone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-primary/20 p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-text-primary">Order Total</p>
                        <p className="text-lg font-extrabold text-primary">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <p className="mt-2 text-[10px] text-center text-text-tertiary italic">
                        Payment via Paymob - Secure Transaction
                      </p>
                      <Link href={`/customer/orders/${order._id}`} className="mt-5 block">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full rounded-full flex items-center justify-center gap-2 text-xs font-bold"
                        >
                          View Details
                          <FontAwesomeIcon icon={faChevronRight} className="h-2.5 w-2.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
