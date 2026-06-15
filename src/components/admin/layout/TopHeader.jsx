'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, Menu, Clock, CheckCheck, ChevronRight, Shield, MessageSquare, Wallet } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { notificationService } from '@/services'
import { extractUnreadCount, getNotificationDestination } from '@/utils/adminNotifications'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const NOTIFICATION_ICONS = {
  "chef.verification.submitted": { icon: Shield, color: "text-blue-500 bg-blue-50" },
  "customer.contact.submitted": { icon: MessageSquare, color: "text-teal-500 bg-teal-50" },
  "chef.withdrawal.requested": { icon: Wallet, color: "text-amber-500 bg-amber-50" }
};

function getAdminDisplayName(user) {
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  return fullName || user?.name || user?.email?.split('@')?.[0] || 'Admin'
}

function getInitials(name) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'A'
  )
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
}

export default function TopHeader({ setMobileOpen }) {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const adminName = getAdminDisplayName(user)
  const initials = getInitials(adminName)
  const roleLabel = user?.role === 'admin' ? 'ADMIN' : 'ADMIN CONSOLE'

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) setUnreadCount(extractUnreadCount(res));
    } catch (err) {}
  };

  const fetchRecentNotifications = async () => {
    try {
      const res = await notificationService.getNotifications({ limit: 5 });
      if (res.success) {
        // Ensure we always have an array even if API structure varies
        const data = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
        setNotifications(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    queueMicrotask(() => {
      fetchUnreadCount();
      fetchRecentNotifications();
    });
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (isDropdownOpen) fetchRecentNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    const destination = getNotificationDestination(notification);
    const isUnread = !notification.readAt;

    setIsDropdownOpen(false);
    if (isUnread) {
      setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, readAt: new Date() } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      try {
        await notificationService.markAsRead(notification._id);
      } catch (err) {
        fetchUnreadCount();
        fetchRecentNotifications();
      }
    }
    router.push(destination);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
      setUnreadCount(0);
      toast.success("All caught up!");
    } catch (err) {}
  };

  return (
    <header
      className="h-16 md:h-[72px] flex items-center justify-between px-4 md:px-15 gap-4 border-b bg-white sticky top-0 z-30"
      style={{ borderColor: '#ECE8E5' }}
    >
      {/* Left side: Hamburger (Mobile Only) & Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`relative p-2 rounded-xl transition-all duration-200 ${isDropdownOpen ? 'bg-[#7c3a2d]/10 text-[#7c3a2d]' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <Bell size={18} className={isDropdownOpen ? 'text-[#7c3a2d]' : ''} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-[#A55632] text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-[#7c3a2d]/10 text-[#7c3a2d] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] font-bold text-[#7c3a2d] hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Bell size={20} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">No notifications yet</p>
                    <p className="text-xs text-slate-500 mt-1">We will let you know when something happens.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications?.map((n) => {
                      const config = NOTIFICATION_ICONS[n.type] || { icon: Bell, color: "text-slate-400 bg-slate-50" };
                      const Icon = config.icon;
                      const isUnread = !n.readAt;
                      const destination = getNotificationDestination(n);

                      return (
                        <button
                          key={n._id}
                          type="button"
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full text-left flex items-start gap-3 p-4 transition-colors hover:bg-slate-50 group ${isUnread ? 'bg-amber-50/20' : ''}`}
                          aria-label={`Open notification: ${n.title || 'Notification'}`}
                          title={destination}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.color} transition-transform group-hover:scale-105 shadow-sm`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <p className={`text-xs font-bold truncate ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                                {n.title}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                                <Clock size={10} />
                                {getTimeAgo(n.createdAt)}
                              </span>
                            </div>
                            <p className={`text-[11px] leading-relaxed line-clamp-2 ${isUnread ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                              {n.body}
                            </p>
                          </div>
                          {isUnread && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7c3a2d] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(124,58,45,0.4)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <Link 
                href="/admin/notifications" 
                onClick={() => setIsDropdownOpen(false)}
                className="block py-3.5 text-center text-xs font-bold text-slate-600 bg-slate-50/80 hover:bg-slate-100 transition-colors border-t border-slate-100"
              >
                View all notifications
                <ChevronRight size={14} className="inline ml-1" />
              </Link>
            </div>
          )}
        </div>
        
        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div
            className="w-8 md:w-9 h-8 md:h-9 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold flex-shrink-0 transition-transform group-hover:scale-105"
            style={{ backgroundColor: '#A55632' }}
          >
            {initials}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-800 leading-tight max-w-40 truncate">
              {adminName}
            </div>
            <div className="text-xs font-medium" style={{ color: '#A55632' }}>
              {roleLabel}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
