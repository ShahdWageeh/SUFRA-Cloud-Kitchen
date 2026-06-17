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
  ShoppingBag,
  AlertCircle,
  Filter,
  Inbox
} from "lucide-react";
import { notificationService } from "@/services";
import chefNotificationFallbackService from "@/services/chefNotificationFallbackService";
import { Loader } from "@/components/ui";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { extractNotificationList, getTimeAgo, getChefNotificationDestination } from "@/utils/notificationUtils";
import toast from "react-hot-toast";

const NOTIFICATION_ICONS = {
  // Orders
  "chef.order.requested": { icon: ShoppingBag, color: "bg-orange-50 text-orange-600", category: "orders" },
  "chef.order.placed": { icon: ShoppingBag, color: "bg-orange-50 text-orange-600", category: "orders" },
  "chef.order.paid": { icon: Wallet, color: "bg-emerald-50 text-emerald-600", category: "orders" },
  
  // Verification
  "chef.verification.approved": { icon: Shield, color: "bg-emerald-50 text-emerald-600", category: "account" },
  "chef.verification.failed": { icon: Shield, color: "bg-red-50 text-red-600", category: "account" },
  "chef.status.updated": { icon: Shield, color: "bg-blue-50 text-blue-600", category: "account" },

  // Withdrawals
  "chef.withdrawal.approved": { icon: Wallet, color: "bg-blue-50 text-blue-600", category: "payments" },
  "chef.withdrawal.rejected": { icon: Wallet, color: "bg-red-50 text-red-600", category: "payments" },
  
  // Reviews
  "meal.review.submitted": { icon: MessageSquare, color: "bg-teal-50 text-teal-600", category: "reviews" },
  "review.submitted": { icon: MessageSquare, color: "bg-teal-50 text-teal-600", category: "reviews" },
  "review.created": { icon: MessageSquare, color: "bg-teal-50 text-teal-600", category: "reviews" },
};

const TABS = [
  { id: "all", label: "All", filter: {} },
  { id: "unread", label: "Unread", filter: { unread: true } },
];

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "orders", label: "Orders" },
  { id: "reviews", label: "Reviews" },
  { id: "account", label: "Account & Verification" },
  { id: "payments", label: "Payments" },
];

