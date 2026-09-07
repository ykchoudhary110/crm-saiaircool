'use client';

import React from 'react';
import { useCRM } from '@/lib/crmContext';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Calendar,
  UserCheck,
  Package,
  Receipt,
  ShieldCheck,
  BarChart3,
  History,
  Settings,
  X,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}) => {
  const { currentUser, serviceRequests } = useCRM();

  const isTechnician = currentUser.role === 'TECHNICIAN';

  // Count active jobs for technician
  const techJobsCount = serviceRequests.filter(
    (r) =>
      r.assignedTechnicianId === 'tech-1' &&
      r.status !== 'COMPLETED' &&
      r.status !== 'CLOSED' &&
      r.status !== 'CANCELLED'
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: isTechnician ? 'My Tech Dashboard' : 'Dashboard',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER', 'TECHNICIAN'],
      badge: isTechnician && techJobsCount > 0 ? `${techJobsCount} Active` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'service-requests',
      label: isTechnician ? 'Assigned Jobs' : 'Service Requests',
      icon: Wrench,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER', 'TECHNICIAN'],
      badge: `${serviceRequests.filter((s) => s.status !== 'CLOSED' && s.status !== 'COMPLETED').length}`,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
    },
    {
      id: 'appliances',
      label: 'Appliances',
      icon: Smartphone,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER', 'TECHNICIAN'],
    },
    {
      id: 'technicians',
      label: 'Technicians',
      icon: UserCheck,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
    },
    {
      id: 'parts',
      label: 'Parts & Inventory',
      icon: Package,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER', 'TECHNICIAN'],
    },
    {
      id: 'invoices',
      label: 'Invoices & Payments',
      icon: Receipt,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
    },
    {
      id: 'warranty-amc',
      label: 'Warranty & AMC',
      icon: ShieldCheck,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
    },
    {
      id: 'activity-logs',
      label: 'Audit & Activity',
      icon: History,
      roles: ['SUPER_ADMIN'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      roles: ['SUPER_ADMIN'],
    },
  ];

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 to-rose-400 text-white font-bold text-lg shadow-md shadow-rose-900/30">
              S
            </div>
            <div>
              <span className="block text-sm font-bold text-white tracking-wide">
                SAI AIR COOL
              </span>
              <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Official Godrej Service Centre
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Role Banner */}
        <div className="mx-3 my-3 rounded-lg bg-slate-800/80 p-2.5 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white">
                {currentUser.name}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-900">
              {currentUser.role.split('_')[0]}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Official Godrej Service Centre</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Sai Air Cool • Godrej Care Hub
          </p>
        </div>
      </aside>
    </>
  );
};
