<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out,adjust',
            'qty' => 'required|integer|min:1',
            'adjustment_type' => 'required_if:type,adjust|in:increase,decrease',
            'note' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Product is required',
            'product_id.exists' => 'Selected product does not exist',
            'type.required' => 'Type is required',
            'type.in' => 'Type must be in, out, or adjust',
            'qty.required' => 'Quantity is required',
            'qty.min' => 'Quantity must be at least 1',
            'adjustment_type.required_if' => 'Adjust direction is required for stock adjustments',
            'adjustment_type.in' => 'Adjust direction must be increase or decrease',
        ];
    }
}
