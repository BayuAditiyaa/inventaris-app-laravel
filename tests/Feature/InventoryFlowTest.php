<?php

use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use App\Models\User;

test('staff can create a sale and stock is deducted', function () {
    $staff = User::factory()->staff()->create();
    $product = Product::factory()->create([
        'price' => 50000,
        'cost' => 30000,
        'stock' => 10,
    ]);

    $response = $this->actingAs($staff)->post('/sales', [
        'items' => [
            [
                'product_id' => $product->id,
                'qty' => 3,
            ],
        ],
        'discount' => 5000,
    ]);

    $sale = Sale::first();

    $response->assertRedirect(route('sales.show', $sale));

    expect($sale)->not->toBeNull();
    expect($sale->subtotal)->toBe(150000);
    expect($sale->total)->toBe(145000);

    $product->refresh();

    expect($product->stock)->toBe(7);

    $movement = StockMovement::first();

    expect($movement)->not->toBeNull();
    expect($movement->type)->toBe('out');
    expect($movement->qty)->toBe(3);
    expect($movement->created_by)->toBe($staff->id);
});

test('admin cannot adjust stock below zero', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create([
        'stock' => 2,
    ]);

    $response = $this->actingAs($admin)
        ->from('/stock-movements/create')
        ->post('/stock-movements', [
            'product_id' => $product->id,
            'type' => 'adjust',
            'qty' => 5,
            'adjustment_type' => 'decrease',
            'note' => 'Stock opname correction',
        ]);

    $response
        ->assertRedirect('/stock-movements/create')
        ->assertSessionHasErrors('error');

    expect($product->fresh()->stock)->toBe(2);
    expect(StockMovement::count())->toBe(0);
});
