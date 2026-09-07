import type { Metadata } from 'next';
import './globals.css';
import { CRMProvider } from '@/lib/crmContext';

export const metadata: Metadata = {
  title: 'Sai Air Cool | Official Godrej Service Centre CRM',
  description:
    'Sai Air Cool - Official Godrej Service Centre. Complete enterprise lifecycle CRM for Godrej appliances.',
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
