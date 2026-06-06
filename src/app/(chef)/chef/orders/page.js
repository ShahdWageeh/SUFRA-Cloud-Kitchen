"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Car,
  ChefHat,
  Clock3,
  Menu,
  Search,
  Timer,
  Utensils,
  Wallet,
  ArrowUp,
} from "lucide-react";

const initialOrders = [
  {
    id: "#ORD-8821",
    badge: "NEW ORDER",
    badgeClass: "bg-[#fff0e8] text-[#b85429]",
    price: "EGP 145.00",
    timeAgo: "12 mins ago",
    customer: "Sarah Jamila",
    items: "2x Grilled Chicken Mandi, 1x Fattoush",
    logistics: "ASAP • Delivery requested",
    logisticsIcon: Clock3,
    note: '"Please extra spicy sauce on the side."',
    image:
      "https://images.unsplash.com/photo-1604908176997-431f6f7f3f0c?q=80&w=400&auto=format&fit=crop",
    status: "incoming",
  },
  {
    id: "#ORD-8825",
    badge: "HIGH PRIORITY",
    badgeClass: "bg-[#fbf0da] text-[#8b5b18]",
    price: "EGP 210.00",
    timeAgo: "5 mins ago",
    customer: "Ahmed Al-Sayed",
    items: "1x Lamb Kabsa (Family), 4x Soft Drinks",
    logistics: "Pickup at 7:30 PM (Pre-order)",
    logisticsIcon: Car,
    note: "",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop",
    status: "incoming",
  },
  {
    id: "#ORD-8826",
    badge: "NEW ORDER",
    badgeClass: "bg-[#fff0e8] text-[#b85429]",
    price: "EGP 65.00",
    timeAgo: "2 mins ago",
    customer: "Layla K.",
    items: "3x Falafel Wrap Platter",
    logistics: "ASAP • Delivery requested",
    logisticsIcon: Clock3,
    note: "",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop",
    status: "incoming",
  },
];

const tabs = ["Incoming (3)", "In Progress (5)", "Completed"];

function OrderCard({ order, onDecision }) {
  const LogisticsIcon = order.logisticsIcon;

  return (
    <article className="flex min-h-[340px] flex-col rounded-2xl border border-[#eaded8] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold ${order.badgeClass}`}
          >
            {order.badge}
          </span>
          <h2 className="mt-3 text-xl font-extrabold text-[#231813]">
            {order.id}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-[15px] font-extrabold text-[#231813]">
            {order.price}
          </p>
          <p className="mt-1 text-xs font-medium text-[#9b8b84]">
            {order.timeAgo}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#f5efec]">
          <Image
            src={order.image}
            alt={`${order.customer} order dish`}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="font-extrabold text-[#2b211d]">{order.customer}</p>
          <p className="mt-1 text-sm leading-5 text-[#7e6a63]">{order.items}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#6a5850]">
        <LogisticsIcon size={17} className="text-[#964326]" />
        <span>{order.logistics}</span>
      </div>

      {order.note ? (
        <div className="mt-5 flex gap-3 rounded-2xl bg-[#fbf6f3] p-4 text-sm italic leading-6 text-[#6a5850]">
          <Menu size={16} className="mt-1 shrink-0 text-[#964326]" />
          <p>{order.note}</p>
        </div>
      ) : (
        <div className="mt-5 flex-1" />
      )}

      {order.status === "incoming" ? (
        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <button
            type="button"
            onClick={() => onDecision(order.id, "accepted")}
            className="h-11 rounded-xl bg-[#964326] text-sm font-extrabold text-white transition hover:bg-[#7f3920]"
          >
            Accept
          </button>

          <button
            type="button"
            onClick={() => onDecision(order.id, "rejected")}
            className="h-11 rounded-xl bg-[#f2ece9] text-sm font-extrabold text-[#5e504a] transition hover:bg-[#eaded8]"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="mt-auto pt-5">
          <span className="inline-flex rounded-full bg-[#eef7f4] px-3 py-1.5 text-xs font-extrabold capitalize text-[#007a78]">
            {order.status}
          </span>
        </div>
      )}
    </article>
  );
}

function KitchenLoadCard() {
  return (
    <article className="rounded-2xl bg-[#007a78] p-6 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-wide text-white/70">
          Kitchen Load
        </p>
        <Utensils size={26} className="text-white/80" />
      </div>

      <p className="mt-8 text-4xl font-extrabold tracking-tight">Moderate</p>

      <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/25">
        <div className="h-full w-[65%] rounded-full bg-white" />
      </div>

      <p className="mt-4 text-sm font-medium text-[#bdeeed]">
        8 active burners in use
      </p>
    </article>
  );
}

function PrepTimeCard() {
  return (
    <article className="rounded-2xl border border-[#eaded8] bg-[#f3efea] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#7a6a62]">
          Avg. Prep Time
        </p>
        <Timer size={26} className="text-[#77665e]" />
      </div>

      <p className="mt-8 text-4xl font-extrabold tracking-tight text-[#1f2527]">
        18 Mins
      </p>

      <p className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#8a766f]">
        <ArrowUp size={15} className="text-[#964326]" />+ 2 mins from yesterday
      </p>
    </article>
  );
}

function RevenueCard() {
  return (
    <article className="rounded-2xl border border-[#eaded8] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#6b5d56]">
          Today&apos;s Revenue
        </p>
        <Wallet size={26} className="text-[#77665e]" />
      </div>

      <p className="mt-8 text-4xl font-extrabold tracking-tight text-[#1f2527]">
        EGP 1,420
      </p>

      <p className="mt-8 text-sm font-extrabold text-[#007a78]">
        14 orders completed today
      </p>
    </article>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("Incoming (3)");
  const [decisionLog, setDecisionLog] = useState([]);

  const handleDecision = (orderId, decision) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: decision } : order,
      ),
    );

    setDecisionLog((currentLog) => [
      `${orderId} ${decision}`,
      ...currentLog.slice(0, 2),
    ]);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-7">
      <section className="border-b border-[#e8dcd6] pb-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_420px] xl:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5e9e3] text-[#964326]">
              <ChefHat size={27} strokeWidth={1.8} />
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#1f1511] md:text-[42px]">
              Orders Management
            </h1>
          </div>

          <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#eaded8] bg-white px-4 shadow-sm">
            <Search size={18} className="text-[#9b8b84]" />
            <span className="sr-only">Search orders</span>
            <input
              type="search"
              placeholder="Search orders..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[#2f221d] outline-none placeholder:text-[#aa9a93]"
            />
          </label>
        </div>

        <nav className="mt-7 flex gap-8 text-sm font-extrabold">
          {tabs.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-4 pb-3 transition ${
                  active
                    ? "border-[#964326] text-[#1f1511]"
                    : "border-transparent text-[#9b8b84] hover:text-[#5f4c44]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onDecision={handleDecision} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <KitchenLoadCard />
        <PrepTimeCard />
        <RevenueCard />
      </section>

      {decisionLog.length > 0 && (
        <section
          aria-live="polite"
          className="rounded-2xl border border-[#eaded8] bg-white px-5 py-4 text-sm font-semibold text-[#6f5b53] shadow-sm"
        >
          Latest action: {decisionLog[0]}
        </section>
      )}
    </main>
  );
}
