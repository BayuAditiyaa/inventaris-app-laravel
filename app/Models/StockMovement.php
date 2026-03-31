<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'type', 'qty', 'note', 'ref_type', 'ref_id', 'created_by'];

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Helpers
    public function getTypeLabel(): string
    {
        return match ($this->type) {
            'in' => 'Stock In',
            'out' => 'Stock Out',
            'adjust' => 'Adjustment',
            default => $this->type,
        };
    }

    public function getQtyDisplay(): string
    {
        if ($this->type === 'out' || $this->qty < 0) {
            // Automatically handles the minus sign if qty is already negative,
            // or forces it if type is 'out'
            return $this->qty > 0 ? '-'.$this->qty : (string) $this->qty;
        }

        return '+'.$this->qty;
    }
}
