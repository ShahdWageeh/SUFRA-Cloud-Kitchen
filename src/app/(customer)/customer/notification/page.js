"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ChevronRight, 
  Clock, 
  PackageCheck, 
  Truck,
  AlertCircle
} from "lucide-react";
import { notificationService } from "@/services";
import customerNotificationFallbackService from "@/services/customerNotificationFallbackService";
import { 
  extractNotificationList, 
  extractUnreadCount, 
  getCustomerNotificationDestination,
  getTimeAgo 
} from "@/utils/notificationUtils";
import { Loader } from "@/components/ui";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const NOTIFICATION_ICONS = {
  "order.status.updated": { 
    icon: Truck, 
    color: "bg-primary/10 text-primary",
    defaultTitle: "Order Status Updated"
  },
  "order.item.status.updated": {
    icon: PackageCheck,
    color: "bg-emerald-50 text-emerald-600",
    defaultTitle: "Item Status Updated"
  },
};

export default function CustomerNotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const ownerId = user?._id || user?.id || user?.email;

  const unreadCount = notifications.filter(n => !n.readAt).length;

  const fetchNotifications = useCallback(async () => {
    if (!ownerId) return;

    try {
      setLoading(true);
      let apiNotifications = [];
      
      try {
        const res = await notificationService.getNotifications();
        // The service returns response.data directly, which is the body
        apiNotifications = extractNotificationList(res);
      } catch (err) {
        console.error("Failed to load API notifications", err);
      }

      const localNotifications = customerNotificationFallbackService.getNotifications(ownerId);

      const allNotifications = [...localNotifications, ...apiNotifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(allNotifications);
    } catch (err) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    if (ownerId) {
      fetchNotifications();
    }
  }, [fetchNotifications, ownerId]);

  // Listen for local notification updates
  useEffect(() => {
    const handleLocalUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener(customerNotificationFallbackService.eventName, handleLocalUpdate);
    return () => window.removeEventListener(customerNotificationFallbackService.eventName, handleLocalUpdate);
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    const destination = getCustomerNotificationDestination(notification);
    const isUnread = !notification.readAt;

    if (isUnread) {
      setNotifications(prev =>
        prev.map(n => n._id === notification._id ? { ...n, readAt: new Date().toISOString() } : n)
      );
      try {
        if (notification.local) {
          customerNotificationFallbackService.markAsRead(ownerId, notification._id);
        } else {
          await notificationService.markAsRead(notification._id);
        }
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }

    router.push(destination);
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      customerNotificationFallbackService.markAllAsRead(ownerId);
      try {
        await notificationService.markAllAsRead();
      } catch (err) {
        console.error("Failed to mark all API notifications as read", err);
      }
      
      setNotifications(prev => prev.map(n => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error("Failed to mark all as read.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (notification, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (notification.local) {
        customerNotificationFallbackService.deleteNotification(ownerId, notification._id);
      } else {
        await notificationService.deleteNotification(notification._id);
      }
      setNotifications(prev => prev.filter(n => n._id !== notification._id));
      toast.success("Notification deleted.");
    } catch (err) {
      toast.error("Failed to delete notification.");
    }
  };

  if ((loading || authLoading) && notifications.length === 0) return <Loader fullPage={true} />;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Bell className="text-primary" />
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with your order status and other activities.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={actionLoading}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <CheckCheck size={18} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Bell size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No notifications yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              When something important happens with your orders, it will show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const config = NOTIFICATION_ICONS[notification.type] || {
                icon: Bell,
                color: "bg-gray-100 text-gray-600",
                defaultTitle: "Update"
              };
              const Icon = config.icon;
              const isUnread = !notification.readAt;

              return (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left flex items-start gap-4 p-5 transition-colors hover:bg-gray-50/80 group ${
                    isUnread ? "bg-primary/5" : ""
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.color} shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-bold truncate ${isUnread ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title || config.defaultTitle}
                      </h3>
                      <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap flex items-center gap-1 uppercase tracking-wider">
                        <Clock size={12} />
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-3 ${isUnread ? "text-gray-600 font-medium" : "text-gray-500"}`}>
                      {notification.body}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isUnread && (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            New
                          </span>
                        )}
                        {notification.priority === "urgent" && (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full">
                            <AlertCircle size={10} />
                            Urgent
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDelete(notification, e)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="p-2 text-primary bg-primary/5 rounded-xl">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
