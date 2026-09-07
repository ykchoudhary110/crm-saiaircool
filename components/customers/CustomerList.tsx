'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { Customer, CustomerType } from '@/types/crm';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Eye,
  ShieldCheck,
  Tv,
} from 'lucide-react';

interface CustomerListProps {
  onSelectCustomer: (customerId: string) => void;
  onNewCustomer: () => void;
  onNewRequestForCustomer: (customerId: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  onSelectCustomer,
  onNewCustomer,
  onNewRequestForCustomer,
}) => {
  const { customers, appliances, serviceRequests } = useCRM();

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);

    const matchesType = typeFilter === 'ALL' || c.customerType === typeFilter;
    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer accounts, registered addresses, and service records.
          </p>
        </div>

        <button
          onClick={onNewCustomer}
          className="flex items-center space-x-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, mobile number, city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Account Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Address / City</th>
                <th className="py-3.5 px-4">Account Type</th>
                <th className="py-3.5 px-4">Appliances</th>
                <th className="py-3.5 px-4">Tickets</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const customerApps = appliances.filter((a) => a.customerId === c.id);
                const customerReqs = serviceRequests.filter((r) => r.customerId === c.id);

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCustomer(c.id)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                          {c.firstName[0]}
                          {c.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {c.firstName} {c.lastName}
                          </p>
                          <p className="text-[10px] text-slate-400">{c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{c.mobile}</p>
                      <p className="text-[11px] text-slate-400">{c.email}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-800 line-clamp-1">{c.address}</p>
                      <p className="text-[11px] text-slate-400">{c.city}, {c.state}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {c.customerType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{customerApps.length}</span>{' '}
                      <span className="text-slate-400">appliances</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{customerReqs.length}</span>{' '}
                      <span className="text-slate-400">tickets</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCustomer(c.id);
                        }}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors mr-1"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
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
