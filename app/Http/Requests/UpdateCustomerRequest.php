<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $customerId = $this->route('customer')->id;

        return [
            'name' => 'required|string|max:255|unique:customers,name,' . $customerId,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Customer name is required',
            'name.unique' => 'This customer name already exists',
        ];
    }
}