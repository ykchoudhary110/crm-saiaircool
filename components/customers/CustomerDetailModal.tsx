'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { formatINR, formatDate, getStatusBadge } from '@/lib/utils';
import {
  X,
  User,
  Tv,
  Wrench,
  Receipt,
  Phone,
  Mail,
  MapPin,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CustomerDetailModalProps {
  customerId: string | null;
  onClose: () => void;
  onNewRequestForCustomer: (customerId: string, applianceId?: string) => void;
  onSelectTicket: (ticketId: string) => void;
  onAddAppliance: (customerId: string) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customerId,
  onClose,
  onNewRequestForCustomer,
  onSelectTicket,
  onAddAppliance,
}) => {
  const { customers, appliances, serviceRequests, invoices } = useCRM();

  const [activeTab, setActiveTab] = useState<'appliances' | 'requests' | 'invoices'>('appliances');

  if (!customerId) return null;

  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return null;

  const customerAppliances = appliances.filter((a) => a.customerId === customer.id);
  const customerRequests = serviceRequests.filter((r) => r.customerId === customer.id);
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-base">
              {customer.firstName[0]}
              {customer.lastName[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  {customer.firstName} {customer.lastName}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {customer.customerType}
                </span>
              </div>
              <p className="text-xs text-slate-500">Customer ID: {customer.id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onNewRequestForCustomer(customer.id);
                onClose();
              }}
              className="flex items-center space-x-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Raise Service Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Customer Information Cards */}
        <div className="p-6 border-b border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              Contact Info
            </span>
            <p className="font-semibold text-slate-800 flex items-center space-x-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{customer.mobile}</span>
            </p>
            <p className="text-slate-600 flex items-center space-x-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>{customer.email}</span>
            </p>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              Registered Address
            </span>
            <p className="text-slate-700 flex items-start space-x-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>
                {customer.address}
                {customer.addressLine2 ? `, ${customer.addressLine2}` : ''}, {customer.city},{' '}
                {customer.state} - {customer.pincode}
                {customer.landmark ? ` (Landmark: ${customer.landmark})` : ''}
              </span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          {[
            { id: 'appliances', label: `Registered Appliances (${customerAppliances.length})` },
            { id: 'requests', label: `Service Tickets (${customerRequests.length})` },
            { id: 'invoices', label: `Invoices & Billing (${customerInvoices.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-rose-600 text-rose-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-4">
          {/* TAB 1: APPLIANCES */}
          {activeTab === 'appliances' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Godrej Appliances under this account
                </span>
                <button
                  onClick={() => onAddAppliance(customer.id)}
                  className="flex items-center space-x-1 text-rose-600 font-bold hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Register Another Appliance</span>
                </button>
              </div>

              {customerAppliances.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No appliances registered yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customerAppliances.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-xl border border-slate-200 p-4 bg-white shadow-sm space-y-2 hover:border-rose-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {app.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          AMC: {app.amcStatus}
                        </span>
                      </div>
                      <p className="font-medium text-slate-700">{app.modelNumber}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Serial: {app.serialNumber}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          Warranty End: <strong className="text-slate-800">{app.warrantyEnd}</strong>
                        </span>
                        <button
                          onClick={() => {
                            onNewRequestForCustomer(customer.id, app.id);
                            onClose();
                          }}
                          className="font-bold text-rose-600 hover:underline"
                        >
                          Book Service →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SERVICE REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {customerRequests.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No service history found.</p>
              ) : (
                customerRequests.map((req) => {
                  const statusBadge = getStatusBadge(req.status);
                  return (
                    <div
                      key={req.id}
                      onClick={() => {
                        onSelectTicket(req.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{req.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge.bg}`}>
                            {statusBadge.label}
                          </span>
                          <span className="text-slate-500">• {req.serviceType}</span>
                        </div>
                        <p className="text-slate-700 font-medium mt-1">
                          {req.problemCategory}: {req.problemDescription}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Preferred: {req.preferredDate} ({req.preferredTime})
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-3">
              {customerInvoices.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No invoices issued yet.</p>
              ) : (
                customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{inv.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Date: {inv.date} • Ticket: {inv.serviceRequestId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-sm">{formatINR(inv.grandTotal)}</p>
                      <p className="text-[11px] text-slate-400">
                        Paid: {formatINR(inv.amountPaid)} | Due: {formatINR(inv.balanceDue)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
