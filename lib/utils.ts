import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ServicePriority, ServiceStatus } from '@/types/crm';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getStatusBadge(status: ServiceStatus) {
  switch (status) {
    case 'NEW':
      return { label: 'New', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'SCHEDULED':
      return { label: 'Scheduled', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'ASSIGNED':
      return { label: 'Assigned', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'TECHNICIAN_EN_ROUTE':
      return { label: 'En Route', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'TECHNICIAN_ARRIVED':
      return { label: 'Arrived', bg: 'bg-teal-100 text-teal-800 border-teal-200' };
    case 'DIAGNOSIS':
      return { label: 'Diagnosis', bg: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'WAITING_FOR_PARTS':
      return { label: 'Waiting Parts', bg: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'REPAIR_IN_PROGRESS':
      return { label: 'In Progress', bg: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
    case 'COMPLETED':
      return { label: 'Completed', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'INVOICED':
      return { label: 'Invoiced', bg: 'bg-violet-100 text-violet-800 border-violet-200' };
    case 'CLOSED':
      return { label: 'Closed', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    case 'CANCELLED':
      return { label: 'Cancelled', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
    default:
      return { label: status, bg: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
}

export function getPriorityBadge(priority: ServicePriority) {
  switch (priority) {
    case 'Urgent':
      return { label: 'Urgent', bg: 'bg-rose-100 text-rose-700 border-rose-300' };
    case 'High':
      return { label: 'High', bg: 'bg-amber-100 text-amber-700 border-amber-300' };
    case 'Normal':
      return { label: 'Normal', bg: 'bg-blue-100 text-blue-700 border-blue-200' };
    case 'Low':
      return { label: 'Low', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
}
