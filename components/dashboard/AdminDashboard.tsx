'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { formatINR, formatDate, getStatusBadge, getPriorityBadge } from '@/lib/utils';
import {
  Wrench,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Plus,
  ShieldCheck,
  Package,
  Calendar,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AdminDashboardProps {
  onNewRequest: () => void;
  onSelectTicket: (ticketId: string) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNewRequest,
  onSelectTicket,
  onSelectCustomer,
}) => {
  const {
    serviceRequests,
    customers,
    appliances,
    technicians,
    invoices,
    parts,
    amcs,
  } = useCRM();

  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // KPI calculations
  const openRequests = serviceRequests.filter(
    (s) => s.status !== 'COMPLETED' && s.status !== 'CLOSED' && s.status !== 'CANCELLED'
  );
  const urgentRequests = openRequests.filter(
    (s) => s.priority === 'Urgent' || s.priority === 'High'
  );
  const completedRequests = serviceRequests.filter(
    (s) => s.status === 'COMPLETED' || s.status === 'CLOSED' || s.status === 'INVOICED'
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const pendingReceivables = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const lowStockParts = parts.filter((p) => p.currentStock <= p.minimumStock);

  // Chart 1: Requests by Appliance Category
  const categoryCountMap: Record<string, number> = {};
  serviceRequests.forEach((req) => {
    const app = appliances.find((a) => a.id === req.applianceId);
    const cat = app?.category || 'Other';
    categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryCountMap).map(([name, count]) => ({
    name,
    count,
  }));

  // Chart 2: Status Breakdown
  const statusCountMap: Record<string, number> = {
    New: serviceRequests.filter((s) => s.status === 'NEW' || s.status === 'CONTACTED').length,
    Scheduled: serviceRequests.filter((s) => s.status === 'SCHEDULED' || s.status === 'ASSIGNED').length,
    'In Progress': serviceRequests.filter(
      (s) =>
        s.status === 'TECHNICIAN_EN_ROUTE' ||
        s.status === 'TECHNICIAN_ARRIVED' ||
        s.status === 'DIAGNOSIS' ||
        s.status === 'WAITING_FOR_PARTS' ||
        s.status === 'REPAIR_IN_PROGRESS'
    ).length,
    Completed: serviceRequests.filter((s) => s.status === 'COMPLETED' || s.status === 'INVOICED' || s.status === 'CLOSED').length,
  };

  const statusPieData = [
    { name: 'New', value: statusCountMap.New, color: '#3b82f6' },
    { name: 'Scheduled', value: statusCountMap.Scheduled, color: '#8b5cf6' },
    { name: 'In Progress', value: statusCountMap['In Progress'], color: '#f59e0b' },
    { name: 'Completed', value: statusCountMap.Completed, color: '#10b981' },
  ].filter((item) => item.value > 0);

  // Revenue by Month (Mock aggregated trend)
  const revenueTrendData = [
    { month: 'Apr', revenue: 42000, jobs: 38 },
    { month: 'May', revenue: 58000, jobs: 54 },
    { month: 'Jun', revenue: 76000, jobs: 71 },
    { month: 'Jul', revenue: 64000, jobs: 62 },
    { month: 'Aug', revenue: 89000, jobs: 85 },
    { month: 'Sep', revenue: totalRevenue > 0 ? totalRevenue : 48500, jobs: completedRequests.length },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title and Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Service Centre Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management of Godrej appliance repairs, technician dispatch, and billing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick Date Range Filter */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs flex">
            {(['today', 'week', 'month', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all ${
                  dateFilter === period
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={onNewRequest}
            className="flex items-center space-x-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Service Request</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockParts.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Inventory Alert:</strong> {lowStockParts.length} critical spare parts are below minimum stock level ({lowStockParts.map((p) => p.name).join(', ')}).
            </span>
          </div>
          <span className="font-semibold text-amber-700 underline cursor-pointer hover:text-amber-800">
            Reorder Parts
          </span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Requests */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Requests</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Wrench className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{openRequests.length}</span>
            <span className="text-xs font-semibold text-rose-600">
              {urgentRequests.length} Urgent / High
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Total open service tickets</p>
        </div>

        {/* Revenue Collected */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Revenue (INR)</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{formatINR(totalRevenue)}</span>
            <span className="text-xs text-emerald-600 font-medium">+14.2%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Pending balance: <span className="font-semibold text-amber-600">{formatINR(pendingReceivables)}</span>
          </p>
        </div>

        {/* Customer Base & AMC */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Customers & AMC</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{customers.length}</span>
            <span className="text-xs font-semibold text-purple-600">
              {amcs.filter((a) => a.status === 'Active').length} Active AMC
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{appliances.length} registered Godrej appliances</p>
        </div>

        {/* Technician Fleet */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Technician Fleet</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{technicians.length}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {technicians.filter((t) => t.status === 'Available').length} Available
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Avg fleet rating: 4.8 / 5.0</p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Revenue & Job Trends */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Service Revenue & Completed Jobs</h3>
              <p className="text-[11px] text-slate-500">Monthly billing and repair volume trend</p>
            </div>
            <span className="text-xs font-medium text-slate-400">Past 6 Months</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'revenue' ? formatINR(Number(val)) : val,
                    name === 'revenue' ? 'Revenue' : 'Jobs',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Breakdown Pie Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Ticket Status Pipeline</h3>
            <p className="text-[11px] text-slate-500">Real-time status distribution</p>
          </div>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technicians Fleet & Recent Service Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Service Requests (2 columns) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Service Tickets</h3>
              <p className="text-[11px] text-slate-500">Live operational requests and assigned field staff</p>
            </div>
            <button
              onClick={() => onSelectTicket(serviceRequests[0]?.id || '')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {serviceRequests.slice(0, 5).map((ticket) => {
              const customer = customers.find((c) => c.id === ticket.customerId);
              const appliance = appliances.find((a) => a.id === ticket.applianceId);
              const tech = technicians.find((t) => t.id === ticket.assignedTechnicianId);
              const statusBadge = getStatusBadge(ticket.status);
              const priorityBadge = getPriorityBadge(ticket.priority);

              return (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket.id)}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600 shrink-0 mt-0.5">
                      <Wrench className="h-4 w-4 text-rose-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{ticket.id}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusBadge.bg}`}
                        >
                          {statusBadge.label}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${priorityBadge.bg}`}
                        >
                          {priorityBadge.label}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 mt-1">
                        {customer?.firstName} {customer?.lastName} •{' '}
                        <span className="text-slate-500">{appliance?.category || 'Appliance'}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {ticket.problemDescription}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs font-semibold text-slate-800">
                      {tech ? tech.name : <span className="text-rose-600">Unassigned</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ticket.preferredDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technician Fleet Status */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Technician Fleet</h3>
              <p className="text-[11px] text-slate-500">Field staff on-call status</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600">
              {technicians.filter((t) => t.status === 'Available').length} Ready
            </span>
          </div>

          <div className="space-y-3">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-slate-900">{t.name}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        t.status === 'Available'
                          ? 'bg-emerald-500'
                          : t.status === 'Busy'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t.specializations.slice(0, 2).join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.mobile}</p>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                    ★ {t.rating}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{t.completedJobs} jobs done</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
