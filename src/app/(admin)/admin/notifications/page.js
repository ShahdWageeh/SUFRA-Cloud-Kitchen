"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ChevronRight, 
  Clock, 
  Shield, 
  MessageSquare, 
  Wallet,
  MoreVertical,
  X,
  AlertCircle
} from "lucide-react";
import { notificationService } from "@/services";
import { getNotificationDestination } from "@/utils/adminNotifications";
import { Loader } from "@/components/ui";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const NOTIFICATION_ICONS = {
  "chef.verification.submitted": {
    icon: Shield,
    color: "bg-blue-100 text-blue-600",
    defaultTitle: "New Verification Request"
  },
  "customer.contact.submitted": {
    icon: MessageSquare,
    color: "bg-teal-100 text-teal-600",
    defaultTitle: "New Contact Message"
  },
  "chef.withdrawal.requested": {
    icon: Wallet,
    color: "bg-amber-100 text-amber-600",
    defaultTitle: "New Withdrawal Request"
  }
};

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const unreadCount = notifications.filter(n => !n.readAt).length;

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success) {
        // Ensure we always have an array even if API structure varies
        const data = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
        setNotifications(data);
      }
    } catch (err) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchNotifications);
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    const destination = getNotificationDestination(notification);
    const isUnread = !notification.readAt;

    if (isUnread) {
      setNotifications(prev =>
        prev.map(n => n._id === notification._id ? { ...n, readAt: new Date() } : n)
      );
      try {
        await notificationService.markAsRead(notification._id);
      } catch (err) {
        toast.error("Failed to mark notification as read.");
        fetchNotifications();
      }
    }

    router.push(destination);
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error("Failed to mark all as read.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notification deleted.");
    } catch (err) {
      toast.error("Failed to delete notification.");
    }
  };

  if (loading && notifications.length === 0) return <Loader fullPage={true} />;

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Bell className="text-[#7c3a2d]" />
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#7c3a2d] px-2.5 py-1 text-xs font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay updated with the latest activities from chefs and customers.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={actionLoading}
            className="flex items-center gap-2 text-sm font-semibold text-[#7c3a2d] hover:bg-[#7c3a2d]/5 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <CheckCheck size={18} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No notifications yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              When important events happen, they will show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => {
              const config = NOTIFICATION_ICONS[notification.type] || {
                icon: Bell,
                color: "bg-slate-100 text-slate-600",
                defaultTitle: "Notification"
              };
              const Icon = config.icon;
              const isUnread = !notification.readAt;

              return (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left flex items-start gap-4 p-5 transition-colors hover:bg-slate-50/80 group ${
                    isUnread ? "bg-amber-50/30" : ""
                  }`}
                  aria-label={`Open notification: ${notification.title || config.defaultTitle}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-bold truncate ${isUnread ? "text-slate-900" : "text-slate-700"}`}>
                        {notification.title || config.defaultTitle}
                      </h3>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1 uppercase tracking-wider">
                        <Clock size={12} />
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-3 ${isUnread ? "text-slate-600 font-medium" : "text-slate-500"}`}>
                      {notification.body}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isUnread && (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#7c3a2d] uppercase tracking-widest bg-[#7c3a2d]/10 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3a2d] animate-pulse" />
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
                          onClick={(e) => handleDelete(notification._id, e)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="p-2 text-[#7c3a2d] bg-[#7c3a2d]/5 rounded-xl">
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
