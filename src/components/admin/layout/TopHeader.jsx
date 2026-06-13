'use client'
import { Search, Bell, Settings, Menu } from 'lucide-react'
import useAuth from '@/hooks/useAuth'

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

export default function TopHeader({ setMobileOpen }) {
  const { user } = useAuth()
  const adminName = getAdminDisplayName(user)
  const initials = getInitials(adminName)
  const roleLabel = user?.role === 'admin' ? 'ADMIN' : 'ADMIN CONSOLE'

  return (
    <header
      className="h-16 md:h-[72px] flex items-center justify-between px-4 md:px-15 gap-4 border-b bg-white sticky top-0 z-20"
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

        {/* Search Bar */}
        {/* <div
          className="flex items-center gap-3 rounded-full px-4 py-2 w-full max-w-[320px] md:max-w-[420px]"
          style={{ backgroundColor: '#F6F4F3' }}
        >
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none flex-1 text-gray-600 placeholder-gray-400 min-w-0"
          />
        </div> */}
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#A55632' }}
          />
        </button>
        
        <button className="hidden sm:block p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Settings size={18} className="text-gray-500" />
        </button>

        <div className="hidden sm:block w-px h-6 bg-gray-200" />

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className="w-8 md:w-9 h-8 md:h-9 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold flex-shrink-0"
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
