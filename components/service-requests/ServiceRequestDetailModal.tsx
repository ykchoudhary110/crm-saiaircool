'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { ServiceStatus, ServicePriority } from '@/types/crm';
import { formatINR, formatDate, getStatusBadge, getPriorityBadge } from '@/lib/utils';
import {
  X,
  Wrench,
  User,
  Tv,
  Calendar,
  CheckCircle2,
  Package,
  Receipt,
  FileText,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface ServiceRequestDetailModalProps {
  ticketId: string | null;
  onClose: () => void;
  onOpenCustomer: (customerId: string) => void;
  onGenerateInvoice: (ticketId: string) => void;
}

export const ServiceRequestDetailModal: React.FC<ServiceRequestDetailModalProps> = ({
  ticketId,
  onClose,
  onOpenCustomer,
  onGenerateInvoice,
}) => {
  const {
    serviceRequests,
    customers,
    appliances,
    technicians,
    parts,
    activityLogs,
    invoices,
    updateServiceRequestStatus,
    assignTechnician,
    saveDiagnosis,
    addPartsUsed,
    currentUser,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'diagnosis' | 'parts' | 'timeline'
  >('overview');

  // Diagnosis edit state
  const [editingDiagnosis, setEditingDiagnosis] = useState(false);
  const [problemFound, setProblemFound] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [solution, setSolution] = useState('');
  const [labourCharge, setLabourCharge] = useState(450);
  const [partsCharge, setPartsCharge] = useState(0);

  // Add parts state
  const [selectedPartId, setSelectedPartId] = useState(parts[0]?.id || '');
  const [partQty, setPartQty] = useState(1);

  if (!ticketId) return null;

  const ticket = serviceRequests.find((r) => r.id === ticketId);
  if (!ticket) return null;

  const customer = customers.find((c) => c.id === ticket.customerId);
  const appliance = appliances.find((a) => a.id === ticket.applianceId);
  const technician = technicians.find((t) => t.id === ticket.assignedTechnicianId);
  const invoice = invoices.find((i) => i.serviceRequestId === ticket.id);

  const statusBadge = getStatusBadge(ticket.status);
  const priorityBadge = getPriorityBadge(ticket.priority);

  // Status transition list
  const workflowStatuses: ServiceStatus[] = [
    'NEW',
    'SCHEDULED',
    'ASSIGNED',
    'TECHNICIAN_EN_ROUTE',
    'TECHNICIAN_ARRIVED',
    'DIAGNOSIS',
    'REPAIR_IN_PROGRESS',
    'COMPLETED',
    'INVOICED',
    'CLOSED',
  ];

  const handleSaveDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    saveDiagnosis(ticket.id, {
      problemFound,
      rootCause,
      solution,
      labourCharge: Number(labourCharge),
      partsCharge: Number(partsCharge),
      customerApproval: 'Approved',
    });
    setEditingDiagnosis(false);
  };

  const handleAddPartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPartsUsed(ticket.id, selectedPartId, Number(partQty));
  };

  // Activity logs specific to this ticket
  const ticketLogs = activityLogs.filter((l) => l.entityId === ticket.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">{ticket.id}</h2>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${statusBadge.bg}`}>
                  {statusBadge.label}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${priorityBadge.bg}`}>
                  {priorityBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Logged on {ticket.createdAt} • Source: {ticket.source}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {ticket.status === 'COMPLETED' && !invoice && currentUser.role !== 'TECHNICIAN' && (
              <button
                onClick={() => onGenerateInvoice(ticket.id)}
                className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                <Receipt className="h-4 w-4" />
                <span>Generate Invoice</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status Pipeline Step Bar */}
        <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between overflow-x-auto text-[11px]">
          <span className="font-semibold text-slate-400 mr-2 shrink-0">
            Pipeline:
          </span>
          <div className="flex items-center space-x-1">
            {['NEW', 'ASSIGNED', 'TECHNICIAN_ARRIVED', 'DIAGNOSIS', 'REPAIR_IN_PROGRESS', 'COMPLETED', 'CLOSED'].map(
              (stepStatus) => {
                const isCurrent = ticket.status === stepStatus;
                return (
                  <button
                    key={stepStatus}
                    onClick={() =>
                      updateServiceRequestStatus(ticket.id, stepStatus as ServiceStatus)
                    }
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      isCurrent
                        ? 'bg-rose-600 text-white font-bold shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {stepStatus.replace(/_/g, ' ')}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          {[
            { id: 'overview', label: 'Overview & Issue' },
            { id: 'diagnosis', label: 'Diagnosis & Charges' },
            { id: 'parts', label: `Parts Consumed (${ticket.partsUsed?.length || 0})` },
            { id: 'timeline', label: `Activity Timeline (${ticketLogs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Problem Description Card */}
              <div className="rounded-xl border border-slate-200 bg-rose-50/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {ticket.serviceType}: {ticket.problemCategory}
                  </span>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    {ticket.warrantyStatus}
                  </span>
                </div>
                <p className="text-slate-700 text-xs mt-2 leading-relaxed">
                  {ticket.problemDescription}
                </p>
                {ticket.workPerformedNotes && (
                  <div className="mt-3 pt-3 border-t border-rose-100 text-emerald-900">
                    <strong>Work Performed:</strong> {ticket.workPerformedNotes}
                  </div>
                )}
              </div>

              {/* 2-Column Info: Customer & Appliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <User className="h-4 w-4 text-slate-500" />
                      <span>Customer Details</span>
                    </span>
                    {customer && (
                      <button
                        onClick={() => onOpenCustomer(customer.id)}
                        className="text-rose-600 font-semibold hover:underline"
                      >
                        View Profile
                      </button>
                    )}
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    {customer?.firstName} {customer?.lastName}
                  </p>
                  <p className="text-slate-600 flex items-center space-x-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{customer?.mobile}</span>
                  </p>
                  <p className="text-slate-500 flex items-start space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>
                      {customer?.address}, {customer?.city}, {customer?.state} - {customer?.pincode}
                    </span>
                  </p>
                </div>

                {/* Appliance Specs */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <Tv className="h-4 w-4 text-slate-500" />
                      <span>Godrej Appliance Details</span>
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    {appliance?.category} - {appliance?.modelNumber}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    Serial Number: {appliance?.serialNumber}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <span className="text-slate-500">
                      Warranty: <strong className="text-slate-800">{appliance?.warrantyEnd}</strong>
                    </span>
                    <span className="text-slate-500">
                      AMC: <strong className="text-slate-800">{appliance?.amcStatus}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Technician Dispatch Details */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>Appointment & Technician Dispatch</span>
                  </span>
                  <span className="text-slate-500">
                    Slot: <strong>{ticket.preferredDate} ({ticket.preferredTime})</strong>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center">
                      {technician ? technician.name[0] : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {technician ? technician.name : 'No Technician Assigned'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {technician ? `Mobile: ${technician.mobile} • Rating: ★ ${technician.rating}` : 'Assign to dispatch'}
                      </p>
                    </div>
                  </div>

                  {currentUser.role !== 'TECHNICIAN' && (
                    <div className="flex items-center space-x-2">
                      <select
                        value={ticket.assignedTechnicianId || ''}
                        onChange={(e) => assignTechnician(ticket.id, e.target.value)}
                        className="rounded-lg border border-slate-300 p-2 text-xs focus:border-rose-500 focus:outline-none"
                      >
                        <option value="">-- Assign Technician --</option>
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.status})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIAGNOSIS */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Technical Findings & Diagnosis</h3>
                {!editingDiagnosis && (
                  <button
                    onClick={() => {
                      setProblemFound(ticket.diagnosis?.problemFound || '');
                      setRootCause(ticket.diagnosis?.rootCause || '');
                      setSolution(ticket.diagnosis?.solution || '');
                      setLabourCharge(ticket.diagnosis?.labourCharge || 450);
                      setPartsCharge(ticket.diagnosis?.partsCharge || 0);
                      setEditingDiagnosis(true);
                    }}
                    className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                  >
                    {ticket.diagnosis ? 'Edit Diagnosis' : 'Add Diagnosis'}
                  </button>
                )}
              </div>

              {!editingDiagnosis ? (
                ticket.diagnosis ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-medium">Defect Identified:</span>
                        <p className="font-bold text-slate-800 text-sm mt-0.5">
                          {ticket.diagnosis.problemFound}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Root Cause:</span>
                        <p className="font-medium text-slate-700 mt-0.5">
                          {ticket.diagnosis.rootCause}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Recommended Solution:</span>
                      <p className="text-slate-700 mt-0.5">{ticket.diagnosis.solution}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex items-center space-x-6">
                      <div>
                        <span className="text-slate-400">Labour Charge:</span>
                        <p className="font-bold text-slate-900">{formatINR(ticket.diagnosis.labourCharge)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Parts Charge:</span>
                        <p className="font-bold text-slate-900">{formatINR(ticket.diagnosis.partsCharge)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Customer Approval:</span>
                        <span className="inline-block ml-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {ticket.diagnosis.customerApproval}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                    No technical diagnosis recorded yet. Click &quot;Add Diagnosis&quot; to log findings.
                  </div>
                )
              ) : (
                <form onSubmit={handleSaveDiagnosis} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Problem Found *</label>
                    <input
                      type="text"
                      required
                      value={problemFound}
                      onChange={(e) => setProblemFound(e.target.value)}
                      placeholder="e.g. Fan motor capacitor burned"
                      className="w-full rounded-lg border border-slate-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Root Cause</label>
                    <input
                      type="text"
                      value={rootCause}
                      onChange={(e) => setRootCause(e.target.value)}
                      placeholder="e.g. Voltage fluctuation / wear and tear"
                      className="w-full rounded-lg border border-slate-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Recommended Solution *</label>
                    <textarea
                      rows={2}
                      required
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="e.g. Replace capacitor and clean outdoor unit"
                      className="w-full rounded-lg border border-slate-300 p-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Labour Charge (₹)</label>
                      <input
                        type="number"
                        value={labourCharge}
                        onChange={(e) => setLabourCharge(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Estimated Parts Charge (₹)</label>
                      <input
                        type="number"
                        value={partsCharge}
                        onChange={(e) => setPartsCharge(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 p-2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingDiagnosis(false)}
                      className="rounded-lg border border-slate-300 px-4 py-2 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-700"
                    >
                      Save Technical Findings
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: PARTS USED */}
          {activeTab === 'parts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Godrej Genuine Spares Used</h3>
                  <p className="text-[11px] text-slate-500">
                    Adding a spare part automatically deducts it from inventory stock.
                  </p>
                </div>
              </div>

              {/* Add Part Form */}
              <form onSubmit={handleAddPartSubmit} className="flex flex-wrap items-end gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex-1 min-w-[200px]">
                  <label className="font-semibold text-slate-700 block mb-1">Select Part</label>
                  <select
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                  >
                    {parts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock: {p.currentStock} • ₹{p.sellingPrice})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="font-semibold text-slate-700 block mb-1">Qty</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={partQty}
                    onChange={(e) => setPartQty(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800"
                >
                  Add Part
                </button>
              </form>

              {/* Parts Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3">Part Name</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(!ticket.partsUsed || ticket.partsUsed.length === 0) ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">
                          No spare parts consumed for this ticket.
                        </td>
                      </tr>
                    ) : (
                      ticket.partsUsed.map((p, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-slate-800">{p.partName}</td>
                          <td className="p-3">{p.quantity}</td>
                          <td className="p-3">{formatINR(p.unitPrice)}</td>
                          <td className="p-3 text-right font-bold text-slate-900">
                            {formatINR(p.quantity * p.unitPrice)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Activity & Audit Trail</h3>
              <div className="space-y-3">
                {ticketLogs.length === 0 ? (
                  <p className="text-slate-400 text-center py-6">No historical logs found.</p>
                ) : (
                  ticketLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-slate-100 bg-slate-50"
                    >
                      <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{log.action}</span>
                          <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{log.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">By {log.userName} ({log.userRole})</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
