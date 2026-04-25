# Screenshot Shotlist

This file helps you capture portfolio-ready screenshots with a consistent story. Use the seeded demo data so each screen looks populated and intentional.

## Preparation

- Run `php artisan migrate --seed`
- Run `php artisan serve`
- Run `npm run dev`
- Use a desktop viewport first, then optionally capture a mobile view for responsiveness
- Login as `admin` unless the shot specifically requires `staff`

## Recommended Screenshots

These 6 screenshots are the strongest candidates for the main README gallery:

1. `dashboard.png`
2. `purchase-order-detail.png`
3. `sales-report.png`
4. `supplier-report.png`
5. `invoice.png`
6. `staff-view.png`

Why these 6:

- they show both product breadth and technical depth
- they cover operations, procurement, reporting, export readiness, and RBAC
- they avoid overloading the README with too many repetitive table screens

### 1. Dashboard Overview

- Page: `/dashboard`
- Goal: show KPI breadth and business context
- Include:
  - inventory cards
  - procurement cards
  - recent stock movements
  - top suppliers
- Suggested caption:
  - `Admin dashboard combining inventory, procurement, and operational activity insights.`

### 2. Products List

- Page: `/products`
- Goal: show catalog management and stock awareness
- Include:
  - SKU
  - price/cost
  - stock counts
  - low-stock visual cue if available
- Suggested caption:
  - `Product management with inventory-specific fields such as SKU, stock alert, cost, and selling price.`

### 3. Purchase Order Detail

- Page: open a PO with partial receiving progress
- Goal: highlight the strongest business workflow in the app
- Include:
  - order status
  - supplier info
  - line items
  - receiving progress
- Suggested caption:
  - `Purchase order workflow with partial receiving and stock-aware progress tracking.`

### 4. Sales Invoice

- Page: `/sales/{id}`
- Goal: show transaction detail and printable output
- Include:
  - invoice number
  - item table
  - totals
  - PDF button
- Suggested caption:
  - `Invoice view with printable and PDF-ready transaction details.`

### 5. Sales Report

- Page: `/reports/sales`
- Goal: show reporting UX and business aggregation
- Include:
  - date filters
  - trend chart
  - summary cards
  - export buttons
- Suggested caption:
  - `Sales analytics dashboard with filters, summaries, charting, and export options.`

### 6. Supplier Performance Report

- Page: `/reports/supplier-performance`
- Goal: show procurement analytics
- Include:
  - summary cards
  - supplier ranking table
  - export buttons
- Suggested caption:
  - `Supplier performance reporting for procurement visibility and decision support.`

### 7. Activity Logs

- Page: `/activity-logs`
- Goal: show production-minded audit capability
- Include:
  - user/action entries
  - timestamps
  - meaningful descriptions
- Suggested caption:
  - `Operational activity logs for traceability across inventory and procurement actions.`

### 8. Staff Role View

- Page: `staff` account on dashboard or navigation
- Goal: show RBAC impact visually
- Include:
  - absence of admin-only menu items
- Suggested caption:
  - `Role-based navigation that adapts to staff permissions and protected modules.`

## README Placement Suggestion

If you later add real image files, place them under:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/products.png`
- `docs/screenshots/purchase-order-detail.png`
- `docs/screenshots/invoice.png`
- `docs/screenshots/sales-report.png`
- `docs/screenshots/supplier-report.png`
- `docs/screenshots/activity-logs.png`
- `docs/screenshots/staff-view.png`

Then add a gallery section in `README.md` with short captions only.
