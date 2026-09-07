import type { Metadata } from 'next';
import './globals.css';
import { CRMProvider } from '@/lib/crmContext';

export const metadata: Metadata = {
  title: 'Godrej Service Centre CRM | Appliance Care Operations',
  description:
    'Complete enterprise lifecycle CRM for Godrej appliances: Customers, Service Requests, Appointments, Diagnosis, Parts Inventory, Invoices, and Warranty Management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-rose-500 selection:text-white">
        <CRMProvider>{children}</CRMProvider>
      </body>
    </html>
  );
}
