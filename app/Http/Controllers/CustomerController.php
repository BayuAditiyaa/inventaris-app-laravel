<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Inertia\Inertia;

class CustomerController extends Controller
{
    // List customers
    public function index()
    {
        $customers = Customer::query()
            ->when(request('search'), function ($query) {
                $search = request('search');
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'search' => request('search'),
        ]);
    }

    // Create form
    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    // Store customer
    public function store(StoreCustomerRequest $request)
    {
        try {
            Customer::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

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
        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    // Update customer
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        try {
            $customer->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

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
        try {
            $customer->delete();

            return redirect()->route('customers.index')
                ->with('success', 'Customer deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}