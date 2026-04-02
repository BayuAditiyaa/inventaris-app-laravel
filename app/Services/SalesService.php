<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;

class SalesService
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Create a sale with multiple items
     * 
     * @param array $items Array of ['product_id' => int, 'qty' => int]
     * @param int $discount Discount amount in IDR
     * @param int|null $customerId Customer ID (optional)
     * @param int $userId User/cashier ID
     */
    // public function createSale(array $items, int $discount = 0, ?int $customerId = null, int $userId = null): Sale
    // {
    //     return DB::transaction(function () use ($items, $discount, $customerId, $userId) {
    //         // Validate stock availability
    //         foreach ($items as $item) {
    //             $product = Product::findOrFail($item['product_id']);
    //             if ($product->stock < $item['qty']) {
    //                 throw new \Exception("Insufficient stock for {$product->name}. Available: {$product->stock}, Requested: {$item['qty']}");
    //             }
    //         }

    //         // Calculate totals
    //         $subtotal = 0;
    //         $saleItems = [];

    //         foreach ($items as $item) {
    //             $product = Product::findOrFail($item['product_id']);
    //             $lineTotal = $product->price * $item['qty'];
    //             $subtotal += $lineTotal;

    //             $saleItems[] = [
    //                 'product_id' => $product->id,
    //                 'qty' => $item['qty'],
    //                 'unit_price' => $product->price,
    //                 'unit_cost' => $product->cost,
    //                 'line_total' => $lineTotal,
    //             ];
    //         }

    //         // Create sale
    //         $total = $subtotal - $discount;
    //         $sale = Sale::create([
    //             'invoice_no' => $this->generateInvoiceNumber(),
    //             'customer_id' => $customerId,
    //             'user_id' => $userId ?? auth()->id(),
    //             'sold_at' => now(),
    //             'subtotal' => $subtotal,
    //             'discount' => $discount,
    //             'total' => $total,
    //         ]);

    //         // Create sale items & decrease stock
    //         foreach ($saleItems as $item) {
    //             SaleItem::create([
    //                 'sale_id' => $sale->id,
    //                 ...$item,
    //             ]);

    //             // Decrease product stock via InventoryService
    //             $product = Product::findOrFail($item['product_id']);
    //             $this->inventoryService->decreaseStock(
    //                 $product,
    //                 $item['qty'],
    //                 "Sale #{$sale->invoice_no}",
    //                 $userId ?? auth()->id(),
    //                 'sale',
    //                 $sale->id
    //             );
    //         }

    //         return $sale;
    //     });
    // }

    public function createSale(array $items, int $discount = 0, ?int $customerId = null, int $userId = null): Sale
    {
        return DB::transaction(function () use ($items, $discount, $customerId, $userId) {
            $subtotal = 0;
            $saleItems = [];
            $products = []; // Cache the queried products so we don't query them again!

            // LOOP 1: Validate AND Calculate
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if ($product->stock < $item['qty']) {
                    throw new \Exception("Insufficient stock for {$product->name}. Available: {$product->stock}");
                }

                $products[$item['product_id']] = $product; // Save it to our local array

                $lineTotal = $product->price * $item['qty'];
                $subtotal += $lineTotal;

                $saleItems[] = [
                    'product_id' => $product->id,
                    'qty' => $item['qty'],
                    'unit_price' => $product->price,
                    'unit_cost' => $product->cost,
                    'line_total' => $lineTotal,
                ];
            }

            // Create the parent Sale receipt
            $total = $subtotal - $discount;
            $sale = Sale::create([ /* ... your current code ... */ ]);

            // LOOP 2: Create items and deduct stock using our cached products
            foreach ($saleItems as $item) {
                SaleItem::create(['sale_id' => $sale->id] + $item);

                $this->inventoryService->decreaseStock(
                    $products[$item['product_id']], // Use the cached product! No DB query!
                    $item['qty'],
                    "Sale #{$sale->invoice_no}",
                    $userId ?? auth()->id(),
                    'sale',
                    $sale->id
                );
            }

            return $sale;
        });
    }

    /**
     * Generate unique invoice number
     */
    private function generateInvoiceNumber(): string
    {
        $date = now()->format('Ymd');
        $count = Sale::whereDate('created_at', now())->count() + 1;
        return "INV-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Create or update customer
     */
    public function createOrUpdateCustomer(string $name, ?string $phone = null, ?string $address = null): Customer
    {
        return Customer::updateOrCreate(
            ['name' => $name],
            ['phone' => $phone, 'address' => $address]
        );
    }
}