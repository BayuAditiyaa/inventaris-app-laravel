<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use App\Models\Supplier;
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

        $procurementStats = null;
        $incomingPurchaseOrders = [];
        $supplierHighlights = [];

        if (auth()->user()?->role === 'admin') {
            $openPurchaseOrders = PurchaseOrder::query()
                ->with(['supplier', 'items'])
                ->whereIn('status', ['ordered', 'partial'])
                ->orderBy('expected_at')
                ->orderByDesc('ordered_at')
                ->limit(5)
                ->get()
                ->map(function (PurchaseOrder $purchaseOrder) {
                    return [
                        'id' => $purchaseOrder->id,
                        'po_number' => $purchaseOrder->po_number,
                        'supplier_name' => $purchaseOrder->supplier?->name,
                        'status' => $purchaseOrder->status,
                        'expected_at' => $purchaseOrder->expected_at?->toDateString(),
                        'progress_percentage' => $purchaseOrder->progress_percentage,
                        'remaining_items_count' => $purchaseOrder->remaining_items_count,
                    ];
                });

            $procurementStats = [
                'total_suppliers' => Supplier::query()->count(),
                'open_purchase_orders' => PurchaseOrder::query()->whereIn('status', ['ordered', 'partial'])->count(),
                'incoming_units' => PurchaseOrder::query()
                    ->with('items')
                    ->whereIn('status', ['ordered', 'partial'])
                    ->get()
                    ->sum(fn (PurchaseOrder $purchaseOrder) => $purchaseOrder->items->sum(fn ($item) => max($item->qty_ordered - $item->qty_received, 0))),
                'pending_receipts_today' => PurchaseOrder::query()
                    ->whereIn('status', ['ordered', 'partial'])
                    ->whereDate('expected_at', today())
                    ->count(),
            ];

            $incomingPurchaseOrders = $openPurchaseOrders;

            $supplierHighlights = Supplier::query()
                ->leftJoin('purchase_orders', 'suppliers.id', '=', 'purchase_orders.supplier_id')
                ->leftJoin('purchase_order_items', 'purchase_orders.id', '=', 'purchase_order_items.purchase_order_id')
                ->selectRaw('
                    suppliers.id,
                    suppliers.name,
                    COUNT(DISTINCT purchase_orders.id) as po_count,
                    COALESCE(SUM(purchase_orders.total_amount), 0) as total_amount,
                    COALESCE(SUM(purchase_order_items.qty_ordered - purchase_order_items.qty_received), 0) as pending_units
                ')
                ->groupBy('suppliers.id', 'suppliers.name')
                ->orderByDesc('total_amount')
                ->limit(3)
                ->get()
                ->map(fn ($supplier) => [
                    'id' => $supplier->id,
                    'name' => $supplier->name,
                    'po_count' => $supplier->po_count,
                    'total_amount' => $supplier->total_amount,
                    'pending_units' => $supplier->pending_units,
                ]);
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_products' => Product::query()->count(),
                'low_stock_items' => Product::query()->whereColumn('stock', '<=', 'stock_alert')->count(),
                'today_sales' => Sale::query()->whereDate('sold_at', today())->count(),
                'total_revenue' => Sale::query()->sum('total'),
            ],
            'procurementStats' => $procurementStats,
            'incomingPurchaseOrders' => $incomingPurchaseOrders,
            'supplierHighlights' => $supplierHighlights,
            'recentMovements' => $recentMovements,
        ]);
    }
}
