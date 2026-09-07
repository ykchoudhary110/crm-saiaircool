'use client';

import React from 'react';
import { useCRM } from '@/lib/crmContext';
import { formatINR, formatDate } from '@/lib/utils';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

interface InvoicePrintModalProps {
  invoiceId: string | null;
  onClose: () => void;
  onRecordPayment: (invoiceId: string) => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoiceId,
  onClose,
  onRecordPayment,
}) => {
  const { invoices, customers, serviceRequests, appliances } = useCRM();

  if (!invoiceId) return null;

  const invoice = invoices.find((i) => i.id === invoiceId);
  if (!invoice) return null;

  const customer = customers.find((c) => c.id === invoice.customerId);
  const ticket = serviceRequests.find((t) => t.id === invoice.serviceRequestId);
  const appliance = appliances.find((a) => a.id === ticket?.applianceId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Action Bar (hidden on print) */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-slate-50 no-print">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-slate-900">{invoice.id}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                invoice.status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {invoice.balanceDue > 0 && (
              <button
                onClick={() => onRecordPayment(invoice.id)}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Record Payment
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div id="printable-invoice" className="flex-1 overflow-y-auto p-8 text-xs bg-white text-slate-800">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-rose-600 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-rose-600 text-white font-bold text-lg flex items-center justify-center">
                  G
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">
                    GODREJ APPLIANCE SERVICE CENTRE
                  </h1>
                  <p className="text-[11px] font-semibold text-rose-600">
                    Authorized Customer Support & Repair Hub
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Service Hub: Plot 42, Marol Industrial Area, Andheri (E), Mumbai 400093
              </p>
              <p className="text-[11px] text-slate-500">
                GSTIN: <strong>27AAACG1982K1Z9</strong> • Toll Free: 1800-209-5511
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-slate-100 font-bold text-sm text-slate-800 uppercase tracking-widest">
                TAX INVOICE
              </span>
              <p className="text-sm font-extrabold text-slate-900 mt-2 font-mono">
                {invoice.id}
              </p>
              <p className="text-slate-500 mt-0.5">Date: {invoice.date}</p>
              <p className="text-slate-500">Ticket Ref: {invoice.serviceRequestId}</p>
            </div>
          </div>

          {/* Customer & Appliance Details */}
          <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                Billed To:
              </h3>
              <p className="font-bold text-slate-900 text-sm">
                {customer?.firstName} {customer?.lastName}
              </p>
              <p className="text-slate-600 mt-0.5">{customer?.address}</p>
              <p className="text-slate-600">
                {customer?.city}, {customer?.state} - {customer?.pincode}
              </p>
              <p className="text-slate-600 font-medium mt-1">Mobile: {customer?.mobile}</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                Appliance Serviced:
              </h3>
              <p className="font-bold text-slate-900 text-sm">
                {appliance?.category} - {appliance?.modelNumber}
              </p>
              <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                Serial No: {appliance?.serialNumber}
              </p>
              <p className="text-slate-600 mt-1">
                Issue: {ticket?.problemCategory} ({ticket?.serviceType})
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-300 text-[11px] font-bold uppercase text-slate-600">
                  <th className="py-2.5">#</th>
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Rate</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="py-2.5">
                    <td className="py-2.5 text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 font-semibold text-slate-800">{item.description}</td>
                    <td className="py-2.5 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-2.5 text-right text-slate-600">{formatINR(item.unitPrice)}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{formatINR(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Summary */}
          <div className="border-t border-slate-200 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Labour Subtotal:</span>
                <span>{formatINR(invoice.labourCharges)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Spare Parts:</span>
                <span>{formatINR(invoice.partsCharges)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatINR(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%):</span>
                <span>{formatINR(invoice.taxAmount / 2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9%):</span>
                <span>{formatINR(invoice.taxAmount / 2)}</span>
              </div>
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Payable:</span>
                <span className="text-rose-600">{formatINR(invoice.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold pt-1">
                <span>Amount Paid:</span>
                <span>{formatINR(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between text-amber-700 font-bold">
                <span>Balance Due:</span>
                <span>{formatINR(invoice.balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
            <p>
              1. 90-day service warranty applies to parts replaced under this invoice.
            </p>
            <p>
              2. Genuine Godrej components used as per company quality standards.
            </p>
            <p>
              3. Computer-generated invoice. No physical signature required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
