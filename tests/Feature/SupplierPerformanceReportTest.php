<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\Request;

test('admin can open supplier performance report', function () {
    $admin = User::factory()->admin()->create();
    $version = app(HandleInertiaRequests::class)->version(Request::create('/reports/supplier-performance', 'GET'));
    $supplier = Supplier::factory()->create();
    $product = Product::factory()->create();

    $purchaseOrder = PurchaseOrder::create([
        'po_number' => 'PO-SUP-001',
        'supplier_id' => $supplier->id,
        'created_by' => $admin->id,
        'status' => 'partial',
        'ordered_at' => now()->toDateString(),
        'total_amount' => 500000,
    ]);

    $purchaseOrder->items()->create([
        'product_id' => $product->id,
        'qty_ordered' => 10,
        'qty_received' => 6,
        'unit_cost' => 50000,
        'line_total' => 500000,
    ]);

    $this->actingAs($admin)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
            'X-Inertia-Version' => $version,
        ])
        ->get('/reports/supplier-performance')
        ->assertOk()
        ->assertHeader('X-Inertia', 'true');
});

test('admin can export supplier performance report as csv', function () {
    $admin = User::factory()->admin()->create();
    $supplier = Supplier::factory()->create([
        'name' => 'PT Supplier Maju',
    ]);
    $product = Product::factory()->create();

    $purchaseOrder = PurchaseOrder::create([
        'po_number' => 'PO-SUP-CSV',
        'supplier_id' => $supplier->id,
        'created_by' => $admin->id,
        'status' => 'received',
        'ordered_at' => now()->toDateString(),
        'total_amount' => 120000,
    ]);

    $purchaseOrder->items()->create([
        'product_id' => $product->id,
        'qty_ordered' => 4,
        'qty_received' => 4,
        'unit_cost' => 30000,
        'line_total' => 120000,
    ]);

    $response = $this->actingAs($admin)
        ->get('/reports/supplier-performance/export?date_from='.now()->toDateString().'&date_to='.now()->toDateString());

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('text/csv');
    expect($response->streamedContent())->toContain('PT Supplier Maju');
});

test('staff cannot access supplier performance report', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get('/reports/supplier-performance')
        ->assertForbidden();
});
