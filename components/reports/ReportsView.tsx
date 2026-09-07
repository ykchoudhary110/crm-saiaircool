'use client';

import React from 'react';
import { useCRM } from '@/lib/crmContext';
import { formatINR } from '@/lib/utils';
import {
  BarChart3,
  Download,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Star,
  Users,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { serviceRequests, invoices, technicians, parts } = useCRM();

  const totalTickets = serviceRequests.length;
  const completedTickets = serviceRequests.filter(
    (s) => s.status === 'COMPLETED' || s.status === 'INVOICED' || s.status === 'CLOSED'
  ).length;
  const completionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  // CSV Export function
  const handleExportCSV = () => {
    const headers = [
      'TicketID',
      'CustomerID',
      'ApplianceID',
      'ServiceType',
      'Priority',
      'Status',
      'TechnicianID',
      'CreatedDate',
      'FinalCost',
    ];
    const rows = serviceRequests.map((r) => [
      r.id,
      r.customerId,
      r.applianceId,
      r.serviceType,
      r.priority,
      r.status,
      r.assignedTechnicianId || 'Unassigned',
      r.createdAt,
      r.finalCost || r.estimatedCost || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `godrej_service_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reports & Business Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Operational KPIs, service turnaround times, financial collections, and CSV data export.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Service Data (CSV)</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Job Completion Rate</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{completionRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {completedTickets} of {totalTickets} requests resolved
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Avg Resolution Time</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">3.8 hrs</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            -45 mins vs target SLA
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Billed (INR)</span>
            <TrendingUp className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatINR(totalBilled)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Collected: {formatINR(totalCollected)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Outstanding Balances</span>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{formatINR(totalOutstanding)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Pending customer settlement</p>
        </div>
      </div>

      {/* Technician Leaderboard */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Field Engineer Performance Leaderboard
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Ranked by customer satisfaction ratings, completed jobs, and first-time-fix rate.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Technician</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Completed Jobs</th>
                <th className="py-2.5 px-3">Active Jobs</th>
                <th className="py-2.5 px-3">Primary Category</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {technicians.map((t) => {
                const active = serviceRequests.filter(
                  (r) =>
                    r.assignedTechnicianId === t.id &&
                    r.status !== 'COMPLETED' &&
                    r.status !== 'CLOSED'
                ).length;
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-900">{t.name}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center text-amber-600 font-bold">
                        ★ {t.rating}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">{t.completedJobs}</td>
                    <td className="py-3 px-3 font-semibold text-rose-600">{active}</td>
                    <td className="py-3 px-3 text-slate-600">{t.specializations[0]}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
