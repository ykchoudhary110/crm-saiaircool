'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { Part } from '@/types/crm';
import { formatINR } from '@/lib/utils';
import {
  Package,
  Search,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  CheckCircle2,
} from 'lucide-react';

export const PartsInventory: React.FC = () => {
  const { parts, adjustStock } = useCRM();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Quick adjust modal
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [adjustQty, setAdjustQty] = useState(5);
  const [isStockIn, setIsStockIn] = useState(true);

  const filtered = parts.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      p.partNumber.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.applianceType.toLowerCase().includes(q) ||
      p.compatibleModels.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'ALL' || p.applianceType === categoryFilter;
    const matchesLowStock = !showLowStockOnly || p.currentStock <= p.minimumStock;

    return matchesQuery && matchesCategory && matchesLowStock;
  });

  const lowStockCount = parts.filter((p) => p.currentStock <= p.minimumStock).length;

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPart) return;
    const delta = isStockIn ? Number(adjustQty) : -Number(adjustQty);
    adjustStock(selectedPart.id, delta);
    setSelectedPart(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Spare Parts & Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Godrej genuine spare parts catalog, bin locations, and live stock levels.
          </p>
        </div>

        {lowStockCount > 0 && (
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
              showLowStockOnly
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>{lowStockCount} Parts Low in Stock</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search part name, code, appliance..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Appliances</option>
            <option value="Air Conditioner">Air Conditioner</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Washing Machine">Washing Machine</option>
            <option value="Microwave Oven">Microwave Oven</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Part Code</th>
                <th className="py-3.5 px-4">Part Description</th>
                <th className="py-3.5 px-4">Appliance Type</th>
                <th className="py-3.5 px-4">Location / Bin</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((part) => {
                const isLow = part.currentStock <= part.minimumStock;
                return (
                  <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {part.partNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{part.name}</p>
                      <p className="text-[11px] text-slate-400">Fits: {part.compatibleModels}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {part.applianceType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {part.location}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatINR(part.sellingPrice)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-extrabold text-sm ${
                            isLow ? 'text-rose-600' : 'text-slate-900'
                          }`}
                        >
                          {part.currentStock}
                        </span>
                        {isLow && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                            Low Stock (Min: {part.minimumStock})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPart(part)}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Stock Adjustment
              </h3>
              <button
                onClick={() => setSelectedPart(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedPart.name}</p>
                <p className="font-mono text-slate-500 mt-0.5">
                  Code: {selectedPart.partNumber} • Current: <strong>{selectedPart.currentStock} units</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsStockIn(true)}
                  className={`p-2.5 rounded-lg border font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    isStockIn
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ArrowDownLeft className="h-4 w-4" />
                  <span>Stock In (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsStockIn(false)}
                  className={`p-2.5 rounded-lg border font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    !isStockIn
                      ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Stock Out (-)</span>
                </button>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-rose-500 focus:outline-none text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPart(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
