<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService)
    {
    }

    public function index()
    {
        Gate::authorize('viewAny', Supplier::class);

        $suppliers = Supplier::query()
            ->when(request('search'), function ($query) {
                $search = request('search');

                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'search' => request('search'),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Supplier::class);

        return Inertia::render('Suppliers/Create');
    }

    public function store(StoreSupplierRequest $request)
    {
        Gate::authorize('create', Supplier::class);

        $supplier = Supplier::create($request->validated());

        $this->activityLogService->log(
            'supplier.created',
            "Created supplier {$supplier->name}",
            $supplier,
            ['contact_person' => $supplier->contact_person]
        );

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier created successfully.');
    }

    public function edit(Supplier $supplier)
    {
        Gate::authorize('update', $supplier);

        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        Gate::authorize('update', $supplier);

        $supplier->update($request->validated());

        $this->activityLogService->log(
            'supplier.updated',
            "Updated supplier {$supplier->name}",
            $supplier,
            ['contact_person' => $supplier->contact_person]
        );

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier)
    {
        Gate::authorize('delete', $supplier);

        $supplierName = $supplier->name;

        $supplier->delete();

        $this->activityLogService->log(
            'supplier.deleted',
            "Deleted supplier {$supplierName}",
            null,
            ['supplier_name' => $supplierName]
        );

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier deleted successfully.');
    }
}
