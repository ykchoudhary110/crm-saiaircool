'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import {
  ApplianceCategory,
  ServicePriority,
  ServiceType,
} from '@/types/crm';
import {
  X,
  User,
  Tv,
  Wrench,
  Calendar,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
} from 'lucide-react';

interface NewServiceRequestWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCustomerId?: string;
  preselectedApplianceId?: string;
  onCreated: (newRequestId: string) => void;
}

export const NewServiceRequestWizard: React.FC<NewServiceRequestWizardProps> = ({
  isOpen,
  onClose,
  preselectedCustomerId,
  preselectedApplianceId,
  onCreated,
}) => {
  const {
    customers,
    appliances,
    technicians,
    addCustomer,
    addAppliance,
    createServiceRequest,
  } = useCRM();

  const [step, setStep] = useState(1);

  // Customer selection / creation
  const [selectedCustId, setSelectedCustId] = useState<string>(
    preselectedCustomerId || customers[0]?.id || ''
  );
  const [isCreatingNewCust, setIsCreatingNewCust] = useState(false);
  const [newCustFirst, setNewCustFirst] = useState('');
  const [newCustLast, setNewCustLast] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustCity, setNewCustCity] = useState('Mumbai');

  // Appliance selection / creation
  const customerAppliances = appliances.filter(
    (a) => a.customerId === selectedCustId
  );
  const [selectedAppId, setSelectedAppId] = useState<string>(
    preselectedApplianceId || customerAppliances[0]?.id || ''
  );
  const [isCreatingNewApp, setIsCreatingNewApp] = useState(false);
  const [newAppCategory, setNewAppCategory] = useState<ApplianceCategory>(
    'Air Conditioner'
  );
  const [newAppModel, setNewAppModel] = useState('');
  const [newAppSerial, setNewAppSerial] = useState('');

  // Service ticket details
  const [serviceType, setServiceType] = useState<ServiceType>('Repair');
  const [problemCategory, setProblemCategory] = useState('Cooling Issue');
  const [problemDescription, setProblemDescription] = useState('');
  const [priority, setPriority] = useState<ServicePriority>('Normal');
  const [source, setSource] = useState<'Phone' | 'Walk-in' | 'Website' | 'WhatsApp' | 'Email'>('Phone');
  const [preferredDate, setPreferredDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('11:00 AM - 01:00 PM');
  const [assignedTechId, setAssignedTechId] = useState<string>('tech-1');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (isCreatingNewCust) {
        if (!newCustFirst || !newCustMobile || !newCustAddress) {
          alert('Please fill in required customer details (Name, Mobile, Address)');
          return;
        }
        const created = addCustomer({
          firstName: newCustFirst,
          lastName: newCustLast,
          mobile: newCustMobile,
          email: newCustEmail || `${newCustFirst.toLowerCase()}@client.demo`,
          address: newCustAddress,
          city: newCustCity,
          state: 'Maharashtra',
          pincode: '400001',
          customerType: 'Residential',
          preferredContact: 'Phone',
        });
        setSelectedCustId(created.id);
        setIsCreatingNewCust(false);
      }
      setStep(2);
    } else if (step === 2) {
      if (isCreatingNewApp) {
        if (!newAppModel || !newAppSerial) {
          alert('Please provide model and serial number for appliance');
          return;
        }
        const createdApp = addAppliance({
          customerId: selectedCustId,
          category: newAppCategory,
          brand: 'Godrej',
          modelNumber: newAppModel,
          serialNumber: newAppSerial,
          purchaseDate: new Date().toISOString().split('T')[0],
          warrantyStart: new Date().toISOString().split('T')[0],
          warrantyEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          amcStatus: 'None',
        });
        setSelectedAppId(createdApp.id);
        setIsCreatingNewApp(false);
      }
      setStep(3);
    } else if (step === 3) {
      if (!problemDescription) {
        alert('Please enter a brief description of the issue');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = () => {
    const cust = customers.find((c) => c.id === selectedCustId);
    const app = appliances.find((a) => a.id === selectedAppId);

    const isWarrantyActive = app && new Date(app.warrantyEnd) > new Date();
    const isAmcActive = app?.amcStatus === 'Active';

    const createdReq = createServiceRequest({
      customerId: selectedCustId,
      applianceId: selectedAppId,
      serviceType,
      problemCategory,
      problemDescription,
      priority,
      source,
      warrantyStatus: isWarrantyActive ? 'In Warranty' : 'Out of Warranty',
      amcStatus: isAmcActive ? 'Active' : 'None',
      preferredDate,
      preferredTime,
      address: cust?.address || 'Customer site',
      assignedTechnicianId: assignedTechId,
      estimatedCost: 650,
    });

    onCreated(createdReq.id);
    onClose();
  };

  const activeCustomer = customers.find((c) => c.id === selectedCustId);
  const activeAppliance = appliances.find((a) => a.id === selectedAppId);
  const activeTech = technicians.find((t) => t.id === assignedTechId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              New Service Request Wizard
            </h2>
            <p className="text-xs text-slate-500">
              Step {step} of 4: {step === 1 && 'Select or Add Customer'}
              {step === 2 && 'Select or Register Appliance'}
              {step === 3 && 'Service Details & Issue'}
              {step === 4 && 'Technician Dispatch & Review'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Stepper indicator */}
        <div className="flex border-b border-slate-100 bg-white px-6 py-2.5">
          {[
            { num: 1, label: 'Customer' },
            { num: 2, label: 'Appliance' },
            { num: 3, label: 'Problem' },
            { num: 4, label: 'Dispatch' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex-1 flex items-center space-x-2 text-xs font-semibold ${
                step === s.num
                  ? 'text-rose-600'
                  : step > s.num
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                  step === s.num
                    ? 'bg-rose-600 text-white'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          {/* STEP 1: Customer */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">
                  Select Registered Customer
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCust(!isCreatingNewCust)}
                  className="text-rose-600 font-semibold flex items-center space-x-1 hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isCreatingNewCust ? 'Choose Existing' : 'New Customer'}</span>
                </button>
              </div>

              {!isCreatingNewCust ? (
                <div className="space-y-2">
                  <select
                    value={selectedCustId}
                    onChange={(e) => {
                      setSelectedCustId(e.target.value);
                      const matched = appliances.filter(
                        (a) => a.customerId === e.target.value
                      );
                      if (matched[0]) setSelectedAppId(matched[0].id);
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.mobile}) - {c.city}
                      </option>
                    ))}
                  </select>

                  {activeCustomer && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mt-3">
                      <p className="font-bold text-slate-900">
                        {activeCustomer.firstName} {activeCustomer.lastName}{' '}
                        <span className="font-normal text-slate-500">
                          ({activeCustomer.customerType})
                        </span>
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        📞 {activeCustomer.mobile} • ✉️ {activeCustomer.email}
                      </p>
                      <p className="text-slate-500 mt-1">
                        📍 {activeCustomer.address}, {activeCustomer.city}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCustFirst}
                        onChange={(e) => setNewCustFirst(e.target.value)}
                        placeholder="e.g. Ramesh"
                        className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={newCustLast}
                        onChange={(e) => setNewCustLast(e.target.value)}
                        placeholder="e.g. Gupta"
                        className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCustMobile}
                        onChange={(e) => setNewCustMobile(e.target.value)}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={newCustEmail}
                        onChange={(e) => setNewCustEmail(e.target.value)}
                        placeholder="ramesh@gmail.com"
                        className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Service Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCustAddress}
                      onChange={(e) => setNewCustAddress(e.target.value)}
                      placeholder="Flat, building, street..."
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={newCustCity}
                      onChange={(e) => setNewCustCity(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Appliance */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">
                  Select Customer Godrej Appliance
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewApp(!isCreatingNewApp)}
                  className="text-rose-600 font-semibold flex items-center space-x-1 hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isCreatingNewApp ? 'Pick Existing' : 'Add Appliance'}</span>
                </button>
              </div>

              {!isCreatingNewApp ? (
                <div className="space-y-2">
                  {customerAppliances.length === 0 ? (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                      <p className="text-slate-600 font-semibold">
                        No appliances registered for this customer yet.
                      </p>
                      <button
                        onClick={() => setIsCreatingNewApp(true)}
                        className="mt-2 text-rose-600 font-bold hover:underline"
                      >
                        Register Appliance Now
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {customerAppliances.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedAppId === app.id
                              ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              {app.category}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              Warranty: {app.warrantyEnd}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">{app.modelNumber}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            SN: {app.serialNumber}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Appliance Category *
                    </label>
                    <select
                      value={newAppCategory}
                      onChange={(e) =>
                        setNewAppCategory(e.target.value as ApplianceCategory)
                      }
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white"
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
                      Model Number / Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Godrej 1.5T 5-Star Inverter AC"
                      value={newAppModel}
                      onChange={(e) => setNewAppModel(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GDJ-AC-2024-9102"
                      value={newAppSerial}
                      onChange={(e) => setNewAppSerial(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Issue Details */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Service Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="Repair">Repair</option>
                    <option value="Breakdown Service">Breakdown Service</option>
                    <option value="Preventive Maintenance">Preventive Maintenance</option>
                    <option value="Installation">Installation</option>
                    <option value="General Service">General Service</option>
                    <option value="Gas Charging">Gas Charging</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Issue Category
                  </label>
                  <select
                    value={problemCategory}
                    onChange={(e) => setProblemCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="Cooling Issue">Cooling Issue</option>
                    <option value="Noise / Vibration">Noise / Vibration</option>
                    <option value="Power / Tripping">Power / Tripping</option>
                    <option value="Water Leakage">Water Leakage</option>
                    <option value="Drainage Issue">Drainage Issue</option>
                    <option value="Display Error Code">Display Error Code</option>
                    <option value="Compressor Failure">Compressor Failure</option>
                    <option value="Gas Charging">Gas Charging</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ServicePriority)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Breakdown)</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Request Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="Phone">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Customer Problem Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the defect, symptom or customer remarks..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Technician & Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Assign Field Technician
                </label>
                <select
                  value={assignedTechId}
                  onChange={(e) => setAssignedTechId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.status}) • Rating: ★ {t.rating} • Specialization: {t.specializations[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Summary Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  Service Ticket Summary
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <p>
                    <strong>Customer:</strong> {activeCustomer?.firstName} {activeCustomer?.lastName}
                  </p>
                  <p>
                    <strong>Appliance:</strong> {activeAppliance?.category}
                  </p>
                  <p>
                    <strong>Issue:</strong> {problemCategory}
                  </p>
                  <p>
                    <strong>Priority:</strong> {priority}
                  </p>
                  <p>
                    <strong>Date:</strong> {preferredDate}
                  </p>
                  <p>
                    <strong>Assigned To:</strong> {activeTech?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1 rounded-lg bg-rose-600 px-5 py-2 font-bold text-white shadow-sm hover:bg-rose-700"
            >
              <span>Continue</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 rounded-lg bg-emerald-600 px-6 py-2 font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Generate Ticket</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
