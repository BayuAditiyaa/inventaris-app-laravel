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
            'name' => $this->faker->words(3, true),
            'sku' => strtoupper($this->faker->unique()->bothify('SKU-####')),
            'cost' => $this->faker->numberBetween(10000, 150000),
            'price' => $this->faker->numberBetween(20000, 250000),
            'stock' => $this->faker->numberBetween(0, 100),
            'stock_alert' => $this->faker->numberBetween(3, 15),
            'image_path' => null,
        ];
    }
}
