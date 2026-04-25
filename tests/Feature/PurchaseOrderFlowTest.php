<?php

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;

test('admin can partially receive and complete a purchase order', function () {
    $admin = User::factory()->admin()->create();
    $supplier = Supplier::factory()->create();
    $product = Product::factory()->create([
        'stock' => 5,
        'cost' => 20000,
    ]);

    $response = $this->actingAs($admin)->post('/purchase-orders', [
        'supplier_id' => $supplier->id,
        'ordered_at' => '2026-04-24',
        'expected_at' => '2026-04-26',
        'notes' => 'Urgent restock for top seller',
        'items' => [
            [
                'product_id' => $product->id,
                'qty_ordered' => 8,
                'unit_cost' => 22000,
            ],
        ],
    ]);

    $purchaseOrder = PurchaseOrder::with('items')->first();

    $response->assertRedirect(route('purchase-orders.show', $purchaseOrder));

    expect($purchaseOrder)->not->toBeNull();
    expect($purchaseOrder->total_amount)->toBe(176000);
    expect($purchaseOrder->status)->toBe('ordered');
    expect($purchaseOrder->items)->toHaveCount(1);

    $receiveResponse = $this->actingAs($admin)
        ->post(route('purchase-orders.receive', $purchaseOrder), [
            'items' => [
                [
                    'id' => $purchaseOrder->items->first()->id,
                    'qty_received' => 3,
                ],
            ],
        ]);

    $receiveResponse->assertRedirect(route('purchase-orders.show', $purchaseOrder));

    $purchaseOrder->refresh();
    $product->refresh();

    expect($purchaseOrder->status)->toBe('partial');
    expect($product->stock)->toBe(8);
    expect($purchaseOrder->items()->first()->qty_received)->toBe(3);

    $completeResponse = $this->actingAs($admin)
        ->post(route('purchase-orders.receive', $purchaseOrder), [
            'items' => [
                [
                    'id' => $purchaseOrder->items()->first()->id,
                    'qty_received' => 5,
                ],
            ],
        ]);

    $completeResponse->assertRedirect(route('purchase-orders.show', $purchaseOrder));

    $purchaseOrder->refresh();
    $product->refresh();

    expect($purchaseOrder->status)->toBe('received');
    expect($product->stock)->toBe(13);
    expect(StockMovement::where('ref_type', 'purchase_order')->count())->toBe(2);
});

test('admin cannot receive more than remaining quantity on a purchase order', function () {
    $admin = User::factory()->admin()->create();
    $supplier = Supplier::factory()->create();
    $product = Product::factory()->create([
        'stock' => 2,
    ]);

    $purchaseOrder = PurchaseOrder::create([
        'po_number' => 'PO-TEST-OVER',
        'supplier_id' => $supplier->id,
        'created_by' => $admin->id,
        'status' => 'ordered',
        'ordered_at' => now()->toDateString(),
        'total_amount' => 100000,
    ]);

    $item = $purchaseOrder->items()->create([
        'product_id' => $product->id,
        'qty_ordered' => 4,
        'qty_received' => 1,
        'unit_cost' => 25000,
        'line_total' => 100000,
    ]);

    $response = $this->actingAs($admin)
        ->from(route('purchase-orders.show', $purchaseOrder))
        ->post(route('purchase-orders.receive', $purchaseOrder), [
            'items' => [
                [
                    'id' => $item->id,
                    'qty_received' => 5,
                ],
            ],
        ]);

    $response
        ->assertRedirect(route('purchase-orders.show', $purchaseOrder))
        ->assertSessionHasErrors('error');

    expect($product->fresh()->stock)->toBe(2);
});

test('staff cannot access purchase order module', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get('/purchase-orders')
        ->assertForbidden();

    $this->actingAs($staff)
        ->get('/suppliers')
        ->assertForbidden();
});
