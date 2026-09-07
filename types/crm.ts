export type Role = 'SUPER_ADMIN' | 'SERVICE_MANAGER' | 'TECHNICIAN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export type ApplianceCategory =
  | 'Air Conditioner'
  | 'Refrigerator'
  | 'Washing Machine'
  | 'Dishwasher'
  | 'Microwave Oven'
  | 'Water Heater / Geyser'
  | 'Air Cooler'
  | 'Air Purifier'
  | 'Television'
  | 'Small Appliances'
  | 'Other';

export interface Appliance {
  id: string;
  customerId: string;
  category: ApplianceCategory;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  purchaseDate: string;
  installationDate?: string;
  warrantyStart: string;
  warrantyEnd: string;
  amcStatus: 'None' | 'Active' | 'Expiring Soon' | 'Expired';
  amcStart?: string;
  amcEnd?: string;
  location?: string;
  notes?: string;
}

export type CustomerType = 'Residential' | 'Commercial' | 'Corporate';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  alternateMobile?: string;
  email: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  customerType: CustomerType;
  preferredContact: 'Phone' | 'WhatsApp' | 'Email';
  notes?: string;
  createdAt: string;
}

export type ServicePriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type ServiceStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'SCHEDULED'
  | 'ASSIGNED'
  | 'TECHNICIAN_EN_ROUTE'
  | 'TECHNICIAN_ARRIVED'
  | 'DIAGNOSIS'
  | 'WAITING_FOR_PARTS'
  | 'REPAIR_IN_PROGRESS'
  | 'COMPLETED'
  | 'INVOICED'
  | 'CLOSED'
  | 'CANCELLED';

export type ServiceType =
  | 'Installation'
  | 'General Service'
  | 'Preventive Maintenance'
  | 'Repair'
  | 'Inspection'
  | 'Breakdown Service'
  | 'Gas Charging'
  | 'Cleaning'
  | 'Demo'
  | 'Warranty Service'
  | 'AMC Service';

export interface ServiceRequest {
  id: string; // e.g. SR-2026-00101
  customerId: string;
  applianceId: string;
  serviceType: ServiceType;
  problemCategory: string;
  problemDescription: string;
  priority: ServicePriority;
  source: 'Phone' | 'Walk-in' | 'Website' | 'WhatsApp' | 'Email';
  warrantyStatus: 'In Warranty' | 'Out of Warranty';
  amcStatus: 'Active' | 'None' | 'Expired';
  preferredDate: string;
  preferredTime: string;
  address: string;
  assignedTechnicianId?: string;
  status: ServiceStatus;
  estimatedCost: number;
  finalCost?: number;
  createdAt: string;
  updatedAt: string;
  
  // Operational details
  diagnosis?: {
    problemFound: string;
    rootCause: string;
    solution: string;
    labourCharge: number;
    partsCharge: number;
    technicianNotes?: string;
    customerApproval: 'Pending' | 'Approved' | 'Rejected';
  };
  partsUsed?: {
    partId: string;
    partName: string;
    quantity: number;
    unitPrice: number;
  }[];
  workPerformedNotes?: string;
  photos?: string[];
  customerRating?: number;
  customerFeedback?: string;
}

export interface Technician {
  id: string;
  name: string;
  mobile: string;
  email: string;
  status: 'Available' | 'Busy' | 'On Leave' | 'Inactive';
  specializations: string[];
  experienceYears: number;
  rating: number;
  completedJobs: number;
  employeeId: string;
  joiningDate: string;
  activeJobId?: string;
}

export interface Appointment {
  id: string;
  serviceRequestId: string;
  customerId: string;
  applianceId: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'Confirmed' | 'Rescheduled' | 'En Route' | 'Arrived' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  applianceType: string;
  compatibleModels: string;
  vendor: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  location: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string; // e.g. INV-2026-0042
  serviceRequestId: string;
  customerId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  labourCharges: number;
  partsCharges: number;
  discount: number;
  taxRate: number; // e.g. 18 for 18% GST
  taxAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: 'Draft' | 'Issued' | 'Partially Paid' | 'Paid' | 'Cancelled';
}

export interface Payment {
  id: string;
  invoiceId: string;
  serviceRequestId: string;
  customerId: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  transactionRef?: string;
  date: string;
  collectedBy: string;
  notes?: string;
}

export interface Warranty {
  id: string;
  customerId: string;
  applianceId: string;
  serialNumber: string;
  warrantyType: 'Manufacturer Warranty' | 'Extended Warranty' | 'Service Warranty' | 'Parts Warranty';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  coverage: string;
}

export interface AMC {
  id: string;
  customerId: string;
  applianceId: string;
  planName: string;
  startDate: string;
  endDate: string;
  totalVisits: number;
  visitsUsed: number;
  amount: number;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  entity: string;
  entityId: string;
  description: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}
