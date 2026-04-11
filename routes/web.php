<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockMovementController;
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

Route::get('/dashboard', function () {
    $recentMovements = StockMovement::query()
        ->with(['product', 'createdBy'])
        ->latest()
        ->limit(5)
        ->get()
        ->map(function (StockMovement $movement) {
            return [
                'id' => $movement->id,
                'type' => $movement->type,
                'type_label' => $movement->getTypeLabel(),
                'qty_display' => $movement->getQtyDisplay(),
                'note' => $movement->note,
                'product_name' => $movement->product?->name,
                'created_by' => $movement->createdBy?->name,
                'created_at' => $movement->created_at?->toIso8601String(),
            ];
        });

    return Inertia::render('Dashboard', [
        'stats' => [
            'total_products' => Product::query()->count(),
            'low_stock_items' => Product::query()->whereColumn('stock', '<=', 'stock_alert')->count(),
            'today_sales' => Sale::query()->whereDate('sold_at', today())->count(),
            'total_revenue' => Sale::query()->sum('total'),
        ],
        'recentMovements' => $recentMovements,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('products', ProductController::class)->except('show');

     // Stock Movements
    Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
    Route::get('/stock-movements/create', [StockMovementController::class, 'create'])->name('stock-movements.create');
    Route::post('/stock-movements', [StockMovementController::class, 'store'])->name('stock-movements.store');

    // Sales
    Route::get('/sales/create', [SaleController::class, 'create'])->name('sales.create');
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');

     // Reports
    Route::get('/reports/sales', [ReportController::class, 'salesReport'])->name('reports.sales');
    Route::get('/reports/low-stock', [ReportController::class, 'lowStockReport'])->name('reports.low-stock');
    Route::get('/reports/product-performance', [ReportController::class, 'productPerformanceReport'])->name('reports.product-performance');

      // Customers
    Route::resource('customers', CustomerController::class)->except('show');
 
});


require __DIR__.'/auth.php';
