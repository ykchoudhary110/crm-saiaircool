'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { ServiceRequest, ServiceStatus, ServicePriority } from '@/types/crm';
import { formatINR, formatDate, getStatusBadge, getPriorityBadge } from '@/lib/utils';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  UserCheck,
  Eye,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface ServiceRequestListProps {
  onNewRequest: () => void;
  onSelectTicket: (ticketId: string) => void;
}

export const ServiceRequestList: React.FC<ServiceRequestListProps> = ({
  onNewRequest,
  onSelectTicket,
}) => {
  const { serviceRequests, customers, appliances, technicians, currentUser } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter requests based on role (Technician only sees assigned)
  const isTechnician = currentUser.role === 'TECHNICIAN';
  const roleFiltered = isTechnician
    ? serviceRequests.filter((r) => r.assignedTechnicianId === 'tech-1')
    : serviceRequests;

  const filtered = roleFiltered.filter((req) => {
    const cust = customers.find((c) => c.id === req.customerId);
    const app = appliances.find((a) => a.id === req.applianceId);
    const tech = technicians.find((t) => t.id === req.assignedTechnicianId);

    const matchesSearch =
      !searchQuery ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust?.mobile.includes(searchQuery) ||
      req.problemCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.problemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || app?.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isTechnician ? 'My Work Orders' : 'Service Requests'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, assign, and manage end-to-end appliance service tickets.
          </p>
        </div>

        {!isTechnician && (
          <button
            onClick={onNewRequest}
            className="flex items-center space-x-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Service Request</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ticket #, customer, issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="TECHNICIAN_EN_ROUTE">En Route</option>
              <option value="TECHNICIAN_ARRIVED">Arrived</option>
              <option value="DIAGNOSIS">Diagnosis</option>
              <option value="REPAIR_IN_PROGRESS">Repair in Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="INVOICED">Invoiced</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Appliances</option>
              <option value="Air Conditioner">Air Conditioner</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="Microwave Oven">Microwave Oven</option>
              <option value="Water Heater / Geyser">Water Heater / Geyser</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-100">
          <span>
            Showing <strong>{filtered.length}</strong> of <strong>{roleFiltered.length}</strong> requests
          </span>
          {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || categoryFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="text-rose-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Service Requests Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Appliance</th>
                <th className="py-3.5 px-4">Problem / Issue</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Preferred Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No service requests found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters or search terms</p>
                  </td>
                </tr>
              ) : (
                filtered.map((req) => {
                  const cust = customers.find((c) => c.id === req.customerId);
                  const app = appliances.find((a) => a.id === req.applianceId);
                  const tech = technicians.find((t) => t.id === req.assignedTechnicianId);
                  const statusBadge = getStatusBadge(req.status);
                  const priorityBadge = getPriorityBadge(req.priority);

                  return (
                    <tr
                      key={req.id}
                      onClick={() => onSelectTicket(req.id)}
                      className="hover:bg-rose-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">{req.id}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">
                          {cust ? `${cust.firstName} ${cust.lastName}` : 'Unknown'}
                        </p>
                        <p className="text-[11px] text-slate-400">{cust?.mobile}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">{app?.category || 'Appliance'}</p>
                        <p className="text-[10px] text-slate-400 font-mono line-clamp-1">{app?.modelNumber}</p>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-medium text-slate-800 line-clamp-1">{req.problemCategory}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{req.problemDescription}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {tech ? (
                          <div className="flex items-center space-x-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="font-medium text-slate-800">{tech.name}</span>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityBadge.bg}`}>
                          {priorityBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{req.preferredDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTicket(req.id);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
