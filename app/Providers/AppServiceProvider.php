<?php

namespace App\Providers;

use App\Models\Customer;
use App\Models\PurchaseOrder;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\StockMovement;
use App\Models\User;
use App\Policies\CustomerPolicy;
use App\Policies\PurchaseOrderPolicy;
use App\Policies\ProductPolicy;
use App\Policies\SalePolicy;
use App\Policies\SupplierPolicy;
use App\Policies\StockMovementPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Gate::policy(Customer::class, CustomerPolicy::class);
        Gate::policy(PurchaseOrder::class, PurchaseOrderPolicy::class);
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(Sale::class, SalePolicy::class);
        Gate::policy(Supplier::class, SupplierPolicy::class);
        Gate::policy(StockMovement::class, StockMovementPolicy::class);

        Gate::define('viewReports', fn (User $user) => $user->role === 'admin');
    }
}
