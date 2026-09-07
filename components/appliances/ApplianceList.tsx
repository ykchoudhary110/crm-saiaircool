'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { ApplianceCategory } from '@/types/crm';
import {
  Tv,
  Search,
  Plus,
  ShieldCheck,
  Calendar,
  Wrench,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ApplianceListProps {
  onNewAppliance: () => void;
  onBookService: (customerId: string, applianceId: string) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const ApplianceList: React.FC<ApplianceListProps> = ({
  onNewAppliance,
  onBookService,
  onSelectCustomer,
}) => {
  const { appliances, customers, serviceRequests } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = appliances.filter((a) => {
    const cust = customers.find((c) => c.id === a.customerId);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      a.modelNumber.toLowerCase().includes(q) ||
      a.serialNumber.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      cust?.firstName.toLowerCase().includes(q) ||
      cust?.lastName.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Registered Appliances
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Godrej installed customer equipment database, warranty verification, and AMC status.
          </p>
        </div>

        <button
          onClick={onNewAppliance}
          className="flex items-center space-x-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Register Appliance</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search model, serial number, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Air Conditioner">Air Conditioner</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Washing Machine">Washing Machine</option>
            <option value="Microwave Oven">Microwave Oven</option>
            <option value="Water Heater / Geyser">Water Heater / Geyser</option>
          </select>
        </div>
      </div>

      {/* Grid of Appliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((app) => {
          const cust = customers.find((c) => c.id === app.customerId);
          const activeJobs = serviceRequests.filter(
            (r) =>
              r.applianceId === app.id &&
              r.status !== 'COMPLETED' &&
              r.status !== 'CLOSED'
          );

          const isWarrantyActive = new Date(app.warrantyEnd) > new Date();

          return (
            <div
              key={app.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-100">
                    {app.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isWarrantyActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isWarrantyActive ? 'In Warranty' : 'Out of Warranty'}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-bold text-slate-900 line-clamp-1">
                  {app.modelNumber}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  SN: {app.serialNumber}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Customer:</span>
                    <button
                      onClick={() => cust && onSelectCustomer(cust.id)}
                      className="font-semibold text-slate-800 hover:text-rose-600 hover:underline"
                    >
                      {cust ? `${cust.firstName} ${cust.lastName}` : 'N/A'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Warranty Expiry:</span>
                    <span className="font-medium text-slate-800">{app.warrantyEnd}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">AMC Status:</span>
                    <span
                      className={`font-semibold ${
                        app.amcStatus === 'Active'
                          ? 'text-emerald-600'
                          : app.amcStatus === 'Expired'
                          ? 'text-rose-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {app.amcStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {activeJobs.length > 0 ? (
                    <span className="text-amber-600 font-semibold">
                      ● {activeJobs.length} active ticket
                    </span>
                  ) : (
                    'Ready for service'
                  )}
                </span>

                <button
                  onClick={() => onBookService(app.customerId, app.id)}
                  className="flex items-center space-x-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Book Service</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
