<?php

use App\Models\Customer;
use App\Models\Product;
use App\Models\User;

test('staff cannot access sales reports', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get('/reports/sales')
        ->assertForbidden();
});

test('staff cannot create products', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get('/products/create')
        ->assertForbidden();
});

test('staff cannot delete customers', function () {
    $staff = User::factory()->staff()->create();
    $customer = Customer::factory()->create();

    $this->actingAs($staff)
        ->delete(route('customers.destroy', $customer))
        ->assertForbidden();
});

test('admin can access low stock report', function () {
    $admin = User::factory()->admin()->create();
    Product::factory()->create([
        'stock' => 2,
        'stock_alert' => 5,
    ]);

    $this->actingAs($admin)
        ->get('/reports/low-stock')
        ->assertOk();
});
