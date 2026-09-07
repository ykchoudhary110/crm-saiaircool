'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { Invoice, Payment } from '@/types/crm';
import { formatINR } from '@/lib/utils';
import {
  Receipt,
  Search,
  Printer,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

interface InvoiceListProps {
  onViewInvoice: (invoiceId: string) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ onViewInvoice }) => {
  const { invoices, customers, recordPayment } = useCRM();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Record payment modal
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<Payment['paymentMethod']>('UPI');
  const [payRef, setPayRef] = useState('');

  const filtered = invoices.filter((inv) => {
    const cust = customers.find((c) => c.id === inv.customerId);
    const q = query.toLowerCase();
    const matchesSearch =
      !query ||
      inv.id.toLowerCase().includes(q) ||
      inv.serviceRequestId.toLowerCase().includes(q) ||
      cust?.firstName.toLowerCase().includes(q) ||
      cust?.lastName.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPayment = (inv: Invoice) => {
    setPayingInvoice(inv);
    setPayAmount(inv.balanceDue);
    setPayRef(`UPI/${Date.now().toString().slice(-8)}`);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    recordPayment(payingInvoice.id, Number(payAmount), payMethod, payRef);
    setPayingInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Invoices & Billing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Service job billing, GST receipts, labour + parts breakdown, and collection records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-rose-500 focus:outline-none"
          >
            <option value="ALL">All Invoices</option>
            <option value="Issued">Issued (Pending)</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, ticket #, customer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
          />
        </div>

        <span className="text-xs text-slate-500">
          Total Invoices: <strong>{filtered.length}</strong>
        </span>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Service Ticket</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Balance Due</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => {
                const cust = customers.find((c) => c.id === inv.customerId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">
                        {cust ? `${cust.firstName} ${cust.lastName}` : 'N/A'}
                      </p>
                      <p className="text-[11px] text-slate-400">{cust?.mobile}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                      {inv.serviceRequestId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{inv.date}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatINR(inv.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-emerald-700">
                      {formatINR(inv.amountPaid)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-700">
                      {formatINR(inv.balanceDue)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => handleOpenPayment(inv)}
                          className="rounded-lg bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Collect
                        </button>
                      )}
                      <button
                        onClick={() => onViewInvoice(inv.id)}
                        className="rounded-lg bg-slate-100 p-1.5 text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center"
                        title="View / Print Invoice"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Collect Payment for {payingInvoice.id}
              </h3>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Grand Total:</span>
                  <strong className="text-slate-900">{formatINR(payingInvoice.grandTotal)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Already Paid:</span>
                  <span className="text-emerald-700">{formatINR(payingInvoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                  <span className="text-slate-700">Remaining Balance:</span>
                  <span className="text-amber-700">{formatINR(payingInvoice.balanceDue)}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={payingInvoice.balanceDue}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Payment Mode *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash to Technician</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Bank Transfer">NEFT / Net Banking</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Transaction Reference / UTR Number
                </label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. UPI/12345678"
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
