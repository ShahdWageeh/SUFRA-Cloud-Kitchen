"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Clock, Shield, MessageSquare, Wallet, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { notificationService, ordersService } from "@/services";
import chefNotificationFallbackService from "@/services/chefNotificationFallbackService";
import {
  extractNotificationList,
  extractUnreadCount,
  getChefNotificationDestination,
} from "@/utils/notificationUtils";

const NOTIFICATION_ICONS = {
  "chef.order.requested": { icon: ShoppingBag, color: "bg-orange-50 text-orange-600" },
  "chef.order.placed": { icon: ShoppingBag, color: "bg-orange-50 text-orange-600" },
  "chef.order.paid": { icon: Wallet, color: "bg-emerald-50 text-emerald-600" },
  "chef.verification.approved": { icon: Shield, color: "bg-emerald-50 text-emerald-600" },
  "chef.verification.failed": { icon: Shield, color: "bg-red-50 text-red-600" },
  "chef.withdrawal.approved": { icon: Wallet, color: "bg-blue-50 text-blue-600" },
  "chef.withdrawal.rejected": { icon: Wallet, color: "bg-red-50 text-red-600" },
  "meal.review.submitted": { icon: MessageSquare, color: "bg-teal-50 text-teal-600" },
  "review.submitted": { icon: MessageSquare, color: "bg-teal-50 text-teal-600" },
  "review.created": { icon: MessageSquare, color: "bg-teal-50 text-teal-600" },
};

export default function ChefNotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ownerId = user?._id || user?.id || user?.email;

  const fetchUnreadCount = useCallback(async () => {
    let apiUnreadCount = 0;
    try {
      const response = await notificationService.getUnreadCount();
      apiUnreadCount = extractUnreadCount(response);
    } catch (error) {}

    setUnreadCount(
      apiUnreadCount + chefNotificationFallbackService.getUnreadCount(ownerId),
    );
  }, [ownerId]);

  const fetchRecentNotifications = useCallback(async () => {
    let apiNotifications = [];
    try {
      const response = await notificationService.getNotifications({ limit: 5 });
      apiNotifications = extractNotificationList(response);
    } catch (error) {}

    const localNotifications = chefNotificationFallbackService.getNotifications(ownerId);

    setNotifications(
      [...localNotifications, ...apiNotifications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    );
  }, [ownerId]);

  const syncChefOrders = useCallback(async () => {
    try {
      const response = await ordersService.getChefOrders();
      if (response.success || response.data) {
        const orders = response.data || [];
        const newNotifications = chefNotificationFallbackService.syncOrderNotifications(
          ownerId,
          orders,
        );

        if (newNotifications && newNotifications.length > 0) {
          newNotifications.forEach((n) => {
            toast.success(n.body, {
              icon: "🍳",
              duration: 6000,
            });
          });
        }
      }
    } catch (error) {}
  }, [ownerId]);

  useEffect(() => {
    queueMicrotask(() => {
      syncChefOrders();
      fetchUnreadCount();
      fetchRecentNotifications();
    });

    const intervalId = setInterval(() => {
      syncChefOrders();
      fetchUnreadCount();
      if (isOpen) fetchRecentNotifications();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchRecentNotifications, fetchUnreadCount, isOpen, syncChefOrders]);

  useEffect(() => {
    const handleLocalUpdate = () => {
      fetchUnreadCount();
      fetchRecentNotifications();
    };

    window.addEventListener(chefNotificationFallbackService.eventName, handleLocalUpdate);
    return () => window.removeEventListener(chefNotificationFallbackService.eventName, handleLocalUpdate);
  }, [fetchRecentNotifications, fetchUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    const destination = getChefNotificationDestination(notification);
    const isUnread = !notification.readAt;
    setIsOpen(false);

    if (isUnread) {
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      );
      setUnreadCount((current) => Math.max(0, current - 1));

      try {
        if (notification.local) {
          chefNotificationFallbackService.markAsRead(ownerId, notification._id);
        } else {
          await notificationService.markAsRead(notification._id);
        }
      } catch (error) {
        fetchUnreadCount();
        fetchRecentNotifications();
      }
    }

    router.push(destination);
  };

  const handleMarkAllAsRead = async () => {
    try {
      chefNotificationFallbackService.markAllAsRead(ownerId);
      try {
        await notificationService.markAllAsRead();
      } catch (error) {}
      
      setNotifications((current) =>
        current.map((item) => ({ ...item, readAt: new Date().toISOString() })),
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Failed to mark notifications as read.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
          isOpen ? "border-[#7c3a2d]/20 bg-[#7c3a2d]/5 text-[#7c3a2d]" : "border-[#eaded8] bg-white text-[#624c44] hover:bg-[#f8f2ef]"
        }`}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#A55632] px-1 text-[10px] font-bold text-white border-2 border-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-[#efe4df] bg-white shadow-xl sm:w-96 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-[#efe4df] bg-[#fcf9f8]/50 px-5 py-4">
            <div>
              <p className="text-sm font-bold text-[#2f221d]">Notifications</p>
              {unreadCount > 0 && (
                 <p className="text-[10px] font-bold text-[#A55632] mt-0.5">{unreadCount} New Updates</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-[#7c3a2d] transition hover:bg-[#7c3a2d]/5"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f2ef] text-[#A55632]">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-bold text-[#2f221d]">No notifications yet</p>
                <p className="mt-1 text-xs text-[#8f7f78]">
                  We'll notify you about new orders and account updates.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#efe4df]">
                {notifications.map((notification) => {
                  const config = NOTIFICATION_ICONS[notification.type] || {
                    icon: Bell,
                    color: "bg-[#f8f2ef] text-[#A55632]",
                  };
                  const Icon = config.icon;
                  const isUnread = !notification.readAt;

                  return (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-[#f8f2ef]/60 ${
                        isUnread ? "bg-[#A55632]/5" : ""
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${config.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3 mb-1">
                          <span className={`truncate text-[13px] font-bold ${isUnread ? 'text-[#2f221d]' : 'text-[#624c44]'}`}>
                            {notification.title}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[#8f7f78]">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.createdAt).toLocaleDateString() === new Date().toLocaleDateString() 
                              ? "Today" 
                              : new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                        <p className={`line-clamp-2 text-xs leading-relaxed ${isUnread ? 'text-[#3f3531]' : 'text-[#8f7f78]'}`}>
                          {notification.body}
                        </p>
                      </span>
                      {isUnread && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#A55632] shadow-[0_0_8px_rgba(165,86,50,0.4)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/chef/notification"
            onClick={() => setIsOpen(false)}
            className="block border-t border-[#efe4df] bg-[#fcf9f8] px-5 py-3.5 text-center text-xs font-bold text-[#7c3a2d] transition hover:bg-[#f8f2ef]"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
