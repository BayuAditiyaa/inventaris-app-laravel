<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReceivePurchaseOrderRequest;
use App\Http\Requests\StorePurchaseOrderRequest;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Services\ActivityLogService;
use App\Services\PurchaseOrderService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function __construct(
        protected PurchaseOrderService $purchaseOrderService,
        protected ActivityLogService $activityLogService
    )
    {
    }

    public function index()
    {
        Gate::authorize('viewAny', PurchaseOrder::class);

        $purchaseOrders = PurchaseOrder::query()
            ->with(['supplier', 'creator', 'items'])
            ->when(request('status'), fn ($query) => $query->where('status', request('status')))
            ->orderByDesc('ordered_at')
            ->paginate(10);

        return Inertia::render('PurchaseOrders/Index', [
            'purchaseOrders' => $purchaseOrders,
            'filters' => [
                'status' => request('status'),
            ],
        ]);
    }

    public function create()
    {
        Gate::authorize('create', PurchaseOrder::class);

        return Inertia::render('PurchaseOrders/Create', [
            'suppliers' => Supplier::orderBy('name')->get(),
            'products' => Product::orderBy('name')->get(),
        ]);
    }

    public function store(StorePurchaseOrderRequest $request)
    {
        Gate::authorize('create', PurchaseOrder::class);

        $purchaseOrder = $this->purchaseOrderService->createPurchaseOrder(
            $request->validated(),
            auth()->id()
        );

        $this->activityLogService->log(
            'purchase_order.created',
            "Created purchase order {$purchaseOrder->po_number}",
            $purchaseOrder,
            ['supplier_id' => $purchaseOrder->supplier_id, 'total_amount' => $purchaseOrder->total_amount]
        );

        return redirect()->route('purchase-orders.show', $purchaseOrder)
            ->with('success', 'Purchase order created successfully.');
    }

    public function show(PurchaseOrder $purchaseOrder)
    {
        Gate::authorize('view', $purchaseOrder);

        $purchaseOrder->load(['supplier', 'creator', 'items.product']);

        return Inertia::render('PurchaseOrders/Show', [
            'purchaseOrder' => $purchaseOrder,
        ]);
    }

    public function receive(ReceivePurchaseOrderRequest $request, PurchaseOrder $purchaseOrder)
    {
        Gate::authorize('receive', $purchaseOrder);

        try {
            $purchaseOrder = $this->purchaseOrderService->receivePurchaseOrder(
                $purchaseOrder,
                $request->validated('items'),
                auth()->id()
            );

            $this->activityLogService->log(
                'purchase_order.received',
                "Processed receipt for {$purchaseOrder->po_number}",
                $purchaseOrder,
                ['status' => $purchaseOrder->status, 'progress_percentage' => $purchaseOrder->progress_percentage]
            );

            return redirect()->route('purchase-orders.show', $purchaseOrder)
                ->with('success', 'Purchase order received and stock updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'error' => $e->getMessage(),
            ]);
        }
    }
}
