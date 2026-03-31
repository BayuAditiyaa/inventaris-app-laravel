<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //

    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'cost',
        'price',
        'stock',
        'stock_alert',
        'image_path',
    ];

    // Relationships
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

        // Format price to IDR (with commas and Rp)
    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function getFormattedCostAttribute()
    {
        return 'Rp ' . number_format($this->cost, 0, ',', '.');
    }


    //check if low stock
    public function isLowStock(): bool
    {
        return $this->stock <= $this->stock_alert;
    }
}
