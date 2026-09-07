'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { formatINR } from '@/lib/utils';
import {
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Tv,
  Users,
} from 'lucide-react';

export const WarrantyAndAmc: React.FC = () => {
  const { warranties, amcs, customers, appliances } = useCRM();

  const [activeTab, setActiveTab] = useState<'warranty' | 'amc'>('amc');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Warranty & AMC Contracts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage manufacturer warranties, annual maintenance contracts, and periodic visits.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('amc')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'amc'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AMC Contracts ({amcs.length})
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'warranty'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Appliance Warranties ({warranties.length})
          </button>
        </div>
      </div>

      {/* AMC Contracts View */}
      {activeTab === 'amc' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {amcs.map((amc) => {
              const cust = customers.find((c) => c.id === amc.customerId);
              const app = appliances.find((a) => a.id === amc.applianceId);
              const visitsLeft = amc.totalVisits - amc.visitsUsed;

              return (
                <div
                  key={amc.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {amc.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          amc.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {amc.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-2">
                      {amc.planName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {cust?.firstName} {cust?.lastName} • {app?.category}
                    </p>

                    {/* Progress of visits */}
                    <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Maintenance Visits:</span>
                        <strong className="text-slate-800">
                          {amc.visitsUsed} of {amc.totalVisits} used
                        </strong>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-600 rounded-full"
                          style={{
                            width: `${(amc.visitsUsed / amc.totalVisits) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                        <span>Valid: {amc.startDate}</span>
                        <span>Till: {amc.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">
                        Contract Value
                      </span>
                      <strong className="text-slate-900 font-extrabold text-sm">
                        {formatINR(amc.amount)}
                      </strong>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                      {visitsLeft} Visits Left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warranties Table View */}
      {activeTab === 'warranty' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Warranty ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Appliance Serial</th>
                  <th className="py-3.5 px-4">Coverage Type</th>
                  <th className="py-3.5 px-4">Start Date</th>
                  <th className="py-3.5 px-4">End Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {warranties.map((w) => {
                  const cust = customers.find((c) => c.id === w.customerId);
                  const isExpired = new Date(w.endDate) < new Date();
                  return (
                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                        {w.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {cust ? `${cust.firstName} ${cust.lastName}` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {w.serialNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                        <p className="font-medium">{w.warrantyType}</p>
                        <p className="text-[10px] text-slate-400">{w.coverage}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{w.startDate}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{w.endDate}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            !isExpired
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {!isExpired ? 'Active' : 'Expired'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
