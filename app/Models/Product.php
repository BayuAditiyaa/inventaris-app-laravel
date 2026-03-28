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


    //check if low stock
    public function isLowStock(): bool
    {
        return $this->stock <= $this->stock_alert;
    }
}
