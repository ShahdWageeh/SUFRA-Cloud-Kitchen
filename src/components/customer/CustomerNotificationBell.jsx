"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Clock, PackageCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { notificationService, ordersService } from "@/services";
import customerNotificationFallbackService from "@/services/customerNotificationFallbackService";
import {
  extractNotificationList,
  extractUnreadCount,
  getCustomerNotificationDestination,
  getTimeAgo,
} from "@/utils/notificationUtils";

const NOTIFICATION_ICONS = {
  "order.status.updated": { icon: Truck, color: "bg-primary/10 text-primary" },
  "order.item.status.updated": {
    icon: PackageCheck,
    color: "bg-emerald-50 text-emerald-600",
  },
};

export default function CustomerNotificationBell() {
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
      if (response.success) {
        apiUnreadCount = extractUnreadCount(response);
      }
    } catch (error) {}

    setUnreadCount(
      apiUnreadCount + customerNotificationFallbackService.getUnreadCount(ownerId),
    );
  }, [ownerId]);

  const fetchRecentNotifications = useCallback(async () => {
    let apiNotifications = [];

    try {
      const response = await notificationService.getNotifications({ limit: 5 });
      if (response.success) {
        apiNotifications = extractNotificationList(response);
      }
    } catch (error) {}

    const localNotifications =
      customerNotificationFallbackService.getNotifications(ownerId);

    setNotifications(
      [...localNotifications, ...apiNotifications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    );
  }, [ownerId]);

  const syncOrderNotifications = useCallback(async () => {
    try {
      const response = await ordersService.getMyOrders();
      if (response.success) {
        const newNotifications = customerNotificationFallbackService.syncOrderStatusNotifications(
          ownerId,
          response.data || [],
        );

        if (newNotifications && newNotifications.length > 0) {
          newNotifications.forEach((notification) => {
            toast.success(notification.body, {
              icon: "🔔",
              duration: 5000,
            });
          });
        }
      }
    } catch (error) {}
  }, [ownerId]);

  useEffect(() => {
    queueMicrotask(() => {
      syncOrderNotifications();
      fetchUnreadCount();
      fetchRecentNotifications();
    });

    const intervalId = setInterval(() => {
      syncOrderNotifications();
      fetchUnreadCount();
      if (isOpen) fetchRecentNotifications();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchRecentNotifications, fetchUnreadCount, isOpen, syncOrderNotifications]);

  useEffect(() => {
    const handleLocalNotificationUpdate = () => {
      fetchUnreadCount();
      fetchRecentNotifications();
    };

    window.addEventListener(
      customerNotificationFallbackService.eventName,
      handleLocalNotificationUpdate,
    );

    return () => {
      window.removeEventListener(
        customerNotificationFallbackService.eventName,
        handleLocalNotificationUpdate,
      );
    };
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
    const destination = getCustomerNotificationDestination(notification);
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
          customerNotificationFallbackService.markAsRead(ownerId, notification._id);
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
      customerNotificationFallbackService.markAllAsRead(ownerId);
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
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-surface text-text-primary transition hover:border-primary hover:bg-secondary-container"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-text-primary">Notifications</p>
              <p className="text-xs text-text-secondary">
                Order updates from your chefs
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-secondary-container"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-text-primary">
                  No notifications yet
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  We will let you know when your order moves.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-primary/10">
                {notifications.map((notification) => {
                  const config = NOTIFICATION_ICONS[notification.type] || {
                    icon: Bell,
                    color: "bg-secondary-container text-primary",
                  };
                  const Icon = config.icon;
                  const isUnread = !notification.readAt;

                  return (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-secondary-container/60 ${
                        isUnread ? "bg-primary/5" : ""
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-bold text-text-primary">
                            {notification.title || "Order update"}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-text-tertiary">
                            <Clock className="h-3 w-3" />
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </span>
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-text-secondary">
                          {notification.body || "Your order status has changed."}
                        </span>
                      </span>
                      {isUnread && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/customer/notification"
            onClick={() => setIsOpen(false)}
            className="block border-t border-primary/10 bg-background px-4 py-3 text-center text-xs font-bold text-primary transition hover:bg-secondary-container"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
