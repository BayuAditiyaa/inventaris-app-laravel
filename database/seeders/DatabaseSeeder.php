<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Customer;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Sale;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\InventoryServices;
use App\Services\PurchaseOrderService;
use App\Services\SalesService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    protected InventoryServices $inventoryService;

    protected SalesService $salesService;

    protected PurchaseOrderService $purchaseOrderService;

    protected ActivityLogService $activityLogService;

    protected User $admin;

    protected User $staff;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->inventoryService = app(InventoryServices::class);
        $this->salesService = app(SalesService::class);
        $this->purchaseOrderService = app(PurchaseOrderService::class);
        $this->activityLogService = app(ActivityLogService::class);

        ActivityLog::query()->delete();
        StockMovement::query()->delete();
        PurchaseOrderItem::query()->delete();
        PurchaseOrder::query()->delete();
        Sale::query()->delete();
        Customer::query()->delete();
        Supplier::query()->delete();
        Product::query()->delete();
        User::query()->delete();

        [$this->admin, $this->staff] = $this->seedUsers();
        $suppliers = $this->seedSuppliers();
        $products = $this->seedProducts();
        $customers = $this->seedCustomers();

        $this->seedPurchaseOrders($suppliers, $products);
        $this->seedSales($products, $customers);
        $this->seedAdjustments($products);
        $this->seedActivityLogs($products, $customers, $suppliers);
    }

    private function seedUsers(): array
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Super Admin',
            'email' => 'admin@breezeinventory.test',
            'password' => Hash::make('password123'),
        ]);

        $staff = User::factory()->staff()->create([
            'name' => 'Staff Member',
            'email' => 'staff@breezeinventory.test',
            'password' => Hash::make('password123'),
        ]);

        return [$admin, $staff];
    }

    private function seedSuppliers()
    {
        return collect([
            [
                'name' => 'PT Nusantara Elektronik',
                'contact_person' => 'Rizky Pratama',
                'email' => 'rizky@nusantara-elektronik.test',
                'phone' => '0812-1111-2222',
                'address' => 'Jl. Sudirman No. 18, Jakarta',
            ],
            [
                'name' => 'CV Sinar Retail Supply',
                'contact_person' => 'Dina Permata',
                'email' => 'dina@sinar-retail.test',
                'phone' => '0813-2222-3333',
                'address' => 'Jl. Riau No. 44, Bandung',
            ],
            [
                'name' => 'PT Atlas Office Goods',
                'contact_person' => 'Andi Saputra',
                'email' => 'andi@atlas-office.test',
                'phone' => '0814-3333-4444',
                'address' => 'Jl. Pemuda No. 12, Surabaya',
            ],
            [
                'name' => 'CV Delta Packaging',
                'contact_person' => 'Maya Lestari',
                'email' => 'maya@delta-packaging.test',
                'phone' => '0815-4444-5555',
                'address' => 'Jl. Gajah Mada No. 25, Semarang',
            ],
            [
                'name' => 'PT Prima Tools & Parts',
                'contact_person' => 'Bagus Setiawan',
                'email' => 'bagus@prima-tools.test',
                'phone' => '0816-5555-6666',
                'address' => 'Jl. Diponegoro No. 30, Yogyakarta',
            ],
        ])->map(fn (array $supplier) => Supplier::create($supplier));
    }

    private function seedProducts()
    {
        $catalog = [
            ['name' => 'Wireless Barcode Scanner', 'sku' => 'INV-SCN-001', 'cost' => 185000, 'price' => 265000, 'stock_alert' => 8, 'initial_stock' => 26],
            ['name' => 'USB Receipt Printer', 'sku' => 'INV-PRN-002', 'cost' => 420000, 'price' => 590000, 'stock_alert' => 4, 'initial_stock' => 12],
            ['name' => 'Thermal Label Roll', 'sku' => 'INV-LBL-003', 'cost' => 18000, 'price' => 35000, 'stock_alert' => 20, 'initial_stock' => 90],
            ['name' => 'Portable Cash Drawer', 'sku' => 'INV-CDR-004', 'cost' => 275000, 'price' => 390000, 'stock_alert' => 5, 'initial_stock' => 14],
            ['name' => 'A4 Paper Box', 'sku' => 'INV-PPR-005', 'cost' => 42000, 'price' => 65000, 'stock_alert' => 18, 'initial_stock' => 45],
            ['name' => 'Mini Label Printer', 'sku' => 'INV-MLP-006', 'cost' => 210000, 'price' => 325000, 'stock_alert' => 6, 'initial_stock' => 18],
            ['name' => 'POS Tablet Stand', 'sku' => 'INV-STD-007', 'cost' => 92000, 'price' => 155000, 'stock_alert' => 7, 'initial_stock' => 22],
            ['name' => 'Heavy Duty Cutter', 'sku' => 'INV-CTR-008', 'cost' => 28000, 'price' => 55000, 'stock_alert' => 10, 'initial_stock' => 28],
            ['name' => 'Packaging Tape Bundle', 'sku' => 'INV-TPE-009', 'cost' => 22000, 'price' => 40000, 'stock_alert' => 14, 'initial_stock' => 40],
            ['name' => 'LED Shelf Display', 'sku' => 'INV-LDS-010', 'cost' => 145000, 'price' => 235000, 'stock_alert' => 5, 'initial_stock' => 11],
            ['name' => 'Portable Label Gun', 'sku' => 'INV-LGN-011', 'cost' => 65000, 'price' => 99000, 'stock_alert' => 8, 'initial_stock' => 16],
            ['name' => 'Inventory Count Clipboard', 'sku' => 'INV-CLP-012', 'cost' => 17000, 'price' => 32000, 'stock_alert' => 12, 'initial_stock' => 35],
        ];

        return collect($catalog)->map(function (array $item, int $index) {
            $product = Product::create([
                'name' => $item['name'],
                'sku' => $item['sku'],
                'cost' => $item['cost'],
                'price' => $item['price'],
                'stock' => 0,
                'stock_alert' => $item['stock_alert'],
                'image_path' => null,
            ]);

            $movement = $this->inventoryService->increaseStock(
                $product,
                $item['initial_stock'],
                'Initial stock seeding',
                $this->admin->id,
                'seed',
                $product->id
            );

            $movement->timestamps = false;
            $movement->update([
                'created_at' => Carbon::now()->subDays(35 - $index),
                'updated_at' => Carbon::now()->subDays(35 - $index),
            ]);

            return $product->fresh();
        });
    }

    private function seedCustomers()
    {
        return collect([
            ['name' => 'Toko Sukses Makmur', 'phone' => '0817-1000-2000', 'address' => 'Jl. Veteran No. 10, Jakarta'],
            ['name' => 'Rina Wijaya', 'phone' => '0817-1000-2001', 'address' => 'Jl. Melati No. 8, Bekasi'],
            ['name' => 'CV Citra Stationery', 'phone' => '0817-1000-2002', 'address' => 'Jl. Ahmad Yani No. 14, Bogor'],
            ['name' => 'Dapur Kopi Pagi', 'phone' => '0817-1000-2003', 'address' => 'Jl. Asia Afrika No. 55, Bandung'],
            ['name' => 'Fahmi Hidayat', 'phone' => '0817-1000-2004', 'address' => 'Jl. Kartini No. 21, Depok'],
            ['name' => 'Nadira Store', 'phone' => '0817-1000-2005', 'address' => 'Jl. Raya Serpong No. 30, Tangerang'],
            ['name' => 'Klinik Sehat Sentosa', 'phone' => '0817-1000-2006', 'address' => 'Jl. Siliwangi No. 7, Sukabumi'],
            ['name' => 'Arga Logistics', 'phone' => '0817-1000-2007', 'address' => 'Jl. Raya Cikarang No. 19, Bekasi'],
        ])->map(fn (array $customer) => Customer::create($customer));
    }

    private function seedPurchaseOrders($suppliers, $products): void
    {
        $supplierMap = $suppliers->keyBy('name');
        $productMap = $products->keyBy('sku');

        $purchaseOrders = [
            [
                'supplier' => 'PT Nusantara Elektronik',
                'ordered_at' => Carbon::now()->subDays(28)->toDateString(),
                'expected_at' => Carbon::now()->subDays(24)->toDateString(),
                'received_by' => $this->admin->id,
                'receive_plan' => 'full',
                'items' => [
                    ['sku' => 'INV-SCN-001', 'qty_ordered' => 10, 'unit_cost' => 182000],
                    ['sku' => 'INV-PRN-002', 'qty_ordered' => 6, 'unit_cost' => 415000],
                ],
            ],
            [
                'supplier' => 'CV Sinar Retail Supply',
                'ordered_at' => Carbon::now()->subDays(18)->toDateString(),
                'expected_at' => Carbon::now()->subDays(13)->toDateString(),
                'received_by' => $this->admin->id,
                'receive_plan' => 'partial',
                'items' => [
                    ['sku' => 'INV-LBL-003', 'qty_ordered' => 120, 'unit_cost' => 17000],
                    ['sku' => 'INV-TPE-009', 'qty_ordered' => 60, 'unit_cost' => 21000],
                ],
            ],
            [
                'supplier' => 'PT Atlas Office Goods',
                'ordered_at' => Carbon::now()->subDays(14)->toDateString(),
                'expected_at' => Carbon::now()->subDays(8)->toDateString(),
                'received_by' => $this->staff->id,
                'receive_plan' => 'full',
                'items' => [
                    ['sku' => 'INV-PPR-005', 'qty_ordered' => 40, 'unit_cost' => 41000],
                    ['sku' => 'INV-CLP-012', 'qty_ordered' => 24, 'unit_cost' => 16000],
                ],
            ],
            [
                'supplier' => 'CV Delta Packaging',
                'ordered_at' => Carbon::now()->subDays(9)->toDateString(),
                'expected_at' => Carbon::now()->subDays(2)->toDateString(),
                'received_by' => $this->admin->id,
                'receive_plan' => 'partial-heavy',
                'items' => [
                    ['sku' => 'INV-CTR-008', 'qty_ordered' => 30, 'unit_cost' => 26000],
                    ['sku' => 'INV-LGN-011', 'qty_ordered' => 20, 'unit_cost' => 62000],
                ],
            ],
            [
                'supplier' => 'PT Prima Tools & Parts',
                'ordered_at' => Carbon::now()->subDays(4)->toDateString(),
                'expected_at' => Carbon::now()->addDay()->toDateString(),
                'received_by' => null,
                'receive_plan' => 'pending',
                'items' => [
                    ['sku' => 'INV-STD-007', 'qty_ordered' => 16, 'unit_cost' => 88000],
                    ['sku' => 'INV-LDS-010', 'qty_ordered' => 10, 'unit_cost' => 138000],
                ],
            ],
            [
                'supplier' => 'PT Nusantara Elektronik',
                'ordered_at' => Carbon::now()->subDays(2)->toDateString(),
                'expected_at' => Carbon::now()->addDays(3)->toDateString(),
                'received_by' => null,
                'receive_plan' => 'pending',
                'items' => [
                    ['sku' => 'INV-MLP-006', 'qty_ordered' => 8, 'unit_cost' => 205000],
                    ['sku' => 'INV-CDR-004', 'qty_ordered' => 6, 'unit_cost' => 268000],
                ],
            ],
        ];

        foreach ($purchaseOrders as $index => $definition) {
            $purchaseOrder = $this->purchaseOrderService->createPurchaseOrder([
                'supplier_id' => $supplierMap[$definition['supplier']]->id,
                'ordered_at' => $definition['ordered_at'],
                'expected_at' => $definition['expected_at'],
                'notes' => 'Auto-seeded procurement data for dashboard demo.',
                'items' => collect($definition['items'])->map(fn (array $item) => [
                    'product_id' => $productMap[$item['sku']]->id,
                    'qty_ordered' => $item['qty_ordered'],
                    'unit_cost' => $item['unit_cost'],
                ])->all(),
            ], $this->admin->id);

            if ($definition['receive_plan'] !== 'pending') {
                $payload = $purchaseOrder->items->map(function (PurchaseOrderItem $item) use ($definition) {
                    $receivedQty = match ($definition['receive_plan']) {
                        'full' => $item->qty_ordered,
                        'partial' => max((int) floor($item->qty_ordered * 0.6), 1),
                        'partial-heavy' => max((int) floor($item->qty_ordered * 0.8), 1),
                        default => 0,
                    };

                    return [
                        'id' => $item->id,
                        'qty_received' => $receivedQty,
                    ];
                })->all();

                $purchaseOrder = $this->purchaseOrderService->receivePurchaseOrder(
                    $purchaseOrder,
                    $payload,
                    $definition['received_by'] ?? $this->admin->id
                );
            }

            $orderedAt = Carbon::parse($definition['ordered_at']);
            $purchaseOrder->timestamps = false;
            $purchaseOrder->update([
                'created_at' => $orderedAt->copy()->startOfDay()->addHours(9 + $index),
                'updated_at' => ($purchaseOrder->received_at ?? $orderedAt)->copy()->endOfDay(),
            ]);

            StockMovement::query()
                ->where('ref_type', 'purchase_order')
                ->where('ref_id', $purchaseOrder->id)
                ->get()
                ->each(function (StockMovement $movement) use ($orderedAt, $index) {
                    $movement->timestamps = false;
                    $movement->update([
                        'created_at' => $orderedAt->copy()->addDays(2)->setTime(10 + $index, 15),
                        'updated_at' => $orderedAt->copy()->addDays(2)->setTime(10 + $index, 15),
                    ]);
                });
        }
    }

    private function seedSales($products, $customers): void
    {
        $productMap = $products->keyBy('sku');
        $customerMap = $customers->keyBy('name');

        $sales = [
            ['days_ago' => 21, 'customer' => 'Toko Sukses Makmur', 'cashier' => $this->staff->id, 'discount' => 15000, 'items' => [['sku' => 'INV-LBL-003', 'qty' => 12], ['sku' => 'INV-TPE-009', 'qty' => 6]]],
            ['days_ago' => 18, 'customer' => 'Rina Wijaya', 'cashier' => $this->staff->id, 'discount' => 0, 'items' => [['sku' => 'INV-CTR-008', 'qty' => 4], ['sku' => 'INV-CLP-012', 'qty' => 5]]],
            ['days_ago' => 16, 'customer' => 'CV Citra Stationery', 'cashier' => $this->admin->id, 'discount' => 25000, 'items' => [['sku' => 'INV-PPR-005', 'qty' => 10], ['sku' => 'INV-STD-007', 'qty' => 3]]],
            ['days_ago' => 14, 'customer' => 'Dapur Kopi Pagi', 'cashier' => $this->staff->id, 'discount' => 10000, 'items' => [['sku' => 'INV-LGN-011', 'qty' => 4], ['sku' => 'INV-LBL-003', 'qty' => 8]]],
            ['days_ago' => 12, 'customer' => 'Fahmi Hidayat', 'cashier' => $this->staff->id, 'discount' => 0, 'items' => [['sku' => 'INV-SCN-001', 'qty' => 2], ['sku' => 'INV-MLP-006', 'qty' => 1]]],
            ['days_ago' => 10, 'customer' => 'Nadira Store', 'cashier' => $this->admin->id, 'discount' => 30000, 'items' => [['sku' => 'INV-PRN-002', 'qty' => 2], ['sku' => 'INV-CDR-004', 'qty' => 2]]],
            ['days_ago' => 8, 'customer' => 'Klinik Sehat Sentosa', 'cashier' => $this->staff->id, 'discount' => 5000, 'items' => [['sku' => 'INV-PPR-005', 'qty' => 6], ['sku' => 'INV-TPE-009', 'qty' => 10]]],
            ['days_ago' => 7, 'customer' => 'Arga Logistics', 'cashier' => $this->admin->id, 'discount' => 15000, 'items' => [['sku' => 'INV-SCN-001', 'qty' => 3], ['sku' => 'INV-STD-007', 'qty' => 2]]],
            ['days_ago' => 5, 'customer' => null, 'cashier' => $this->staff->id, 'discount' => 0, 'items' => [['sku' => 'INV-LBL-003', 'qty' => 18], ['sku' => 'INV-CTR-008', 'qty' => 6]]],
            ['days_ago' => 4, 'customer' => 'Toko Sukses Makmur', 'cashier' => $this->staff->id, 'discount' => 20000, 'items' => [['sku' => 'INV-LDS-010', 'qty' => 2], ['sku' => 'INV-LGN-011', 'qty' => 4]]],
            ['days_ago' => 3, 'customer' => 'Dapur Kopi Pagi', 'cashier' => $this->admin->id, 'discount' => 0, 'items' => [['sku' => 'INV-MLP-006', 'qty' => 2], ['sku' => 'INV-LBL-003', 'qty' => 10]]],
            ['days_ago' => 2, 'customer' => 'CV Citra Stationery', 'cashier' => $this->staff->id, 'discount' => 35000, 'items' => [['sku' => 'INV-PPR-005', 'qty' => 12], ['sku' => 'INV-TPE-009', 'qty' => 12], ['sku' => 'INV-CLP-012', 'qty' => 8]]],
            ['days_ago' => 1, 'customer' => 'Nadira Store', 'cashier' => $this->staff->id, 'discount' => 15000, 'items' => [['sku' => 'INV-SCN-001', 'qty' => 2], ['sku' => 'INV-PRN-002', 'qty' => 1], ['sku' => 'INV-LDS-010', 'qty' => 1]]],
            ['days_ago' => 0, 'customer' => null, 'cashier' => $this->admin->id, 'discount' => 0, 'items' => [['sku' => 'INV-CTR-008', 'qty' => 5], ['sku' => 'INV-LBL-003', 'qty' => 14], ['sku' => 'INV-TPE-009', 'qty' => 6]]],
        ];

        foreach ($sales as $index => $definition) {
            $sale = $this->salesService->createSale(
                collect($definition['items'])->map(fn (array $item) => [
                    'product_id' => $productMap[$item['sku']]->id,
                    'qty' => $item['qty'],
                ])->all(),
                $definition['discount'],
                $definition['customer'] ? $customerMap[$definition['customer']]->id : null,
                $definition['cashier']
            );

            $soldAt = Carbon::now()->subDays($definition['days_ago'])->setTime(9 + ($index % 6), 20);
            $sale->timestamps = false;
            $sale->update([
                'sold_at' => $soldAt,
                'created_at' => $soldAt,
                'updated_at' => $soldAt,
            ]);

            StockMovement::query()
                ->where('ref_type', 'sale')
                ->where('ref_id', $sale->id)
                ->get()
                ->each(function (StockMovement $movement) use ($soldAt) {
                    $movement->timestamps = false;
                    $movement->update([
                        'created_at' => $soldAt,
                        'updated_at' => $soldAt,
                    ]);
                });
        }
    }

    private function seedAdjustments($products): void
    {
        $adjustments = [
            ['sku' => 'INV-LDS-010', 'delta' => -3, 'days_ago' => 6, 'note' => 'Display unit damaged during shelf setup'],
            ['sku' => 'INV-STD-007', 'delta' => -4, 'days_ago' => 4, 'note' => 'Cycle count correction after warehouse audit'],
            ['sku' => 'INV-CDR-004', 'delta' => -7, 'days_ago' => 1, 'note' => 'Urgent stock opname correction before reorder'],
            ['sku' => 'INV-PRN-002', 'delta' => -11, 'days_ago' => 3, 'note' => 'Returned damaged units after QC review'],
            ['sku' => 'INV-MLP-006', 'delta' => -9, 'days_ago' => 2, 'note' => 'Pulled items for service replacement program'],
        ];

        $productMap = $products->keyBy('sku');

        foreach ($adjustments as $adjustment) {
            $product = $productMap[$adjustment['sku']]->fresh();

            $movement = $this->inventoryService->adjustStock(
                $product,
                $adjustment['delta'],
                $adjustment['note'],
                $this->admin->id
            );

            $timestamp = Carbon::now()->subDays($adjustment['days_ago'])->setTime(16, 45);
            $movement->timestamps = false;
            $movement->update([
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ]);
        }
    }

    private function seedActivityLogs($products, $customers, $suppliers): void
    {
        $latestSale = Sale::query()->latest('sold_at')->first();
        $latestPurchaseOrder = PurchaseOrder::query()->whereIn('status', ['partial', 'received'])->latest('ordered_at')->first();
        $latestLowStockProduct = Product::query()->whereColumn('stock', '<=', 'stock_alert')->orderBy('stock')->first();

        $logs = [
            [
                'action' => 'product.seeded',
                'description' => 'Seeded curated product catalog for demo data.',
                'subject' => $products->first(),
                'properties' => ['count' => $products->count()],
                'user_id' => $this->admin->id,
            ],
            [
                'action' => 'customer.seeded',
                'description' => 'Imported repeat customer profiles for demo sales history.',
                'subject' => $customers->first(),
                'properties' => ['count' => $customers->count()],
                'user_id' => $this->staff->id,
            ],
            [
                'action' => 'supplier.seeded',
                'description' => 'Prepared supplier directory with procurement-ready contacts.',
                'subject' => $suppliers->first(),
                'properties' => ['count' => $suppliers->count()],
                'user_id' => $this->admin->id,
            ],
            [
                'action' => 'purchase-order.received',
                'description' => 'Processed supplier receipts to demonstrate partial receiving.',
                'subject' => $latestPurchaseOrder,
                'properties' => ['open_purchase_orders' => PurchaseOrder::query()->whereIn('status', ['ordered', 'partial'])->count()],
                'user_id' => $this->admin->id,
            ],
            [
                'action' => 'sale.created',
                'description' => 'Recorded seeded sales transactions for dashboard and reporting demos.',
                'subject' => $latestSale,
                'properties' => ['total_sales' => Sale::query()->count()],
                'user_id' => $this->staff->id,
            ],
            [
                'action' => 'stock.alert',
                'description' => 'Flagged low-stock products that need replenishment follow-up.',
                'subject' => $latestLowStockProduct,
                'properties' => ['low_stock_items' => Product::query()->whereColumn('stock', '<=', 'stock_alert')->count()],
                'user_id' => $this->admin->id,
            ],
        ];

        foreach ($logs as $index => $log) {
            $entry = $this->activityLogService->log(
                $log['action'],
                $log['description'],
                $log['subject'],
                $log['properties'],
                $log['user_id']
            );

            $timestamp = Carbon::now()->subDays(5 - min($index, 5))->setTime(8 + $index, 10);
            $entry->timestamps = false;
            $entry->update([
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ]);
        }
    }
}
