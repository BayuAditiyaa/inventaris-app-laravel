<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

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