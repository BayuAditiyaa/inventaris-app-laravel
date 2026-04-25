# Portfolio Demo Guide

This guide is designed for interview sessions, portfolio walkthroughs, or screen-recorded demos. It helps you explain the project as a product, not just as a list of pages.

## One-Line Pitch

This is a fullstack inventory management system built with Laravel 12, React, and Inertia that covers stock operations, sales, procurement, reporting, and audit visibility in one cohesive workflow.

## What To Emphasize First

When introducing the project, focus on these three points:

1. It models real business workflows, not isolated CRUD modules.
2. Stock-sensitive actions are guarded by backend business rules and transactions.
3. Access control, reports, exports, and audit logs make it feel closer to an internal business tool than a tutorial app.

## Recommended Demo Flow

Use this order so the story feels natural:

1. Login as `admin`.
2. Open the dashboard and explain that the seeded data is intentionally prepared for a live demo.
3. Show products and low-stock indicators to establish the inventory context.
4. Open purchase orders and demonstrate `ordered`, `partial`, and `received` states.
5. Open a purchase order detail page and show partial receiving progress.
6. Open sales and explain automatic stock deduction after transactions.
7. Open reports and show:
   - Sales report
   - Low stock report
   - Product performance report
   - Supplier performance report
8. Trigger or point to CSV export.
9. Open activity logs to show traceability.
10. Logout and login as `staff` to show role-based access restrictions.

## Suggested Narration

### 1. Project Framing

You can say:

`I wanted to build something closer to a real internal operations app, so I designed this around how inventory actually moves in and out of a business: inbound through procurement, outbound through sales, and visible through reports and audit logs.`

### 2. Backend Architecture

You can say:

`On the backend, I separated business logic into services instead of keeping it inside controllers. For example, stock updates are handled in InventoryServices, sales logic lives in SalesService, and procurement receiving is handled in PurchaseOrderService. That made it easier to keep rules consistent and write focused tests.`

### 3. Authorization

You can say:

`I used policies and gates so authorization is enforced server-side, and I also aligned the frontend navigation with those permissions to avoid misleading UI states.`

### 4. Product Thinking

You can say:

`I tried to make it presentation-ready as a product, not only technically functional. That is why I added seeded demo data, dashboard summaries, CSV exports, and activity logs.`

## Strong Talking Points

- The app covers both inbound and outbound inventory flows.
- Partial receiving is more realistic than a simple one-click receive-all flow.
- Low-stock monitoring is tied to actual inventory data, not static placeholders.
- Reporting uses aggregated business queries and date filters.
- Audit logging adds operational traceability, which is common in real admin tools.
- The project includes feature tests for domain behavior, not only authentication boilerplate.

## Likely Interview Questions

### Why Laravel + Inertia instead of a separate API and frontend?

Suggested answer:

`For this project, Inertia gave me a fast way to build a reactive user experience while keeping routing, validation, authorization, and page data close to the Laravel backend. It let me move quickly without splitting the project into two separate applications.`

### What was the hardest part?

Suggested answer:

`The trickiest part was keeping stock movements consistent across different workflows. Sales decrease stock, purchase-order receiving increases stock, and adjustments can move stock either way, so I centralized those rules in the service layer and added tests around edge cases like over-receiving and negative stock.`

### If you had more time, what would you improve?

Suggested answer:

`The next improvements I would add are PDF export, scheduled low-stock notifications, and richer procurement analytics such as lead-time tracking and supplier trend comparisons.`

## 60-Second Version

If time is short, use this compressed version:

`This project is a Laravel 12 and React Inertia inventory system that I built as a portfolio case study for real business workflows. It handles products, stock movements, sales, suppliers, purchase orders with partial receiving, reports, CSV export, and activity logs. I used service classes for stock-sensitive logic, policies for RBAC, and feature tests for core inventory behavior so the project shows both product thinking and backend engineering discipline.`

## Pre-Demo Checklist

- Run `php artisan migrate --seed`
- Run `php artisan serve`
- Run `npm run dev`
- Login once as `admin`
- Confirm dashboard data is populated
- Confirm reports load without empty states
- Confirm purchase orders show mixed statuses
- Confirm `staff` account cannot access admin-only modules

## Repo Sections Worth Pointing To

- [README.md](../README.md)
- [database/seeders/DatabaseSeeder.php](../database/seeders/DatabaseSeeder.php)
- [app/Services/InventoryServices.php](../app/Services/InventoryServices.php)
- [app/Services/SalesService.php](../app/Services/SalesService.php)
- [app/Services/PurchaseOrderService.php](../app/Services/PurchaseOrderService.php)
- [app/Services/ActivityLogService.php](../app/Services/ActivityLogService.php)
