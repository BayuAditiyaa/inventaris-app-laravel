<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####')),
            'cost' => fake()->numberBetween(10000, 150000),
            'price' => fake()->numberBetween(20000, 250000),
            'stock' => fake()->numberBetween(0, 100),
            'stock_alert' => fake()->numberBetween(3, 15),
            'image_path' => null,
        ];
    }
}
