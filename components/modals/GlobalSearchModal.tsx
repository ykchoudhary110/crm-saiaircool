'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/lib/crmContext';
import {
  Search,
  X,
  User,
  Wrench,
  Package,
  Receipt,
  Tv,
  ArrowRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket: (ticketId: string) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTicket,
  onSelectCustomer,
}) => {
  const { customers, serviceRequests, appliances, parts, invoices } = useCRM();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedCustomers = q
    ? customers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.mobile.includes(q) ||
          c.city.toLowerCase().includes(q)
      )
    : [];

  const matchedTickets = q
    ? serviceRequests.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.problemCategory.toLowerCase().includes(q) ||
          t.problemDescription.toLowerCase().includes(q)
      )
    : [];

  const matchedAppliances = q
    ? appliances.filter(
        (a) =>
          a.serialNumber.toLowerCase().includes(q) ||
          a.modelNumber.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    : [];

  const matchedParts = q
    ? parts.filter(
        (p) =>
          p.partNumber.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchedCustomers.length > 0 ||
    matchedTickets.length > 0 ||
    matchedAppliances.length > 0 ||
    matchedParts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 backdrop-blur-sm sm:pt-24 animate-in fade-in duration-100">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-slate-100 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search service requests, customers, appliances, parts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500 hover:bg-slate-200"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type at least one character to search across all CRM records.
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records found for &quot;{query}&quot;.
            </div>
          ) : (
            <>
              {/* Service Requests */}
              {matchedTickets.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center">
                    <Wrench className="h-3 w-3 mr-1" /> Service Tickets ({matchedTickets.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedTickets.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onSelectTicket(t.id);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-rose-50 cursor-pointer group transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-xs text-slate-900 group-hover:text-rose-700">
                              {t.id}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                              {t.status}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-rose-100 text-rose-700">
                              {t.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {t.problemCategory}: {t.problemDescription}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {matchedCustomers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center">
                    <User className="h-3 w-3 mr-1" /> Customers ({matchedCustomers.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectCustomer(c.id);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-xs text-slate-900">
                            {c.firstName} {c.lastName}{' '}
                            <span className="text-[11px] font-normal text-slate-500">
                              ({c.customerType})
                            </span>
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {c.mobile} • {c.city}, {c.state}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appliances */}
              {matchedAppliances.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center">
                    <Tv className="h-3 w-3 mr-1" /> Appliances ({matchedAppliances.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedAppliances.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70"
                      >
                        <div>
                          <p className="font-semibold text-xs text-slate-900">
                            {a.category} - {a.modelNumber}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 font-mono">
                            SN: {a.serialNumber} | Warranty: {a.warrantyEnd}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parts */}
              {matchedParts.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center">
                    <Package className="h-3 w-3 mr-1" /> Spare Parts ({matchedParts.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedParts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70"
                      >
                        <div>
                          <p className="font-semibold text-xs text-slate-900">
                            {p.name} ({p.partNumber})
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Stock: {p.currentStock} units • Price: ₹{p.sellingPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
