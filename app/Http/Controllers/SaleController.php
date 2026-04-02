<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use App\Http\Requests\StoreSaleRequest;
use App\Services\SalesService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class SaleController extends Controller
{
    protected SalesService $salesService;

    public function __construct(SalesService $salesService)
    {
        $this->salesService = $salesService;
    }

    // Create form (cashier screen)
    public function create()
    {
        $products = Product::where('stock', '>', 0)
            ->orderBy('name')
            ->get();
        $customers = Customer::orderBy('name')->get();

        return Inertia::render('Sales/Create', [
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    // Store sale
    public function store(StoreSaleRequest $request)
    {
        try {
            // Create or get customer if provided
            $customerId = null;
            if ($request->customer_name) {
                $customer = $this->salesService->createOrUpdateCustomer(
                    $request->customer_name,
                    $request->customer_phone,
                    $request->customer_address
                );
                $customerId = $customer->id;
            }

            // Create sale
            $sale = $this->salesService->createSale(
                items: $request->items,
                discount: $request->discount ?? 0,
                customerId: $customerId,
                userId: auth()->id()
            );

            return redirect()->route('sales.show', $sale)
                ->with('success', 'Sale completed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    // View sale / invoice
    public function show(Sale $sale)
    {
        $sale->load(['items.product', 'customer', 'user']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }

    // List sales
    public function index()
    {
        $sales = Sale::query()
            ->with(['customer', 'user', 'items'])
            ->when(request('date_from'), function ($query) {
                $query->whereDate('sold_at', '>=', request('date_from'));
            })
            ->when(request('date_to'), function ($query) {
                $query->whereDate('sold_at', '<=', request('date_to'));
            })
            ->when(request('customer_id'), function ($query) {
                $query->where('customer_id', request('customer_id'));
            })
            ->orderBy('sold_at', 'desc')
            ->paginate(15);

        $customers = Customer::orderBy('name')->get();

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'customers' => $customers,
            'filters' => [
                'date_from' => request('date_from'),
                'date_to' => request('date_to'),
                'customer_id' => request('customer_id'),
            ],
        ]);
    }
}