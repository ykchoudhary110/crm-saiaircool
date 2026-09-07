'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { Technician } from '@/types/crm';
import {
  UserCheck,
  Star,
  Wrench,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Briefcase,
} from 'lucide-react';

interface TechnicianListProps {
  onSelectTicket: (ticketId: string) => void;
}

export const TechnicianList: React.FC<TechnicianListProps> = ({
  onSelectTicket,
}) => {
  const { technicians, serviceRequests } = useCRM();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = technicians.filter(
    (t) => statusFilter === 'ALL' || t.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Field Technician Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified Godrej appliance service engineers, skills matrix, and job workloads.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Availability:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-rose-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy (On-site)</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Grid of Technician Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tech) => {
          const activeJobs = serviceRequests.filter(
            (r) =>
              r.assignedTechnicianId === tech.id &&
              r.status !== 'COMPLETED' &&
              r.status !== 'CLOSED' &&
              r.status !== 'CANCELLED'
          );

          return (
            <div
              key={tech.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {tech.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{tech.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {tech.employeeId} • {tech.experienceYears}y Exp
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      tech.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tech.status === 'Busy'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    ● {tech.status}
                  </span>
                </div>

                {/* Rating & Completed Stats */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs">
                  <div>
                    <span className="block font-bold text-amber-600 flex items-center justify-center">
                      ★ {tech.rating}
                    </span>
                    <span className="text-[10px] text-slate-400">Rating</span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="block font-bold text-slate-800">
                      {tech.completedJobs}
                    </span>
                    <span className="text-[10px] text-slate-400">Jobs Done</span>
                  </div>
                  <div>
                    <span className="block font-bold text-rose-600">
                      {activeJobs.length}
                    </span>
                    <span className="text-[10px] text-slate-400">Active</span>
                  </div>
                </div>

                {/* Specializations Badges */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Skills & Categories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tech.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact details */}
                <div className="mt-4 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <p className="flex items-center space-x-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{tech.mobile}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{tech.email}</span>
                  </p>
                </div>
              </div>

              {/* Active Jobs Preview */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {activeJobs.length > 0 ? (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700">
                      Current Work Order:
                    </span>
                    {activeJobs.slice(0, 1).map((j) => (
                      <div
                        key={j.id}
                        onClick={() => onSelectTicket(j.id)}
                        className="rounded-lg bg-rose-50/70 p-2 text-xs text-rose-950 font-medium cursor-pointer hover:bg-rose-100/80 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{j.id}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white font-bold text-rose-700">
                            {j.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-800 line-clamp-1 mt-0.5">
                          {j.problemCategory}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Available for immediate dispatch</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
