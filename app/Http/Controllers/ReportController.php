<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // Sales Report
    public function salesReport()
    {
        $dateFrom = request('date_from') ?? now()->subDays(30)->toDateString();
        $dateTo = request('date_to') ?? now()->toDateString();

        // Total sales by date
        $salesByDate = Sale::query()
            ->selectRaw('DATE(sold_at) as date, COUNT(*) as count, SUM(total) as total, SUM(discount) as discount')
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        // Sales by customer
        $salesByCustomer = Sale::query()
            ->with('customer')
            ->selectRaw('customer_id, COUNT(*) as count, SUM(total) as total')
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('customer_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        // Sales by cashier
        $salesByCashier = Sale::query()
            ->with('user')
            ->selectRaw('user_id, COUNT(*) as count, SUM(total) as total')
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->get();

        // Overall summary
        $summary = Sale::query()
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->selectRaw('COUNT(*) as total_transactions, SUM(subtotal) as total_subtotal, SUM(discount) as total_discount, SUM(total) as total_revenue')
            ->first();

        // Calculate total profit
        $totalProfit = Sale::query()
            ->with('items')
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->get()
            ->sum(function ($sale) {
                return $sale->items->sum(function ($item) {
                    return ($item->unit_price - $item->unit_cost) * $item->qty;
                });
            });

        return Inertia::render('Reports/SalesReport', [
            'salesByDate' => $salesByDate,
            'salesByCustomer' => $salesByCustomer,
            'salesByCashier' => $salesByCashier,
            'summary' => $summary,
            'totalProfit' => $totalProfit,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    // Low Stock Report
    public function lowStockReport()
    {
        $products = Product::query()
            ->whereRaw('stock <= stock_alert')
            ->orderBy('stock')
            ->paginate(20);

        $stats = Product::query()
            ->whereRaw('stock <= stock_alert')
            ->selectRaw('COUNT(*) as count, SUM(stock) as total_stock, SUM(stock_alert) as total_alert')
            ->first();

        return Inertia::render('Reports/LowStockReport', [
            'products' => $products,
            'stats' => $stats,
        ]);
    }

    // Product Performance Report
    public function productPerformanceReport()
    {
        $dateFrom = request('date_from') ?? now()->subDays(30)->toDateString();
        $dateTo = request('date_to') ?? now()->toDateString();

        // Best selling products
        $bestSelling = Product::query()
            ->with('stockMovements')
            ->selectRaw('products.id, products.name, products.sku, products.price, products.cost, SUM(sale_items.qty) as total_qty, SUM(sale_items.line_total) as total_revenue')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.price', 'products.cost')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        // Most profitable products
        $mostProfitable = Product::query()
            ->selectRaw('products.id, products.name, products.sku, products.price, products.cost, SUM(sale_items.qty) as total_qty, SUM(sale_items.line_total) as total_revenue')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.price', 'products.cost')
            ->havingRaw('SUM(sale_items.qty) > 0')
            ->orderByRaw('SUM(sale_items.line_total) - (SUM(sale_items.qty) * products.cost) DESC')
            ->limit(10)
            ->get();

        // Slow moving products
        $slowMoving = Product::query()
            ->selectRaw('products.id, products.name, products.sku, products.stock, COALESCE(SUM(sale_items.qty), 0) as total_qty')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.stock')
            ->havingRaw('COALESCE(SUM(sale_items.qty), 0) < 5 OR COALESCE(SUM(sale_items.qty), 0) IS NULL')
            ->orderBy('total_qty')
            ->limit(10)
            ->get();

        return Inertia::render('Reports/ProductPerformanceReport', [
            'bestSelling' => $bestSelling,
            'mostProfitable' => $mostProfitable,
            'slowMoving' => $slowMoving,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }
}