export default function ChefNotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const ownerId = user?._id || user?.id || user?.email;

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      const apiCount = res.success ? (res.data?.unreadCount || res.data?.count || 0) : 0;
      const localCount = chefNotificationFallbackService.getUnreadCount(ownerId);
      setUnreadCount(apiCount + localCount);
    } catch (err) {}
  }, [ownerId]);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 100,
      };

      if (activeTab === "unread") {
        params.unread = true;
      }

      let apiNotifications = [];
      try {
        const res = await notificationService.getNotifications(params);
        apiNotifications = extractNotificationList(res);
      } catch (err) {}

      const localNotifications = chefNotificationFallbackService.getNotifications(ownerId);

      let data = [...localNotifications, ...apiNotifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (activeTab === "unread") {
        data = data.filter(n => !n.readAt);
      }

      // Client-side category filtering
      if (activeCategory !== "all") {
        data = data.filter(n => {
          const type = (n.type || "").toLowerCase();
          
          // Enhanced fuzzy matching for categories
          if (activeCategory === "reviews" && type.includes("review")) return true;
          if (activeCategory === "orders" && type.includes("order")) return true;
          if (activeCategory === "payments" && (type.includes("withdrawal") || type.includes("paid"))) return true;
          if (activeCategory === "account" && (type.includes("verification") || type.includes("status") || type.includes("approved"))) return true;
          
          const config = NOTIFICATION_ICONS[n.type];
          return config?.category === activeCategory;
        });
      }

      setNotifications(data);
    } catch (err) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeCategory, ownerId]);

  useEffect(() => {
    if (ownerId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [fetchNotifications, fetchUnreadCount, ownerId]);

  // Listen for local notification updates
  useEffect(() => {
    const handleLocalUpdate = () => {
      fetchNotifications();
      fetchUnreadCount();
    };

    window.addEventListener(chefNotificationFallbackService.eventName, handleLocalUpdate);
    return () => window.removeEventListener(chefNotificationFallbackService.eventName, handleLocalUpdate);
  }, [fetchNotifications, fetchUnreadCount]);

  const handleNotificationClick = async (notification) => {
    const destination = getChefNotificationDestination(notification);
    const isUnread = !notification.readAt;

    if (isUnread) {
      setNotifications(prev =>
        prev.map(n => n._id === notification._id ? { ...n, readAt: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      try {
        if (notification.local) {
          chefNotificationFallbackService.markAsRead(ownerId, notification._id);
        } else {
          await notificationService.markAsRead(notification._id);
        }
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }

    router.push(destination);
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      chefNotificationFallbackService.markAllAsRead(ownerId);
      try {
        await notificationService.markAllAsRead();
      } catch (err) {}
      
      setNotifications(prev => prev.map(n => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
      setUnreadCount(0);
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
        chefNotificationFallbackService.deleteNotification(ownerId, notification._id);
      } else {
        await notificationService.deleteNotification(notification._id);
      }
      setNotifications(prev => prev.filter(n => n._id !== notification._id));
      if (!notification.readAt) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success("Notification deleted.");
    } catch (err) {
      toast.error("Failed to delete notification.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2f221d] tracking-tight flex items-center gap-3">
            <Bell className="text-[#A55632]" />
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#A55632] px-2.5 py-1 text-xs font-bold text-white shadow-sm animate-in zoom-in">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-[#8f7f78] mt-1">
            Manage your kitchen activity alerts and account updates.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={actionLoading}
              className="flex items-center gap-2 text-sm font-semibold text-[#7c3a2d] hover:bg-[#7c3a2d]/5 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 border border-[#efe4df]"
            >
              <CheckCheck size={18} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center justify-between border-b border-[#efe4df]">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id 
                    ? "text-[#A55632]" 
                    : "text-[#8f7f78] hover:text-[#624c44]"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A55632] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? "bg-[#7c3a2d] text-white border-[#7c3a2d]"
                  : "bg-white text-[#624c44] border-[#eaded8] hover:border-[#A55632] hover:text-[#A55632]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#efe4df] shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader />
            <p className="text-sm text-[#8f7f78] mt-4 font-medium">Fetching notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
            <div className="w-20 h-20 bg-[#fcf9f8] rounded-full flex items-center justify-center mb-6 text-[#A55632]/20">
              <Inbox size={40} />
            </div>
            <h3 className="text-xl font-bold text-[#2f221d]">All caught up!</h3>
            <p className="text-sm text-[#8f7f78] mt-2 max-w-xs mx-auto">
              {activeTab === "unread" 
                ? "You've read all your notifications in this category."
                : "No notifications found. We'll alert you when something happens!"}
            </p>
            {(activeTab !== "all" || activeCategory !== "all") && (
              <button
                onClick={() => { setActiveTab("all"); setActiveCategory("all"); }}
                className="mt-6 text-sm font-bold text-[#A55632] hover:underline flex items-center gap-2 mx-auto"
              >
                <Filter size={14} />
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#efe4df]">
            {notifications.map((notification) => {
              const config = NOTIFICATION_ICONS[notification.type] || {
                icon: Bell,
                color: "bg-[#fcf9f8] text-[#A55632]",
                category: "other"
              };
              const Icon = config.icon;
              const isUnread = !notification.readAt;

              return (
                <div
                  key={notification._id}
                  className={`relative group transition-all hover:bg-[#fcf9f8]/60 ${
                    isUnread ? "bg-[#A55632]/5" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full text-left flex items-start gap-4 p-5 sm:p-6"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.color} shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm sm:text-base font-bold truncate ${isUnread ? "text-[#2f221d]" : "text-[#624c44]"}`}>
                            {notification.title}
                          </h3>
                          {notification.priority === "urgent" && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full">
                              <AlertCircle size={10} />
                              Urgent
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-[#8f7f78] whitespace-nowrap flex items-center gap-1 uppercase tracking-wider">
                          <Clock size={12} />
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className={`text-sm leading-relaxed mb-4 max-w-3xl ${isUnread ? "text-[#3f3531] font-medium" : "text-[#8f7f78]"}`}>
                        {notification.body}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isUnread && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#A55632] uppercase tracking-widest bg-[#A55632]/10 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#A55632] animate-pulse" />
                              New
                            </span>
                          )}
                          {notification.actionPath && (
                            <span className="text-[10px] font-bold text-[#7c3a2d] uppercase tracking-widest flex items-center gap-1">
                              View details <ChevronRight size={12} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDelete(notification, e)}
                      className="p-2 text-[#8f7f78] hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!loading && notifications.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-xs text-[#8f7f78] font-medium">
            Showing {notifications.length} notifications • Updates are kept for 90 days
          </p>
        </div>
      )}
    </div>
  );
}
