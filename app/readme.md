# Breeze Inventory - Inventory Management System

A complete inventory management system built with Laravel 12, React, and Tailwind CSS.

## Features

✅ **Product Management**
- Create, read, update, delete products
- Image uploads
- SKU tracking
- Cost & price management
- Stock alerts

✅ **Point of Sale (POS)**
- Fast transaction processing
- Multiple items per transaction
- Discount support
- Customer tracking
- Invoice generation & printing

✅ **Inventory Management**
- Real-time stock tracking
- Stock in/out movements
- Inventory adjustments
- Low stock alerts
- Movement history

✅ **Reports & Analytics**
- Sales reports with date filtering
- Product performance analysis
- Best-selling products
- Profit tracking
- Low stock reports

✅ **User Management**
- Role-based access control
- Admin & Staff roles
- Secure authentication
- Password hashing

✅ **User Experience**
- Mobile responsive
- Smooth animations
- Toast notifications
- Professional UI

## System Requirements

- PHP 8.3+
- MySQL 8.0+
- Node.js 18+
- Composer 2+
- Redis (optional, for caching)

## Installation

### Local Development

```bash
# Clone repository
git clone https://github.com/your-repo/inventory-pro.git
cd inventory-pro

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate --seed

# Build assets
npm run dev

# Start server
php artisan serve