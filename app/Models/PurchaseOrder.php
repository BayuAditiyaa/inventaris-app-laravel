<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_number',
        'supplier_id',
        'created_by',
        'status',
        'ordered_at',
        'expected_at',
        'received_at',
        'total_amount',
        'notes',
    ];

    protected $casts = [
        'ordered_at' => 'date',
        'expected_at' => 'date',
        'received_at' => 'datetime',
    ];

    protected $appends = [
        'progress_percentage',
        'remaining_items_count',
        'received_items_count',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function isReceived(): bool
    {
        return $this->status === 'received';
    }

    public function isPartiallyReceived(): bool
    {
        return $this->status === 'partial';
    }

    public function getProgressPercentageAttribute(): int
    {
        $ordered = $this->items->sum('qty_ordered');
        $received = $this->items->sum('qty_received');

        if ($ordered === 0) {
            return 0;
        }

        return (int) round(($received / $ordered) * 100);
    }

    public function getRemainingItemsCountAttribute(): int
    {
        return $this->items->sum(fn ($item) => max($item->qty_ordered - $item->qty_received, 0));
    }

    public function getReceivedItemsCountAttribute(): int
    {
        return $this->items->sum('qty_received');
    }
}
