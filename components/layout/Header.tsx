'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { Role } from '@/types/crm';
import {
  Bell,
  Search,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
}) => {
  const {
    currentUser,
    switchRole,
    notifications,
    markNotificationRead,
    clearNotifications,
    resetToDemoData,
  } = useCRM();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-sm">
      {/* Left: Mobile menu button & Search Trigger */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 sm:w-64 md:text-sm"
        >
          <Search className="h-4 w-4 text-slate-400" />
          <span className="hidden sm:inline">Search ticket, customer, part...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200 sm:inline-block ml-auto">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Center/Right: Role Switcher (Crucial for Demo) */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span className="text-xs font-medium text-slate-500 px-2">Role:</span>
          {(
            [
              { role: 'SUPER_ADMIN', label: 'Admin', icon: '👑' },
              { role: 'SERVICE_MANAGER', label: 'Manager', icon: '💼' },
              { role: 'TECHNICIAN', label: 'Technician', icon: '🔧' },
            ] as { role: Role; label: string; icon: string }[]
          ).map((item) => {
            const isActive = currentUser.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => switchRole(item.role)}
                className={`flex items-center space-x-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (confirm('Reset all demo data back to default initial state?')) {
              resetToDemoData();
            }
          }}
          title="Reset to initial demo data"
          className="hidden md:flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden xl:inline">Reset Demo</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
                <span className="text-sm font-semibold text-slate-800">
                  Notifications ({unreadCount} unread)
                </span>
                <button
                  onClick={clearNotifications}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                        !n.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {n.type === 'success' && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        )}
                        {n.type === 'warning' && (
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        )}
                        {n.type === 'info' && (
                          <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <p className="text-slate-600 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge / Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                {currentUser.role.replace('_', ' ')}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-800 rounded">
                  {currentUser.role}
                </span>
              </div>
              <div className="p-2">
                <p className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                  Switch Active Role:
                </p>
                {(['SUPER_ADMIN', 'SERVICE_MANAGER', 'TECHNICIAN'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                      currentUser.role === r
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
