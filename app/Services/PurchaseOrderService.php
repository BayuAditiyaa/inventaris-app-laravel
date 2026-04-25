<?php

namespace App\Services;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PurchaseOrderService
{
    public function __construct(protected InventoryServices $inventoryService)
    {
    }

    public function createPurchaseOrder(array $payload, int $userId): PurchaseOrder
    {
        return DB::transaction(function () use ($payload, $userId) {
            $items = [];
            $totalAmount = 0;

            foreach ($payload['items'] as $item) {
                $lineTotal = $item['qty_ordered'] * $item['unit_cost'];
                $totalAmount += $lineTotal;

                $items[] = [
                    'product_id' => $item['product_id'],
                    'qty_ordered' => $item['qty_ordered'],
                    'qty_received' => 0,
                    'unit_cost' => $item['unit_cost'],
                    'line_total' => $lineTotal,
                ];
            }

            $purchaseOrder = PurchaseOrder::create([
                'po_number' => $this->generatePurchaseOrderNumber(),
                'supplier_id' => $payload['supplier_id'],
                'created_by' => $userId,
                'status' => 'ordered',
                'ordered_at' => $payload['ordered_at'],
                'expected_at' => $payload['expected_at'] ?? null,
                'notes' => $payload['notes'] ?? null,
                'total_amount' => $totalAmount,
            ]);

            foreach ($items as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    ...$item,
                ]);
            }

            return $purchaseOrder->load(['supplier', 'items.product', 'creator']);
        });
    }

    public function receivePurchaseOrder(PurchaseOrder $purchaseOrder, array $receivedItems, int $userId): PurchaseOrder
    {
        return DB::transaction(function () use ($purchaseOrder, $receivedItems, $userId) {
            $purchaseOrder->loadMissing('items.product');

            if ($purchaseOrder->isReceived()) {
                throw new \Exception('Purchase order has already been received.');
            }

            $mappedItems = collect($receivedItems)->keyBy('id');
            $receivedSomething = false;

            foreach ($purchaseOrder->items as $item) {
                $payload = $mappedItems->get($item->id);

                if (! $payload) {
                    continue;
                }

                $qtyToReceive = (int) $payload['qty_received'];
                $remainingQty = $item->qty_ordered - $item->qty_received;

                if ($qtyToReceive < 0) {
                    throw new \Exception('Received quantity cannot be negative.');
                }

                if ($qtyToReceive > $remainingQty) {
                    throw new \Exception("Received quantity for {$item->product->name} exceeds remaining quantity.");
                }

                if ($qtyToReceive === 0) {
                    continue;
                }

                /** @var Product $product */
                $product = $item->product;

                $this->inventoryService->increaseStock(
                    $product,
                    $qtyToReceive,
                    "Receive {$purchaseOrder->po_number}",
                    $userId,
                    'purchase_order',
                    $purchaseOrder->id
                );

                $item->update([
                    'qty_received' => $item->qty_received + $qtyToReceive,
                ]);

                $receivedSomething = true;
            }

            if (! $receivedSomething) {
                throw new \Exception('Please receive at least one item quantity.');
            }

            $purchaseOrder->refresh()->load('items');
            $hasRemaining = $purchaseOrder->items->contains(fn ($item) => $item->qty_received < $item->qty_ordered);

            $purchaseOrder->update([
                'status' => $hasRemaining ? 'partial' : 'received',
                'received_at' => $hasRemaining ? $purchaseOrder->received_at : now(),
            ]);

            return $purchaseOrder->fresh(['supplier', 'items.product', 'creator']);
        });
    }

    private function generatePurchaseOrderNumber(): string
    {
        do {
            $purchaseOrderNumber = 'PO-'.now()->format('Ymd').'-'.Str::upper(Str::random(5));
        } while (PurchaseOrder::where('po_number', $purchaseOrderNumber)->exists());

        return $purchaseOrderNumber;
    }
}
