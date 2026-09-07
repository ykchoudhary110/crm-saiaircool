'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { ApplianceCategory } from '@/types/crm';
import { X, Tv, CheckCircle2 } from 'lucide-react';

interface ApplianceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCustomerId?: string;
  onCreated: (applianceId: string) => void;
}

export const ApplianceFormModal: React.FC<ApplianceFormModalProps> = ({
  isOpen,
  onClose,
  preselectedCustomerId,
  onCreated,
}) => {
  const { customers, addAppliance } = useCRM();

  const [customerId, setCustomerId] = useState(
    preselectedCustomerId || customers[0]?.id || ''
  );
  const [category, setCategory] = useState<ApplianceCategory>('Air Conditioner');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [warrantyEnd, setWarrantyEnd] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [location, setLocation] = useState('Living Room / Kitchen');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelNumber || !serialNumber) {
      alert('Please provide Model Number and Serial Number');
      return;
    }

    const created = addAppliance({
      customerId,
      category,
      brand: 'Godrej',
      modelNumber,
      serialNumber,
      purchaseDate,
      warrantyStart: purchaseDate,
      warrantyEnd,
      amcStatus: 'None',
      location,
    });

    onCreated(created.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Tv className="h-5 w-5 text-rose-600" />
            <span>Register Godrej Appliance</span>
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Customer Account *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.mobile})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Appliance Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ApplianceCategory)}
                className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
              >
                <option value="Air Conditioner">Air Conditioner</option>
                <option value="Refrigerator">Refrigerator</option>
                <option value="Washing Machine">Washing Machine</option>
                <option value="Microwave Oven">Microwave Oven</option>
                <option value="Water Heater / Geyser">Water Heater / Geyser</option>
                <option value="Television">Television</option>
                <option value="Air Cooler">Air Cooler</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Location in House
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Master Bedroom"
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Model Number & Variant *
            </label>
            <input
              type="text"
              required
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              placeholder="e.g. Godrej Eon Vibe 311L Frost Free"
              className="w-full rounded-lg border border-slate-300 p-2.5"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Serial Number (Barcode) *
            </label>
            <input
              type="text"
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g. GDJ-REF-2024-8192"
              className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Purchase / Install Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Warranty Expiry Date
              </label>
              <input
                type="date"
                value={warrantyEnd}
                onChange={(e) => setWarrantyEnd(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 rounded-lg bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Register Appliance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
