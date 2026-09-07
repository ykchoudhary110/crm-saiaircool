# Godrej Appliance Service Centre CRM

A modern, responsive, production-ready web application for an authorized appliance service centre handling Godrej appliances across all major categories (Air Conditioners, Refrigerators, Washing Machines, Microwave Ovens, Geysers, etc.).

Designed for fast, zero-configuration local development and immediate Vercel deployment with full interactive client-side persistence (simulating the complete service lifecycle end-to-end without external database setup).

---

## 🌟 Key Features

1. **Complete Lifecycle Management**:
   - Customer 360 profile → Appliance registration → Service Request Ticket → Scheduled Appointment → Field Technician Assignment → Travel & Arrival → Technical Diagnosis → Spare Part Consumption (Auto Stock Deduction) → Service Completion → Tax Invoice Generation (GST 18%) → Payment Collection (UPI / Cash / Card) → Feedback & Rating → Warranty & AMC tracking.

2. **Role-Based Workspaces & Quick Demo Switcher**:
   - **Super Admin (Vikram Malhotra)**: Full visibility into operations, financial reports, inventory, settings, and audit logs.
   - **Service Manager (Priya Sharma)**: Day-to-day operations, dispatching technicians, billing, and warranty claims.
   - **Field Technician (Rahul Verma)**: Mobile-optimized interface with one-tap status triggers ("Start Travel", "Mark Arrived", "Record Diagnosis", "Add Parts Used", "Complete Job").

3. **Spare Parts & Inventory Management**:
   - Automatic stock level deduction when technicians consume parts on a work order.
   - Low-stock visual alert badges.
   - Stock In / Stock Out adjustments.

4. **Invoices & Billing**:
   - Auto-generated GST tax invoices (Labour + Spares + CGST 9% + SGST 9%).
   - Partial payment and balance due tracking.
   - Clean, print-ready format.

5. **Warranty & AMC Tracking**:
   - Automated warranty status calculation based on purchase dates.
   - Annual Maintenance Contract (AMC) visit counters (e.g. 2 of 4 visits used).

6. **Interactive Dashboard & Business Intelligence**:
   - Key performance indicators (Active jobs, revenue collected, fleet readiness).
   - Recharts visual charts (revenue trends, tickets by appliance category, status pipeline).
   - CSV export for service data.

7. **Global Search**:
   - Search across tickets, customers, appliance serials, and spare parts.

---

## 🔑 Demo Accounts

Switch roles instantly using the top bar role buttons or test with:

| Role | Name | Email | Password |
|---|---|---|---|
| **Super Admin** | Vikram Malhotra | `admin@demo.local` | `Admin@123` |
| **Service Manager** | Priya Sharma | `manager@demo.local` | `Manager@123` |
| **Technician** | Rahul Verma | `technician@demo.local` | `Technician@123` |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ installed

### Steps

1. Clone or navigate to the directory:
   ```bash
   cd "utkarsh project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment to Vercel

This repository is optimized for Vercel:

```bash
npx vercel
```
or connect the GitHub repository directly in the [Vercel Dashboard](https://vercel.com).
