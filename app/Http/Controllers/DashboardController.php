<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
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
    }
}