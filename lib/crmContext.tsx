'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Customer,
  Appliance,
  ServiceRequest,
  Technician,
  Part,
  Invoice,
  Payment,
  Warranty,
  AMC,
  ActivityLog,
  NotificationItem,
  ServiceStatus,
} from '@/types/crm';
import {
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_APPLIANCES,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_TECHNICIANS,
  INITIAL_PARTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_WARRANTIES,
  INITIAL_AMCS,
  INITIAL_LOGS,
} from './demoData';

interface CRMContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  customers: Customer[];
  appliances: Appliance[];
  serviceRequests: ServiceRequest[];
  technicians: Technician[];
  parts: Part[];
  invoices: Invoice[];
  payments: Payment[];
  warranties: Warranty[];
  amcs: AMC[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];

  // Actions
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  addAppliance: (data: Omit<Appliance, 'id'>) => Appliance;
  createServiceRequest: (
    data: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => ServiceRequest;
  updateServiceRequestStatus: (
    id: string,
    newStatus: ServiceStatus,
    notes?: string
  ) => void;
  assignTechnician: (requestId: string, technicianId: string) => void;
  saveDiagnosis: (
    requestId: string,
    diagnosis: NonNullable<ServiceRequest['diagnosis']>
  ) => void;
  addPartsUsed: (requestId: string, partId: string, quantity: number) => void;
  completeServiceJob: (
    requestId: string,
    notes: string,
    rating?: number,
    feedback?: string
  ) => void;
  adjustStock: (partId: string, delta: number) => void;
  createInvoiceForService: (requestId: string, discount?: number) => Invoice;
  recordPayment: (
    invoiceId: string,
    amount: number,
    method: Payment['paymentMethod'],
    ref?: string
  ) => Payment;
  addNotification: (
    title: string,
    message: string,
    type: NotificationItem['type']
  ) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  resetToDemoData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentUser, setCurrentUserState] = useState<User>(INITIAL_USERS[0]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [appliances, setAppliances] = useState<Appliance[]>(INITIAL_APPLIANCES);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(
    INITIAL_SERVICE_REQUESTS
  );
  const [technicians, setTechnicians] = useState<Technician[]>(
    INITIAL_TECHNICIANS
  );
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [warranties, setWarranties] = useState<Warranty[]>(INITIAL_WARRANTIES);
  const [amcs, setAmcs] = useState<AMC[]>(INITIAL_AMCS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Service Request',
      message: 'Urgent request SR-2026-00102 submitted for Washing Machine',
      type: 'warning',
      timestamp: '10:15 AM',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Technician Arrived',
      message: 'Rahul Verma marked arrived at Rajesh Singhania residence',
      type: 'info',
      timestamp: '11:15 AM',
      read: false,
    },
  ]);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('godrej_crm_user');
      if (savedUser) setCurrentUserState(JSON.parse(savedUser));

      const savedRequests = localStorage.getItem('godrej_crm_requests');
      if (savedRequests) setServiceRequests(JSON.parse(savedRequests));

      const savedCustomers = localStorage.getItem('godrej_crm_customers');
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

      const savedAppliances = localStorage.getItem('godrej_crm_appliances');
      if (savedAppliances) setAppliances(JSON.parse(savedAppliances));

      const savedParts = localStorage.getItem('godrej_crm_parts');
      if (savedParts) setParts(JSON.parse(savedParts));

      const savedInvoices = localStorage.getItem('godrej_crm_invoices');
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedPayments = localStorage.getItem('godrej_crm_payments');
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedLogs = localStorage.getItem('godrej_crm_logs');
      if (savedLogs) setActivityLogs(JSON.parse(savedLogs));
    } catch (e) {
      console.error('Failed loading storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when modified
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('godrej_crm_user', JSON.stringify(currentUser));
      localStorage.setItem(
        'godrej_crm_requests',
        JSON.stringify(serviceRequests)
      );
      localStorage.setItem('godrej_crm_customers', JSON.stringify(customers));
      localStorage.setItem('godrej_crm_appliances', JSON.stringify(appliances));
      localStorage.setItem('godrej_crm_parts', JSON.stringify(parts));
      localStorage.setItem('godrej_crm_invoices', JSON.stringify(invoices));
      localStorage.setItem('godrej_crm_payments', JSON.stringify(payments));
      localStorage.setItem('godrej_crm_logs', JSON.stringify(activityLogs));
    } catch (e) {
      console.error('Failed writing storage', e);
    }
  }, [
    isLoaded,
    currentUser,
    serviceRequests,
    customers,
    appliances,
    parts,
    invoices,
    payments,
    activityLogs,
  ]);

  const logActivity = (
    action: string,
    entity: string,
    entityId: string,
    description: string
  ) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entity,
      entityId,
      description,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'info'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    logActivity(
      'LOGIN_SWITCH',
      'User',
      user.id,
      `Switched profile to ${user.name} (${user.role})`
    );
  };

  const switchRole = (role: Role) => {
    const targetUser =
      INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
  };

  const addCustomer = (data: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    logActivity(
      'CREATE_CUSTOMER',
      'Customer',
      newCust.id,
      `Added customer ${newCust.firstName} ${newCust.lastName}`
    );
    addNotification(
      'Customer Added',
      `${newCust.firstName} ${newCust.lastName} registered`,
      'success'
    );
    return newCust;
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? customer : c))
    );
    logActivity(
      'UPDATE_CUSTOMER',
      'Customer',
      customer.id,
      `Updated details for ${customer.firstName} ${customer.lastName}`
    );
  };

  const addAppliance = (data: Omit<Appliance, 'id'>): Appliance => {
    const newApp: Appliance = {
      ...data,
      id: `app-${Date.now().toString().slice(-4)}`,
    };
    setAppliances((prev) => [newApp, ...prev]);
    logActivity(
      'ADD_APPLIANCE',
      'Appliance',
      newApp.id,
      `Registered ${newApp.category} (${newApp.modelNumber})`
    );
    return newApp;
  };

  const createServiceRequest = (
    data: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): ServiceRequest => {
    const nextSeq = serviceRequests.length + 101;
    const reqId = `SR-2026-${String(nextSeq).padStart(5, '0')}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newReq: ServiceRequest = {
      ...data,
      id: reqId,
      status: data.assignedTechnicianId ? 'ASSIGNED' : 'NEW',
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    setServiceRequests((prev) => [newReq, ...prev]);
    logActivity(
      'CREATE_REQUEST',
      'ServiceRequest',
      reqId,
      `New request logged: ${newReq.problemCategory} - ${newReq.priority} priority`
    );
    addNotification(
      'New Request Created',
      `Ticket ${reqId} generated successfully`,
      'success'
    );
    return newReq;
  };

  const updateServiceRequestStatus = (
    id: string,
    newStatus: ServiceStatus,
    notes?: string
  ) => {
    setServiceRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const now = new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19);
          return {
            ...r,
            status: newStatus,
            updatedAt: now,
            workPerformedNotes: notes || r.workPerformedNotes,
          };
        }
        return r;
      })
    );
    logActivity(
      'STATUS_CHANGE',
      'ServiceRequest',
      id,
      `Changed status to ${newStatus}${notes ? ` (${notes})` : ''}`
    );
    addNotification('Ticket Status Updated', `${id} is now ${newStatus}`, 'info');
  };

  const assignTechnician = (requestId: string, technicianId: string) => {
    const tech = technicians.find((t) => t.id === technicianId);
    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              assignedTechnicianId: technicianId,
              status: r.status === 'NEW' ? 'ASSIGNED' : r.status,
              updatedAt: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            }
          : r
      )
    );
    logActivity(
      'ASSIGN_TECHNICIAN',
      'ServiceRequest',
      requestId,
      `Assigned to technician ${tech?.name || technicianId}`
    );
    addNotification(
      'Technician Assigned',
      `${tech?.name} assigned to job ${requestId}`,
      'info'
    );
  };

  const saveDiagnosis = (
    requestId: string,
    diagnosis: NonNullable<ServiceRequest['diagnosis']>
  ) => {
    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              diagnosis,
              estimatedCost:
                (diagnosis.labourCharge || 0) + (diagnosis.partsCharge || 0),
              status: 'DIAGNOSIS',
              updatedAt: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            }
          : r
      )
    );
    logActivity(
      'ADD_DIAGNOSIS',
      'ServiceRequest',
      requestId,
      `Recorded diagnosis: ${diagnosis.problemFound}`
    );
  };

  const addPartsUsed = (
    requestId: string,
    partId: string,
    quantity: number
  ) => {
    const targetPart = parts.find((p) => p.id === partId);
    if (!targetPart) return;

    // Deduct stock
    adjustStock(partId, -quantity);

    // Update service request partsUsed
    setServiceRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const currentParts = r.partsUsed || [];
          const existing = currentParts.find((p) => p.partId === partId);
          let updatedList;
          if (existing) {
            updatedList = currentParts.map((p) =>
              p.partId === partId
                ? { ...p, quantity: p.quantity + quantity }
                : p
            );
          } else {
            updatedList = [
              ...currentParts,
              {
                partId: targetPart.id,
                partName: targetPart.name,
                quantity,
                unitPrice: targetPart.sellingPrice,
              },
            ];
          }
          return {
            ...r,
            partsUsed: updatedList,
            status: 'REPAIR_IN_PROGRESS',
            updatedAt: new Date()
              .toISOString()
              .replace('T', ' ')
              .substring(0, 19),
          };
        }
        return r;
      })
    );

    logActivity(
      'CONSUME_PART',
      'Part',
      partId,
      `Used ${quantity}x ${targetPart.name} on ${requestId}. Stock deducted.`
    );
  };

  const adjustStock = (partId: string, delta: number) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const updatedStock = Math.max(0, p.currentStock + delta);
          if (updatedStock <= p.minimumStock) {
            addNotification(
              'Low Stock Alert',
              `${p.name} is low on stock (${updatedStock} remaining)!`,
              'warning'
            );
          }
          return { ...p, currentStock: updatedStock };
        }
        return p;
      })
    );
  };

  const completeServiceJob = (
    requestId: string,
    notes: string,
    rating?: number,
    feedback?: string
  ) => {
    const req = serviceRequests.find((r) => r.id === requestId);
    const labour = req?.diagnosis?.labourCharge || 450;
    const partsCost = (req?.partsUsed || []).reduce(
      (sum, p) => sum + p.quantity * p.unitPrice,
      0
    );
    const finalTotal = labour + partsCost;

    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'COMPLETED',
              workPerformedNotes: notes,
              customerRating: rating || 5,
              customerFeedback: feedback || 'Job finished satisfactorily',
              finalCost: finalTotal,
              updatedAt: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            }
          : r
      )
    );

    logActivity(
      'COMPLETE_JOB',
      'ServiceRequest',
      requestId,
      `Job completed. Rating: ${rating || 5} Stars`
    );
    addNotification(
      'Job Completed',
      `Ticket ${requestId} completed successfully`,
      'success'
    );
  };

  const createInvoiceForService = (
    requestId: string,
    discount: number = 0
  ): Invoice => {
    const req = serviceRequests.find((r) => r.id === requestId);
    const labour = req?.diagnosis?.labourCharge || 450;
    const items: Invoice['items'] = [
      {
        id: `item-labour-${Date.now()}`,
        description: `Service & Labour (${req?.serviceType || 'Repair'})`,
        quantity: 1,
        unitPrice: labour,
        total: labour,
      },
    ];

    let partsTotal = 0;
    if (req?.partsUsed && req.partsUsed.length > 0) {
      req.partsUsed.forEach((p, idx) => {
        const itemTotal = p.quantity * p.unitPrice;
        partsTotal += itemTotal;
        items.push({
          id: `item-part-${idx}-${Date.now()}`,
          description: p.partName,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          total: itemTotal,
        });
      });
    }

    const subtotal = labour + partsTotal - discount;
    const taxRate = 18;
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const grandTotal = subtotal + taxAmount;

    const invSeq = invoices.length + 43;
    const invId = `INV-2026-${String(invSeq).padStart(5, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newInvoice: Invoice = {
      id: invId,
      serviceRequestId: requestId,
      customerId: req?.customerId || '',
      date: today,
      dueDate: today,
      items,
      labourCharges: labour,
      partsCharges: partsTotal,
      discount,
      taxRate,
      taxAmount,
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      status: 'Issued',
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    // Mark request as INVOICED
    updateServiceRequestStatus(requestId, 'INVOICED');
    logActivity(
      'GENERATE_INVOICE',
      'Invoice',
      invId,
      `Generated invoice for ${requestId} of ₹${grandTotal}`
    );
    addNotification(
      'Invoice Generated',
      `Invoice ${invId} generated for ₹${grandTotal}`,
      'success'
    );
    return newInvoice;
  };

  const recordPayment = (
    invoiceId: string,
    amount: number,
    method: Payment['paymentMethod'],
    ref?: string
  ): Payment => {
    const inv = invoices.find((i) => i.id === invoiceId);
    const payId = `PAY-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const payment: Payment = {
      id: payId,
      invoiceId,
      serviceRequestId: inv?.serviceRequestId || '',
      customerId: inv?.customerId || '',
      amount,
      paymentMethod: method,
      transactionRef: ref || `${method.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      date: nowStr,
      collectedBy: currentUser.name,
    };

    setPayments((prev) => [payment, ...prev]);

    // Update invoice paid & balance
    setInvoices((prev) =>
      prev.map((i) => {
        if (i.id === invoiceId) {
          const newPaid = i.amountPaid + amount;
          const newBalance = Math.max(0, i.grandTotal - newPaid);
          const newStatus =
            newBalance === 0
              ? 'Paid'
              : newPaid > 0
              ? 'Partially Paid'
              : i.status;
          return {
            ...i,
            amountPaid: newPaid,
            balanceDue: newBalance,
            status: newStatus,
          };
        }
        return i;
      })
    );

    logActivity(
      'RECORD_PAYMENT',
      'Payment',
      payId,
      `Recorded payment of ₹${amount} via ${method} for ${invoiceId}`
    );
    addNotification(
      'Payment Received',
      `Received ₹${amount} via ${method}`,
      'success'
    );

    return payment;
  };

  const resetToDemoData = () => {
    setCurrentUserState(INITIAL_USERS[0]);
    setCustomers(INITIAL_CUSTOMERS);
    setAppliances(INITIAL_APPLIANCES);
    setServiceRequests(INITIAL_SERVICE_REQUESTS);
    setTechnicians(INITIAL_TECHNICIANS);
    setParts(INITIAL_PARTS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setWarranties(INITIAL_WARRANTIES);
    setAmcs(INITIAL_AMCS);
    setActivityLogs(INITIAL_LOGS);
    localStorage.clear();
    addNotification(
      'System Reset',
      'Reset all data to default demo state',
      'info'
    );
  };

  return (
    <CRMContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        customers,
        appliances,
        serviceRequests,
        technicians,
        parts,
        invoices,
        payments,
        warranties,
        amcs,
        activityLogs,
        notifications,
        addCustomer,
        updateCustomer,
        addAppliance,
        createServiceRequest,
        updateServiceRequestStatus,
        assignTechnician,
        saveDiagnosis,
        addPartsUsed,
        completeServiceJob,
        adjustStock,
        createInvoiceForService,
        recordPayment,
        addNotification,
        markNotificationRead,
        clearNotifications,
        resetToDemoData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}
