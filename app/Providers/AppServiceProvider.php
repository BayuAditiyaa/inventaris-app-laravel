<?php

namespace App\Providers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Policies\ProductPolicy;
use App\Policies\StockMovementPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(StockMovement::class, StockMovementPolicy::class);
    }
}
