<?php

use App\Http\Controllers\SaleController;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\SalesService;

test('admin can export sales report as csv', function () {
    $admin = User::factory()->admin()->create();
    $cashier = User::factory()->staff()->create();

    Sale::factory()->create([
        'invoice_no' => 'INV-EXPORT-001',
        'user_id' => $cashier->id,
        'subtotal' => 100000,
        'discount' => 5000,
        'total' => 95000,
        'sold_at' => now(),
    ]);

    $response = $this->actingAs($admin)
        ->get('/reports/sales/export?date_from='.now()->toDateString().'&date_to='.now()->toDateString());

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('text/csv');
    expect($response->streamedContent())->toContain('INV-EXPORT-001');
});

test('admin can export sales report as pdf', function () {
    $admin = User::factory()->admin()->create();
    $cashier = User::factory()->staff()->create();

    Sale::factory()->create([
        'invoice_no' => 'INV-PDF-001',
        'user_id' => $cashier->id,
        'subtotal' => 100000,
        'discount' => 5000,
        'total' => 95000,
        'sold_at' => now(),
    ]);

    $response = $this->actingAs($admin)
        ->get('/reports/sales/pdf?date_from='.now()->toDateString().'&date_to='.now()->toDateString());

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
    expect($response->getContent())->toStartWith('%PDF');
});

test('staff can export their sale invoice as pdf', function () {
    $staff = User::factory()->staff()->create();
    $product = Product::factory()->create();
    $sale = Sale::factory()->create([
        'user_id' => $staff->id,
        'subtotal' => 120000,
        'discount' => 10000,
        'total' => 110000,
    ]);

    SaleItem::factory()->create([
        'sale_id' => $sale->id,
        'product_id' => $product->id,
        'qty' => 2,
        'unit_price' => 60000,
        'unit_cost' => 35000,
        'line_total' => 120000,
    ]);

    $controller = new SaleController(app(SalesService::class), app(ActivityLogService::class));
    $method = new ReflectionMethod($controller, 'buildInvoicePdfHtml');
    $method->setAccessible(true);

    $html = $method->invoke($controller, $sale->load(['items.product', 'customer', 'user']), [
        'name' => 'Breeze Inventory',
        'address' => 'Demo portfolio project for retail and warehouse operations',
        'phone' => '+62 812-0000-0000',
    ]);

    expect($html)
        ->toContain($staff->name)
        ->toContain('Rp 110.000')
        ->not->toContain('{e(')
        ->not->toContain('{{')
        ->not->toContain('number_format(');

    $response = $this->actingAs($staff)->get("/sales/{$sale->id}/pdf");

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
    expect($response->getContent())->toStartWith('%PDF');
});

test('staff cannot export admin reports', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get('/reports/low-stock/export')
        ->assertForbidden();
});
