<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Http\Requests\StoreStockMovementRequest;
use App\Services\ActivityLogService;
use App\Services\InventoryServices;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class StockMovementController extends Controller
{
    protected InventoryServices $inventoryService;

    // BRING THIS CONSTRUCTOR BACK!
    public function __construct(InventoryServices $inventoryService, protected ActivityLogService $activityLogService)
    {
        $this->inventoryService = $inventoryService;
    }
    // List stock movements
    public function index()
    {
        Gate::authorize('viewAny', StockMovement::class);

        $movements = StockMovement::query()
            ->with(['product', 'createdBy'])
            ->when(request('product_id'), function ($query) {
                $query->where('product_id', request('product_id'));
            })
            ->when(request('type'), function ($query) {
                $query->where('type', request('type'));
            })
            ->when(request('date_from'), function ($query) {
                $query->whereDate('created_at', '>=', request('date_from'));
            })
            ->when(request('date_to'), function ($query) {
                $query->whereDate('created_at', '<=', request('date_to'));
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $products = Product::orderBy('name')->get();

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'products' => $products,
            'filters' => [
                'product_id' => request('product_id'),
                'type' => request('type'),
                'date_from' => request('date_from'),
                'date_to' => request('date_to'),
            ],
        ]);
    }

    // Create form
    public function create()
    {
        Gate::authorize('create', StockMovement::class);

        $products = Product::orderBy('name')->get();

        return Inertia::render('StockMovements/Create', [
            'products' => $products,
        ]);
    }

    // Store movement
    public function store(StoreStockMovementRequest $request)
    {
        Gate::authorize('create', StockMovement::class);

        try {
            $product = Product::findOrFail($request->product_id);
            $type = $request->type;
            $qty = $request->qty;
            $note = $request->note;

            if ($type === 'in') {
                $movement = $this->inventoryService->increaseStock($product, $qty, $note);
            } elseif ($type === 'out') {
                $movement = $this->inventoryService->decreaseStock($product, $qty, $note);
            } elseif ($type === 'adjust') {
                // For adjust, qty is the delta (can be positive or negative)
                $delta = $request->adjustment_type === 'increase' ? $qty : -$qty;
                $movement = $this->inventoryService->adjustStock($product, $delta, $note);
            }

            $this->activityLogService->log(
                'stock_movement.created',
                "Recorded {$type} stock movement for {$product->name}",
                $movement ?? null,
                ['product_name' => $product->name, 'qty' => $qty, 'type' => $type]
            );

            return redirect()->route('stock-movements.index')
                ->with('success', 'Stock movement recorded successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
