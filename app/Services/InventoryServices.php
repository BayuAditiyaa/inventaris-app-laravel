<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class InventoryServices
{
    /**
     * Increase stock (e.g., received goods)
     */
    public function increaseStock(Product $product, int $qty, string $note = '', ?int $userId = null): StockMovement
    {
        return DB::transaction(function () use ($product, $qty, $note, $userId) {
            $movement = StockMovement::create([
                'product_id' => $product->id,
                'type' => 'in',
                'qty' => $qty,
                'note' => $note,
                'created_by' => $userId ?? auth()->id(),
            ]);

            $product->increment('stock', $qty);

            return $movement;
        });
    }

    /**
     * Decrease stock (e.g., sold)
     */
    public function decreaseStock(Product $product, int $qty, string $note = '', ?int $userId = null, $refType = null, $refId = null): StockMovement
    {
        return DB::transaction(function () use ($product, $qty, $note, $userId, $refType, $refId) {
            if ($product->stock < $qty) {
                throw new \Exception("Insufficient stock for {$product->name}. Available: {$product->stock}, Requested: {$qty}");
            }

            $movement = StockMovement::create([
                'product_id' => $product->id,
                'type' => 'out',
                'qty' => $qty,
                'note' => $note,
                'ref_type' => $refType,
                'ref_id' => $refId,
                'created_by' => $userId ?? auth()->id(),
            ]);

            $product->decrement('stock', $qty);

            return $movement;
        });
    }

    /**
     * Adjust stock (e.g., stock opname)
     */
    public function adjustStock(Product $product, int $delta, string $note = '', ?int $userId = null): StockMovement
    {
        return DB::transaction(function () use ($product, $delta, $note, $userId) {
            $movement = StockMovement::create([
                'product_id' => $product->id,
                'type' => 'adjust',
                'qty' => abs($delta),
                'note' => $note,
                'created_by' => $userId ?? auth()->id(),
            ]);

            if ($delta > 0) {
                $product->increment('stock', $delta);
            } else {
                $product->decrement('stock', abs($delta));
            }

            return $movement;
        });
    }
}