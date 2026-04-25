<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService)
    {
    }

    // List customers
    public function index()
    {
        Gate::authorize('viewAny', Customer::class);

        $customers = Customer::query()
            ->when(request('search'), function ($query) {
                $search = request('search');
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Customer/Index', [
            'customers' => $customers,
            'search' => request('search'),
        ]);
    }

    // Create form
    public function create()
    {
        Gate::authorize('create', Customer::class);

        return Inertia::render('Customer/Create');
    }

    // Store customer
    public function store(StoreCustomerRequest $request)
    {
        Gate::authorize('create', Customer::class);

        try {
            $customer = Customer::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            $this->activityLogService->log(
                'customer.created',
                "Created customer {$customer->name}",
                $customer,
                ['phone' => $customer->phone]
            );

            return redirect()->route('customers.index')
                ->with('success', 'Customer created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    // Edit form
    public function edit(Customer $customer)
    {
        Gate::authorize('update', $customer);

        return Inertia::render('Customer/Edit', [
            'customer' => $customer,
        ]);
    }

    // Update customer
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        Gate::authorize('update', $customer);

        try {
            $customer->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            $this->activityLogService->log(
                'customer.updated',
                "Updated customer {$customer->name}",
                $customer,
                ['phone' => $customer->phone]
            );

            return redirect()->route('customers.index')
                ->with('success', 'Customer updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    // Delete customer
    public function destroy(Customer $customer)
    {
        Gate::authorize('delete', $customer);

        try {
            $customerName = $customer->name;

            $customer->delete();

            $this->activityLogService->log(
                'customer.deleted',
                "Deleted customer {$customerName}",
                null,
                ['customer_name' => $customerName]
            );

            return redirect()->route('customers.index')
                ->with('success', 'Customer deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
