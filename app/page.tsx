'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { TechnicianDashboard } from '@/components/dashboard/TechnicianDashboard';
import { ServiceRequestList } from '@/components/service-requests/ServiceRequestList';
import { NewServiceRequestWizard } from '@/components/service-requests/NewServiceRequestWizard';
import { ServiceRequestDetailModal } from '@/components/service-requests/ServiceRequestDetailModal';
import { CustomerList } from '@/components/customers/CustomerList';
import { CustomerDetailModal } from '@/components/customers/CustomerDetailModal';
import { CustomerFormModal } from '@/components/customers/CustomerFormModal';
import { ApplianceList } from '@/components/appliances/ApplianceList';
import { ApplianceFormModal } from '@/components/appliances/ApplianceFormModal';
import { TechnicianList } from '@/components/technicians/TechnicianList';
import { PartsInventory } from '@/components/parts/PartsInventory';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { InvoicePrintModal } from '@/components/invoices/InvoicePrintModal';
import { WarrantyAndAmc } from '@/components/warranty/WarrantyAndAmc';
import { ReportsView } from '@/components/reports/ReportsView';
import { SettingsView } from '@/components/settings/SettingsView';
import { ActivityLogsView } from '@/components/audit/ActivityLogsView';
import { AppointmentsView } from '@/components/appointments/AppointmentsView';
import { GlobalSearchModal } from '@/components/modals/GlobalSearchModal';

export default function HomePage() {
  const { currentUser, createInvoiceForService } = useCRM();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Modals state
  const [newRequestWizardOpen, setNewRequestWizardOpen] = useState(false);
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | undefined>();
  const [preselectedApplianceId, setPreselectedApplianceId] = useState<string | undefined>();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newApplianceModalOpen, setNewApplianceModalOpen] = useState(false);
  const [applianceCustId, setApplianceCustId] = useState<string | undefined>();

  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);

  // Quick Action Handlers
  const handleOpenNewRequest = (custId?: string, appId?: string) => {
    setPreselectedCustomerId(custId);
    setPreselectedApplianceId(appId);
    setNewRequestWizardOpen(true);
  };

  const handleGenerateInvoice = (ticketId: string) => {
    const inv = createInvoiceForService(ticketId);
    setSelectedTicketId(null);
    setViewingInvoiceId(inv.id);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' &&
            (currentUser.role === 'TECHNICIAN' ? (
              <TechnicianDashboard
                onOpenJobDetail={(ticketId) => setSelectedTicketId(ticketId)}
              />
            ) : (
              <AdminDashboard
                onNewRequest={() => handleOpenNewRequest()}
                onSelectTicket={(ticketId) => setSelectedTicketId(ticketId)}
                onSelectCustomer={(customerId) => setSelectedCustomerId(customerId)}
              />
            ))}

          {activeTab === 'service-requests' && (
            <ServiceRequestList
              onNewRequest={() => handleOpenNewRequest()}
              onSelectTicket={(ticketId) => setSelectedTicketId(ticketId)}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerList
              onSelectCustomer={(customerId) => setSelectedCustomerId(customerId)}
              onNewCustomer={() => setNewCustomerModalOpen(true)}
              onNewRequestForCustomer={(customerId) => handleOpenNewRequest(customerId)}
            />
          )}

          {activeTab === 'appliances' && (
            <ApplianceList
              onNewAppliance={() => setNewApplianceModalOpen(true)}
              onBookService={(customerId, applianceId) =>
                handleOpenNewRequest(customerId, applianceId)
              }
              onSelectCustomer={(customerId) => setSelectedCustomerId(customerId)}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              onSelectTicket={(ticketId) => setSelectedTicketId(ticketId)}
            />
          )}

          {activeTab === 'technicians' && (
            <TechnicianList
              onSelectTicket={(ticketId) => setSelectedTicketId(ticketId)}
            />
          )}

          {activeTab === 'parts' && <PartsInventory />}

          {activeTab === 'invoices' && (
            <InvoiceList
              onViewInvoice={(invoiceId) => setViewingInvoiceId(invoiceId)}
            />
          )}

          {activeTab === 'warranty-amc' && <WarrantyAndAmc />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'activity-logs' && <ActivityLogsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* GLOBAL MODALS */}
      {/* 1. Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectTicket={(id) => setSelectedTicketId(id)}
        onSelectCustomer={(id) => setSelectedCustomerId(id)}
      />

      {/* 2. New Service Request Wizard */}
      <NewServiceRequestWizard
        isOpen={newRequestWizardOpen}
        onClose={() => setNewRequestWizardOpen(false)}
        preselectedCustomerId={preselectedCustomerId}
        preselectedApplianceId={preselectedApplianceId}
        onCreated={(newReqId) => setSelectedTicketId(newReqId)}
      />

      {/* 3. Service Request Detail Modal */}
      <ServiceRequestDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onOpenCustomer={(custId) => {
          setSelectedTicketId(null);
          setSelectedCustomerId(custId);
        }}
        onGenerateInvoice={(reqId) => handleGenerateInvoice(reqId)}
      />

      {/* 4. Customer 360 Detail Modal */}
      <CustomerDetailModal
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onNewRequestForCustomer={(custId, appId) => handleOpenNewRequest(custId, appId)}
        onSelectTicket={(ticketId) => setSelectedTicketId(ticketId)}
        onAddAppliance={(custId) => {
          setApplianceCustId(custId);
          setNewApplianceModalOpen(true);
        }}
      />

      {/* 5. Create Customer Modal */}
      <CustomerFormModal
        isOpen={newCustomerModalOpen}
        onClose={() => setNewCustomerModalOpen(false)}
        onCreated={(newCustId) => setSelectedCustomerId(newCustId)}
      />

      {/* 6. Register Appliance Modal */}
      <ApplianceFormModal
        isOpen={newApplianceModalOpen}
        onClose={() => setNewApplianceModalOpen(false)}
        preselectedCustomerId={applianceCustId}
        onCreated={() => {
          setActiveTab('appliances');
        }}
      />

      {/* 7. Print Invoice Modal */}
      <InvoicePrintModal
        invoiceId={viewingInvoiceId}
        onClose={() => setViewingInvoiceId(null)}
        onRecordPayment={() => {
          // Open billing view
          setActiveTab('invoices');
          setViewingInvoiceId(null);
        }}
      />
    </div>
  );
}
