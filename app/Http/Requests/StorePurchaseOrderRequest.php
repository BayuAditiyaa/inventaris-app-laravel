<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'ordered_at' => 'required|date',
            'expected_at' => 'nullable|date|after_or_equal:ordered_at',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id|distinct',
            'items.*.qty_ordered' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|integer|min:1000',
        ];
    }
}
