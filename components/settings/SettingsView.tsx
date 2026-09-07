'use client';

import React, { useState } from 'react';
import { Settings, Building, Clock, Wrench, ShieldCheck, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [centreName, setCentreName] = useState('Sai Air Cool - Official Godrej Service Centre');
  const [gstin, setGstin] = useState('27AAACG1982K1Z9');
  const [phone, setPhone] = useState('1800-209-5511');
  const [address, setAddress] = useState('Plot 42, Marol Industrial Area, Andheri (E), Mumbai 400093');
  const [openTime, setOpenTime] = useState('09:00 AM');
  const [closeTime, setCloseTime] = useState('07:00 PM');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          System & Service Centre Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure service hub profile, GST details, operating hours, and standard repair charges.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Company Profile */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Building className="h-4 w-4 text-rose-600" />
            <span>Service Centre Identification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Authorised Centre Name
              </label>
              <input
                type="text"
                value={centreName}
                onChange={(e) => setCentreName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                GSTIN Registration Number
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Official Helpline / Mobile
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Operating Hub Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>Operating Hours & Shifts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Opening Time
              </label>
              <input
                type="text"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Closing Time
              </label>
              <input
                type="text"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="flex items-center space-x-1.5 rounded-lg bg-rose-600 px-6 py-2.5 font-bold text-white shadow-sm hover:bg-rose-700 transition-colors"
          >
            {saved && <Check className="h-4 w-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
