'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { formatDate } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Wrench,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AppointmentsViewProps {
  onSelectTicket: (ticketId: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onSelectTicket,
}) => {
  const { serviceRequests, customers, appliances, technicians } = useCRM();

  const [techFilter, setTechFilter] = useState<string>('ALL');

  const scheduledTickets = serviceRequests.filter(
    (s) => s.status !== 'CANCELLED' && s.status !== 'CLOSED'
  );

  const filtered = scheduledTickets.filter(
    (t) => techFilter === 'ALL' || t.assignedTechnicianId === techFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Service Appointments Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch schedule, on-site visit slots, and field technician availability.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Technician:</span>
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-rose-500 focus:outline-none"
          >
            <option value="ALL">All Field Staff</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointment Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((job) => {
          const cust = customers.find((c) => c.id === job.customerId);
          const app = appliances.find((a) => a.id === job.applianceId);
          const tech = technicians.find((t) => t.id === job.assignedTechnicianId);

          return (
            <div
              key={job.id}
              onClick={() => onSelectTicket(job.id)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{job.preferredDate}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {job.preferredTime}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {job.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">
                    {cust?.firstName} {cust?.lastName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {app?.category} - {app?.modelNumber}
                  </p>
                  <p className="text-xs text-rose-700 font-medium mt-1">
                    Issue: {job.problemCategory}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-start space-x-1.5 mt-2">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{job.address}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                    {tech ? tech.name[0] : '?'}
                  </div>
                  <span className="font-semibold text-slate-800">
                    {tech ? tech.name : 'Unassigned'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                  {job.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
