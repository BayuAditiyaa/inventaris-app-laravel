<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'discount' => 'nullable|integer|min:0',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'customer_address' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Add at least one product to the sale',
            'items.*.product_id.required' => 'Product is required',
            'items.*.product_id.exists' => 'Selected product does not exist',
            'items.*.qty.required' => 'Quantity is required',
            'items.*.qty.min' => 'Quantity must be at least 1',
        ];
    }
}