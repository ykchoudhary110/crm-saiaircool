'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { ServiceRequest, ServiceStatus } from '@/types/crm';
import { formatINR, getStatusBadge, getPriorityBadge } from '@/lib/utils';
import {
  Wrench,
  Navigation,
  MapPin,
  CheckCircle,
  Clock,
  Phone,
  AlertCircle,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Package,
  FileText,
  Star,
} from 'lucide-react';

interface TechnicianDashboardProps {
  onOpenJobDetail: (ticketId: string) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  onOpenJobDetail,
}) => {
  const {
    currentUser,
    serviceRequests,
    customers,
    appliances,
    updateServiceRequestStatus,
    parts,
    addPartsUsed,
    completeServiceJob,
  } = useCRM();

  // Filter jobs assigned to the current technician (defaulting to tech-1 Rahul Verma)
  const techId = currentUser.role === 'TECHNICIAN' ? 'tech-1' : 'tech-1';
  const assignedJobs = serviceRequests.filter(
    (r) => r.assignedTechnicianId === techId
  );

  const activeJobs = assignedJobs.filter(
    (r) =>
      r.status !== 'COMPLETED' && r.status !== 'CLOSED' && r.status !== 'CANCELLED'
  );
  const completedJobs = assignedJobs.filter(
    (r) => r.status === 'COMPLETED' || r.status === 'INVOICED' || r.status === 'CLOSED'
  );

  // Quick Action Modal states for technicians
  const [selectedJob, setSelectedJob] = useState<ServiceRequest | null>(null);
  const [modalType, setModalType] = useState<
    'none' | 'diagnosis' | 'parts' | 'complete'
  >('none');

  // Form states for quick actions
  const [diagnosisFound, setDiagnosisFound] = useState('');
  const [diagnosisSolution, setDiagnosisSolution] = useState('');
  const [selectedPartId, setSelectedPartId] = useState(parts[0]?.id || '');
  const [partQty, setPartQty] = useState(1);
  const [completionNotes, setCompletionNotes] = useState('');
  const [rating, setRating] = useState(5);

  const handleStartTravel = (reqId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateServiceRequestStatus(reqId, 'TECHNICIAN_EN_ROUTE', 'Started travel to customer site');
  };

  const handleMarkArrived = (reqId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateServiceRequestStatus(reqId, 'TECHNICIAN_ARRIVED', 'Arrived at customer site');
  };

  const handleSaveDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    updateServiceRequestStatus(selectedJob.id, 'DIAGNOSIS');
    setModalType('none');
  };

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    addPartsUsed(selectedJob.id, selectedPartId, Number(partQty));
    setModalType('none');
  };

  const handleCompleteJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    completeServiceJob(selectedJob.id, completionNotes || 'Repair verified and customer satisfied', rating);
    setModalType('none');
  };

  return (
    <div className="space-y-6">
      {/* Technician Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Technician Field Portal
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-white">
              Hello, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Emp ID: GDJ-TECH-01 • Service Van #MH-02-EE-4190 • Active Shift
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3 backdrop-blur-md">
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-amber-400">{activeJobs.length}</span>
              <span className="text-[10px] uppercase font-bold text-slate-300">Pending</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-emerald-400">{completedJobs.length}</span>
              <span className="text-[10px] uppercase font-bold text-slate-300">Done</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-rose-400">4.9</span>
              <span className="text-[10px] uppercase font-bold text-slate-300">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Assigned Jobs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-rose-600" />
            <span>Today&apos;s Active Work Orders ({activeJobs.length})</span>
          </h2>
          <span className="text-xs text-slate-500">Tap card to open full details</span>
        </div>

        {activeJobs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">All caught up!</p>
            <p className="text-xs text-slate-500 mt-1">
              You have no pending jobs right now. Check back when service manager assigns a new ticket.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job) => {
              const customer = customers.find((c) => c.id === job.customerId);
              const appliance = appliances.find((a) => a.id === job.applianceId);
              const statusBadge = getStatusBadge(job.status);
              const priorityBadge = getPriorityBadge(job.priority);

              return (
                <div
                  key={job.id}
                  onClick={() => onOpenJobDetail(job.id)}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-extrabold text-sm text-slate-900">{job.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${statusBadge.bg}`}>
                        {statusBadge.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${priorityBadge.bg}`}>
                        {priorityBadge.label}
                      </span>
                      <span className="text-xs font-semibold text-rose-600">
                        {job.serviceType}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Preferred: {job.preferredDate} ({job.preferredTime})</span>
                    </div>
                  </div>

                  {/* Appliance & Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        {appliance?.category} - {appliance?.modelNumber}
                      </p>
                      <p className="text-slate-500 font-mono mt-0.5">
                        SN: {appliance?.serialNumber} | Warranty: {appliance?.warrantyEnd}
                      </p>
                      <div className="mt-2 rounded-lg bg-rose-50 p-2.5 text-rose-900 font-medium">
                        <strong>Problem:</strong> {job.problemDescription}
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-4">
                      <p className="font-semibold text-slate-900">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <a
                          href={`tel:${customer?.mobile}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-rose-600 font-medium"
                        >
                          {customer?.mobile}
                        </a>
                      </div>
                      <div className="flex items-start space-x-2 text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                          {job.address || customer?.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Technician Quick Action Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    {/* Workflow status buttons */}
                    {job.status === 'ASSIGNED' && (
                      <button
                        onClick={(e) => handleStartTravel(job.id, e)}
                        className="flex items-center space-x-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        <span>Start Travel</span>
                      </button>
                    )}

                    {(job.status === 'ASSIGNED' || job.status === 'TECHNICIAN_EN_ROUTE') && (
                      <button
                        onClick={(e) => handleMarkArrived(job.id, e)}
                        className="flex items-center space-x-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Mark Arrived</span>
                      </button>
                    )}

                    {(job.status === 'TECHNICIAN_ARRIVED' || job.status === 'DIAGNOSIS') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                          setModalType('diagnosis');
                        }}
                        className="flex items-center space-x-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Add Diagnosis</span>
                      </button>
                    )}

                    {(job.status === 'TECHNICIAN_ARRIVED' ||
                      job.status === 'DIAGNOSIS' ||
                      job.status === 'REPAIR_IN_PROGRESS' ||
                      job.status === 'WAITING_FOR_PARTS') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                          setModalType('parts');
                        }}
                        className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
                      >
                        <Package className="h-3.5 w-3.5" />
                        <span>Add Parts Used</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                        setModalType('complete');
                      }}
                      className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 ml-auto"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Complete Job</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Modal: Diagnosis */}
      {modalType === 'diagnosis' && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Record Diagnosis for {selectedJob.id}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add technical findings and root cause for customer approval.
            </p>
            <form onSubmit={handleSaveDiagnosis} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Defect Found
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PCB burnt, Fan motor capacitor dead"
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-rose-500 focus:outline-none"
                  value={diagnosisFound}
                  onChange={(e) => setDiagnosisFound(e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Recommended Solution
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Replace capacitor and clean outdoor coils"
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-rose-500 focus:outline-none"
                  value={diagnosisSolution}
                  onChange={(e) => setDiagnosisSolution(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType('none')}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Save Diagnosis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Action Modal: Add Parts */}
      {modalType === 'parts' && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Consume Spare Part for {selectedJob.id}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select genuine Godrej OEM part. Inventory stock will automatically decrease.
            </p>
            <form onSubmit={handleAddPart} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Select Spare Part
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-rose-500 focus:outline-none"
                  value={selectedPartId}
                  onChange={(e) => setSelectedPartId(e.target.value)}
                >
                  {parts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.currentStock} | ₹{p.sellingPrice})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={partQty}
                  onChange={(e) => setPartQty(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType('none')}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Deduct & Add Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Action Modal: Complete Job */}
      {modalType === 'complete' && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Mark Service Completed: {selectedJob.id}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Record job summary and customer handover confirmation.
            </p>
            <form onSubmit={handleCompleteJob} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Work Performed Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Tested operation for 20 mins. Cold air throw normal. Customer demonstrated."
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-rose-500 focus:outline-none"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Customer Rating (1 - 5 Stars)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1.5 rounded-lg border ${
                        rating >= star
                          ? 'bg-amber-100 border-amber-300 text-amber-600 font-bold'
                          : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType('none')}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700"
                >
                  Submit Completion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
