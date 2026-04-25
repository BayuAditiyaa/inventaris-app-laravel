<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('products', ProductController::class)->except('show');
    Route::resource('suppliers', SupplierController::class)->except('show');
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

     // Stock Movements
    Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
    Route::get('/stock-movements/create', [StockMovementController::class, 'create'])->name('stock-movements.create');
    Route::post('/stock-movements', [StockMovementController::class, 'store'])->name('stock-movements.store');

    // Sales
    Route::get('/sales/create', [SaleController::class, 'create'])->name('sales.create');
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    Route::get('/sales/{sale}/pdf', [SaleController::class, 'exportPdf'])->name('sales.pdf');
    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');

    // Purchase Orders
    Route::get('/purchase-orders', [PurchaseOrderController::class, 'index'])->name('purchase-orders.index');
    Route::get('/purchase-orders/create', [PurchaseOrderController::class, 'create'])->name('purchase-orders.create');
    Route::post('/purchase-orders', [PurchaseOrderController::class, 'store'])->name('purchase-orders.store');
    Route::get('/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'show'])->name('purchase-orders.show');
    Route::post('/purchase-orders/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receive'])->name('purchase-orders.receive');

     // Reports
    Route::get('/reports/sales', [ReportController::class, 'salesReport'])->name('reports.sales');
    Route::get('/reports/sales/export', [ReportController::class, 'exportSalesReport'])->name('reports.sales.export');
    Route::get('/reports/sales/pdf', [ReportController::class, 'exportSalesReportPdf'])->name('reports.sales.pdf');
    Route::get('/reports/low-stock', [ReportController::class, 'lowStockReport'])->name('reports.low-stock');
    Route::get('/reports/low-stock/export', [ReportController::class, 'exportLowStockReport'])->name('reports.low-stock.export');
    Route::get('/reports/low-stock/pdf', [ReportController::class, 'exportLowStockReportPdf'])->name('reports.low-stock.pdf');
    Route::get('/reports/product-performance', [ReportController::class, 'productPerformanceReport'])->name('reports.product-performance');
    Route::get('/reports/product-performance/export', [ReportController::class, 'exportProductPerformanceReport'])->name('reports.product-performance.export');
    Route::get('/reports/product-performance/pdf', [ReportController::class, 'exportProductPerformanceReportPdf'])->name('reports.product-performance.pdf');
    Route::get('/reports/supplier-performance', [ReportController::class, 'supplierPerformanceReport'])->name('reports.supplier-performance');
    Route::get('/reports/supplier-performance/export', [ReportController::class, 'exportSupplierPerformanceReport'])->name('reports.supplier-performance.export');
    Route::get('/reports/supplier-performance/pdf', [ReportController::class, 'exportSupplierPerformanceReportPdf'])->name('reports.supplier-performance.pdf');

      // Customers
    Route::resource('customers', CustomerController::class)->except('show');
 
});


require __DIR__.'/auth.php';
