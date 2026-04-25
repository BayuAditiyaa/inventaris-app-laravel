<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\SaleItem;
use App\Models\Sale;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SaleItem>
 */
class SaleItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qty = $this->faker->numberBetween(1, 5);
        $unitPrice = $this->faker->numberBetween(20000, 100000);
        $unitCost = $this->faker->numberBetween(10000, $unitPrice);

        return [
            'sale_id' => Sale::factory(),
            'product_id' => Product::factory(),
            'qty' => $qty,
            'unit_price' => $unitPrice,
            'unit_cost' => $unitCost,
            'line_total' => $qty * $unitPrice,
        ];
    }
}
