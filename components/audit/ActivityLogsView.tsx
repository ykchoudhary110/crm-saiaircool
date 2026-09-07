'use client';

import React from 'react';
import { useCRM } from '@/lib/crmContext';
import { History, Shield, Clock } from 'lucide-react';

export const ActivityLogsView: React.FC = () => {
  const { activityLogs } = useCRM();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Audit Logs & Security Trail
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological record of status changes, technician assignments, part consumption, and financial transactions.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity ID</th>
                <th className="py-3.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {log.userName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-600 font-mono text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {log.entityId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-md">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
