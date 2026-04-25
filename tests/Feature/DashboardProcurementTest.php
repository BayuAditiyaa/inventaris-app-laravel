<?php

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\User;

test('admin dashboard loads procurement snapshot data', function () {
    $admin = User::factory()->admin()->create();
    $supplier = Supplier::factory()->create();
    $product = Product::factory()->create([
        'stock' => 4,
        'stock_alert' => 6,
    ]);

    $purchaseOrder = PurchaseOrder::create([
        'po_number' => 'PO-DASH-001',
        'supplier_id' => $supplier->id,
        'created_by' => $admin->id,
        'status' => 'partial',
        'ordered_at' => now()->toDateString(),
        'expected_at' => now()->toDateString(),
        'total_amount' => 120000,
    ]);

    $purchaseOrder->items()->create([
        'product_id' => $product->id,
        'qty_ordered' => 6,
        'qty_received' => 2,
        'unit_cost' => 20000,
        'line_total' => 120000,
    ]);

    $this->actingAs($admin)
        ->get('/dashboard')
        ->assertOk();
});
