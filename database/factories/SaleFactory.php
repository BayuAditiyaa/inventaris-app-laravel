<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_no' => 'INV-TEST-'.Str::upper(fake()->unique()->bothify('####')),
            'customer_id' => Customer::factory(),
            'user_id' => User::factory(),
            'sold_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'subtotal' => 100000,
            'discount' => 0,
            'total' => 100000,
        ];
    }
}
