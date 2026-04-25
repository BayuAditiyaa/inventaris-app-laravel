<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

test('creating a product writes an activity log entry', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post('/products', [
        'name' => 'Keyboard Mechanical',
        'sku' => 'KEY-001',
        'cost' => 50000,
        'price' => 85000,
        'stock_alert' => 5,
    ])->assertRedirect('/products');

    $log = ActivityLog::query()->latest()->first();
    $product = Product::query()->latest()->first();

    expect($log)->not->toBeNull();
    expect($log->action)->toBe('product.created');
    expect($log->subject_type)->toBe('Product');
    expect($log->subject_id)->toBe($product->id);
});

test('admin can open activity log page', function () {
    $admin = User::factory()->admin()->create();
    $version = app(HandleInertiaRequests::class)->version(Request::create('/activity-logs', 'GET'));

    $this->actingAs($admin)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
            'X-Inertia-Version' => $version,
        ])
        ->get('/activity-logs')
        ->assertOk()
        ->assertHeader('X-Inertia', 'true');
});
