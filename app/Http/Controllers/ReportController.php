<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Sale;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class ReportController extends Controller
{
    // Sales Report
    public function salesReport()
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        // Total sales by date
        $salesByDate = Sale::query()
            ->selectRaw('DATE(sold_at) as date, COUNT(*) as count, SUM(total) as total, SUM(discount) as discount')
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        // Sales by customer
        $salesByCustomer = Sale::query()
            ->with('customer')
            ->selectRaw('customer_id, COUNT(*) as count, SUM(total) as total')
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('customer_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        // Sales by cashier
        $salesByCashier = Sale::query()
            ->with('user')
            ->selectRaw('user_id, COUNT(*) as count, SUM(total) as total')
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->get();

        // Overall summary
        $summary = Sale::query()
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->selectRaw('COUNT(*) as total_transactions, SUM(subtotal) as total_subtotal, SUM(discount) as total_discount, SUM(total) as total_revenue')
            ->first();

        // Calculate total profit
        $totalProfit = Sale::query()
            ->with('items')
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->get()
            ->sum(function ($sale) {
                return $sale->items->sum(function ($item) {
                    return ($item->unit_price - $item->unit_cost) * $item->qty;
                });
            });

        return Inertia::render('Reports/SalesReport', [
            'salesByDate' => $salesByDate,
            'salesByCustomer' => $salesByCustomer,
            'salesByCashier' => $salesByCashier,
            'summary' => $summary,
            'totalProfit' => $totalProfit,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    // Low Stock Report
    public function lowStockReport()
    {
        Gate::authorize('viewReports');

        $products = Product::query()
            ->whereRaw('stock <= stock_alert')
            ->orderBy('stock')
            ->paginate(20);

        $stats = Product::query()
            ->whereRaw('stock <= stock_alert')
            ->selectRaw('COUNT(*) as count, SUM(stock) as total_stock, SUM(stock_alert) as total_alert')
            ->first();

        return Inertia::render('Reports/LowStockReport', [
            'products' => $products,
            'stats' => $stats,
        ]);
    }

    // Product Performance Report
    public function productPerformanceReport()
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        // Best selling products
        $bestSelling = Product::query()
            ->with('stockMovements')
            ->selectRaw('products.id, products.name, products.sku, products.price, products.cost, SUM(sale_items.qty) as total_qty, SUM(sale_items.line_total) as total_revenue')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.price', 'products.cost')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        // Most profitable products
        $mostProfitable = Product::query()
            ->selectRaw('products.id, products.name, products.sku, products.price, products.cost, SUM(sale_items.qty) as total_qty, SUM(sale_items.line_total) as total_revenue')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.price', 'products.cost')
            ->havingRaw('SUM(sale_items.qty) > 0')
            ->orderByRaw('SUM(sale_items.line_total) - (SUM(sale_items.qty) * products.cost) DESC')
            ->limit(10)
            ->get();

        // Slow moving products
        $slowMoving = Product::query()
            ->selectRaw('products.id, products.name, products.sku, products.stock, COALESCE(SUM(CASE WHEN sales.id IS NOT NULL THEN sale_items.qty ELSE 0 END), 0) as total_qty')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('sales', function ($join) use ($dateFrom, $dateTo) {
                $join->on('sale_items.sale_id', '=', 'sales.id')
                    ->whereBetween('sales.sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);
            })
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.stock')
            ->havingRaw('COALESCE(SUM(CASE WHEN sales.id IS NOT NULL THEN sale_items.qty ELSE 0 END), 0) < 5')
            ->orderBy('total_qty')
            ->limit(10)
            ->get();

        return Inertia::render('Reports/ProductPerformanceReport', [
            'bestSelling' => $bestSelling,
            'mostProfitable' => $mostProfitable,
            'slowMoving' => $slowMoving,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function exportSalesReport(): StreamedResponse
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        $rows = Sale::query()
            ->with(['customer', 'user'])
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->orderByDesc('sold_at')
            ->get()
            ->map(fn (Sale $sale) => [
                'invoice_no' => $sale->invoice_no,
                'date' => $sale->sold_at?->toDateTimeString(),
                'customer' => $sale->customer?->name ?? 'Walk-in',
                'cashier' => $sale->user?->name,
                'subtotal' => $sale->subtotal,
                'discount' => $sale->discount,
                'total' => $sale->total,
            ])
            ->all();

        return $this->streamCsvDownload(
            'sales-report.csv',
            ['Invoice No', 'Date', 'Customer', 'Cashier', 'Subtotal', 'Discount', 'Total'],
            $rows
        );
    }

    public function exportSalesReportPdf()
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        $sales = Sale::query()
            ->with(['customer', 'user'])
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->orderByDesc('sold_at')
            ->get();

        $summary = Sale::query()
            ->whereBetween('sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->selectRaw('COUNT(*) as total_transactions, SUM(subtotal) as total_subtotal, SUM(discount) as total_discount, SUM(total) as total_revenue')
            ->first();

        return Pdf::loadHTML($this->buildSalesReportPdfHtml($sales, $summary, $dateFrom, $dateTo))
            ->setPaper('a4', 'landscape')
            ->download("sales-report-{$dateFrom}-{$dateTo}.pdf");
    }

    public function exportLowStockReport(): StreamedResponse
    {
        Gate::authorize('viewReports');

        $rows = Product::query()
            ->whereRaw('stock <= stock_alert')
            ->orderBy('stock')
            ->get()
            ->map(fn (Product $product) => [
                'name' => $product->name,
                'sku' => $product->sku,
                'stock' => $product->stock,
                'stock_alert' => $product->stock_alert,
                'gap' => max($product->stock_alert - $product->stock, 0),
            ])
            ->all();

        return $this->streamCsvDownload(
            'low-stock-report.csv',
            ['Product', 'SKU', 'Current Stock', 'Alert Level', 'Gap'],
            $rows
        );
    }

    public function exportLowStockReportPdf()
    {
        Gate::authorize('viewReports');

        $products = Product::query()
            ->whereRaw('stock <= stock_alert')
            ->orderBy('stock')
            ->get()
            ->map(function (Product $product) {
                return [
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'stock' => $product->stock,
                    'stock_alert' => $product->stock_alert,
                    'gap' => max($product->stock_alert - $product->stock, 0),
                ];
            });

        $stats = Product::query()
            ->whereRaw('stock <= stock_alert')
            ->selectRaw('COUNT(*) as count, SUM(stock) as total_stock, SUM(stock_alert) as total_alert')
            ->first();

        return Pdf::loadHTML($this->buildLowStockReportPdfHtml($products->all(), $stats))
            ->setPaper('a4', 'landscape')
            ->download('low-stock-report.pdf');
    }

    public function exportProductPerformanceReport(): StreamedResponse
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        $rows = Product::query()
            ->selectRaw('products.name, products.sku, products.stock, products.cost, products.price, COALESCE(SUM(sale_items.qty), 0) as total_qty, COALESCE(SUM(sale_items.line_total), 0) as total_revenue')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('sales', function ($join) use ($dateFrom, $dateTo) {
                $join->on('sale_items.sale_id', '=', 'sales.id')
                    ->whereBetween('sales.sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);
            })
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.stock', 'products.cost', 'products.price')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(fn ($row) => [
                'name' => $row->name,
                'sku' => $row->sku,
                'stock' => $row->stock,
                'qty_sold' => $row->total_qty,
                'revenue' => $row->total_revenue,
                'profit' => ($row->price - $row->cost) * $row->total_qty,
            ])
            ->all();

        return $this->streamCsvDownload(
            'product-performance-report.csv',
            ['Product', 'SKU', 'Current Stock', 'Qty Sold', 'Revenue', 'Profit'],
            $rows
        );
    }

    public function exportProductPerformanceReportPdf()
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        $products = Product::query()
            ->selectRaw('products.name, products.sku, products.stock, products.cost, products.price, COALESCE(SUM(sale_items.qty), 0) as total_qty, COALESCE(SUM(sale_items.line_total), 0) as total_revenue')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('sales', function ($join) use ($dateFrom, $dateTo) {
                $join->on('sale_items.sale_id', '=', 'sales.id')
                    ->whereBetween('sales.sold_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);
            })
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.stock', 'products.cost', 'products.price')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(function ($row) {
                return [
                    'name' => $row->name,
                    'sku' => $row->sku,
                    'stock' => $row->stock,
                    'qty_sold' => $row->total_qty,
                    'revenue' => $row->total_revenue,
                    'profit' => ($row->price - $row->cost) * $row->total_qty,
                ];
            });

        return Pdf::loadHTML($this->buildProductPerformancePdfHtml($products->all(), $dateFrom, $dateTo))
            ->setPaper('a4', 'landscape')
            ->download("product-performance-report-{$dateFrom}-{$dateTo}.pdf");
    }

    public function supplierPerformanceReport()
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        $suppliers = $this->buildSupplierPerformanceQuery($dateFrom, $dateTo)->get();

        $summary = [
            'total_suppliers' => $suppliers->count(),
            'total_po_amount' => $suppliers->sum('total_po_amount'),
            'total_pending_units' => $suppliers->sum('pending_units'),
            'avg_received_rate' => (int) round($suppliers->avg('received_rate') ?? 0),
        ];

        return Inertia::render('Reports/SupplierPerformanceReport', [
            'suppliers' => $suppliers,
            'summary' => $summary,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function exportSupplierPerformanceReport(): StreamedResponse
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        $rows = $this->buildSupplierPerformanceQuery($dateFrom, $dateTo)
            ->get()
            ->map(fn ($supplier) => [
                'supplier' => $supplier->name,
                'contact_person' => $supplier->contact_person,
                'purchase_orders' => $supplier->purchase_orders_count,
                'total_amount' => $supplier->total_po_amount,
                'ordered_units' => $supplier->ordered_units,
                'received_units' => $supplier->received_units,
                'pending_units' => $supplier->pending_units,
                'received_rate' => $supplier->received_rate,
            ])
            ->all();

        return $this->streamCsvDownload(
            'supplier-performance-report.csv',
            ['Supplier', 'Contact Person', 'Purchase Orders', 'Total Amount', 'Ordered Units', 'Received Units', 'Pending Units', 'Received Rate (%)'],
            $rows
        );
    }

    public function exportSupplierPerformanceReportPdf()
    {
        Gate::authorize('viewReports');

        [$dateFrom, $dateTo] = $this->resolveDateRange();

        $suppliers = $this->buildSupplierPerformanceQuery($dateFrom, $dateTo)->get();

        $summary = [
            'total_suppliers' => $suppliers->count(),
            'total_po_amount' => $suppliers->sum('total_po_amount'),
            'total_pending_units' => $suppliers->sum('pending_units'),
            'avg_received_rate' => (int) round($suppliers->avg('received_rate') ?? 0),
        ];

        return Pdf::loadHTML($this->buildSupplierPerformancePdfHtml($suppliers->all(), $summary, $dateFrom, $dateTo))
            ->setPaper('a4', 'landscape')
            ->download("supplier-performance-report-{$dateFrom}-{$dateTo}.pdf");
    }

    private function buildSupplierPerformanceQuery(string $dateFrom, string $dateTo)
    {
        return Supplier::query()
            ->leftJoin('purchase_orders', function ($join) use ($dateFrom, $dateTo) {
                $join->on('suppliers.id', '=', 'purchase_orders.supplier_id')
                    ->whereBetween('purchase_orders.ordered_at', [$dateFrom, $dateTo]);
            })
            ->leftJoin('purchase_order_items', 'purchase_orders.id', '=', 'purchase_order_items.purchase_order_id')
            ->selectRaw('
                suppliers.id,
                suppliers.name,
                suppliers.contact_person,
                suppliers.phone,
                COUNT(DISTINCT purchase_orders.id) as purchase_orders_count,
                COALESCE(SUM(purchase_orders.total_amount), 0) as total_po_amount,
                COALESCE(SUM(purchase_order_items.qty_ordered), 0) as ordered_units,
                COALESCE(SUM(purchase_order_items.qty_received), 0) as received_units,
                COALESCE(SUM(purchase_order_items.qty_ordered - purchase_order_items.qty_received), 0) as pending_units,
                CASE
                    WHEN COALESCE(SUM(purchase_order_items.qty_ordered), 0) = 0 THEN 0
                    ELSE ROUND((COALESCE(SUM(purchase_order_items.qty_received), 0) / COALESCE(SUM(purchase_order_items.qty_ordered), 0)) * 100, 0)
                END as received_rate
            ')
            ->groupBy('suppliers.id', 'suppliers.name', 'suppliers.contact_person', 'suppliers.phone')
            ->orderByDesc('total_po_amount');
    }

    private function resolveDateRange(): array
    {
        return [
            request('date_from') ?? now()->subDays(30)->toDateString(),
            request('date_to') ?? now()->toDateString(),
        ];
    }

    private function formatPeriodLabel(string $dateFrom, string $dateTo): string
    {
        return sprintf(
            '%s - %s',
            \Illuminate\Support\Carbon::parse($dateFrom)->format('d M Y'),
            \Illuminate\Support\Carbon::parse($dateTo)->format('d M Y')
        );
    }

    private function buildSalesReportPdfHtml($sales, $summary, string $dateFrom, string $dateTo): string
    {
        $rows = '';

        foreach ($sales as $sale) {
            $rows .= sprintf(
                '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td class="text-right">Rp %s</td><td class="text-right">Rp %s</td><td class="text-right">Rp %s</td></tr>',
                e($sale->invoice_no),
                e($sale->sold_at?->format('d M Y H:i')),
                e($sale->customer?->name ?? 'Walk-in'),
                e($sale->user?->name ?? '-'),
                number_format($sale->subtotal, 0, ',', '.'),
                number_format($sale->discount, 0, ',', '.'),
                number_format($sale->total, 0, ',', '.')
            );
        }

        $table = $this->renderPdfTable(
            ['Invoice', 'Date', 'Customer', 'Cashier', 'Subtotal', 'Discount', 'Total'],
            $rows ?: '<tr><td colspan="7" class="muted">No sales data found for this period.</td></tr>'
        );

        return $this->renderPdfDocument(
            'Sales Report',
            $this->formatPeriodLabel($dateFrom, $dateTo),
            [
                ['Transactions', (string) ($summary->total_transactions ?? 0)],
                ['Subtotal', 'Rp ' . number_format($summary->total_subtotal ?? 0, 0, ',', '.')],
                ['Discount', 'Rp ' . number_format($summary->total_discount ?? 0, 0, ',', '.')],
                ['Revenue', 'Rp ' . number_format($summary->total_revenue ?? 0, 0, ',', '.')],
            ],
            $table
        );
    }

    private function buildLowStockReportPdfHtml(array $products, $stats): string
    {
        $rows = '';

        foreach ($products as $product) {
            $rows .= sprintf(
                '<tr><td>%s</td><td>%s</td><td class="text-right">%s</td><td class="text-right">%s</td><td class="text-right">%s</td></tr>',
                e($product['name']),
                e($product['sku']),
                $product['stock'],
                $product['stock_alert'],
                $product['gap']
            );
        }

        $table = $this->renderPdfTable(
            ['Product', 'SKU', 'Current Stock', 'Alert Level', 'Gap'],
            $rows ?: '<tr><td colspan="5" class="muted">No low-stock products found.</td></tr>'
        );

        return $this->renderPdfDocument(
            'Low Stock Report',
            'Products that need replenishment soon',
            [
                ['Low Stock Products', (string) ($stats->count ?? 0)],
                ['Current Stock Total', (string) ($stats->total_stock ?? 0)],
                ['Alert Threshold Total', (string) ($stats->total_alert ?? 0)],
                ['Restock Gap', (string) collect($products)->sum('gap')],
            ],
            $table
        );
    }

    private function buildProductPerformancePdfHtml(array $products, string $dateFrom, string $dateTo): string
    {
        $rows = '';

        foreach ($products as $product) {
            $rows .= sprintf(
                '<tr><td>%s</td><td>%s</td><td class="text-right">%s</td><td class="text-right">%s</td><td class="text-right">Rp %s</td><td class="text-right">Rp %s</td></tr>',
                e($product['name']),
                e($product['sku']),
                $product['stock'],
                $product['qty_sold'],
                number_format($product['revenue'], 0, ',', '.'),
                number_format($product['profit'], 0, ',', '.')
            );
        }

        $table = $this->renderPdfTable(
            ['Product', 'SKU', 'Current Stock', 'Qty Sold', 'Revenue', 'Profit'],
            $rows ?: '<tr><td colspan="6" class="muted">No product performance data found for this period.</td></tr>'
        );

        return $this->renderPdfDocument(
            'Product Performance Report',
            $this->formatPeriodLabel($dateFrom, $dateTo),
            [
                ['Tracked Products', (string) count($products)],
                ['Qty Sold', (string) collect($products)->sum('qty_sold')],
                ['Revenue', 'Rp ' . number_format(collect($products)->sum('revenue'), 0, ',', '.')],
                ['Profit', 'Rp ' . number_format(collect($products)->sum('profit'), 0, ',', '.')],
            ],
            $table
        );
    }

    private function buildSupplierPerformancePdfHtml(array $suppliers, array $summary, string $dateFrom, string $dateTo): string
    {
        $rows = '';

        foreach ($suppliers as $supplier) {
            $rows .= sprintf(
                '<tr><td>%s<br><span class="muted">%s</span></td><td>%s</td><td class="text-right">%s</td><td class="text-right">Rp %s</td><td class="text-right">%s</td><td class="text-right">%s</td><td class="text-right">%s</td><td class="text-right">%s%%</td></tr>',
                e($supplier->name),
                e($supplier->phone ?? '-'),
                e($supplier->contact_person ?? '-'),
                $supplier->purchase_orders_count,
                number_format($supplier->total_po_amount, 0, ',', '.'),
                $supplier->ordered_units,
                $supplier->received_units,
                $supplier->pending_units,
                $supplier->received_rate
            );
        }

        $table = $this->renderPdfTable(
            ['Supplier', 'Contact Person', 'PO Count', 'PO Value', 'Ordered Units', 'Received Units', 'Pending Units', 'Received Rate'],
            $rows ?: '<tr><td colspan="8" class="muted">No supplier activity found for this period.</td></tr>'
        );

        return $this->renderPdfDocument(
            'Supplier Performance Report',
            $this->formatPeriodLabel($dateFrom, $dateTo),
            [
                ['Active Suppliers', (string) $summary['total_suppliers']],
                ['PO Value', 'Rp ' . number_format($summary['total_po_amount'], 0, ',', '.')],
                ['Pending Units', (string) $summary['total_pending_units']],
                ['Avg Received Rate', $summary['avg_received_rate'] . '%'],
            ],
            $table
        );
    }

    private function renderPdfDocument(string $title, string $subtitle, array $cards, string $content): string
    {
        $cardHtml = '';

        foreach ($cards as [$label, $value]) {
            $cardHtml .= sprintf(
                '<div class="card"><div class="card-label">%s</div><div class="card-value">%s</div></div>',
                e($label),
                e($value)
            );
        }

        $generatedAt = now()->format('d M Y H:i');
        $styles = $this->pdfStyles();

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{$title}</title>
    <style>{$styles}</style>
</head>
<body>
    <div class="header">
        <p class="title">{$title}</p>
        <p class="subtitle">{$subtitle}</p>
        <p class="meta">Generated at {$generatedAt}</p>
    </div>
    <div class="cards">{$cardHtml}</div>
    {$content}
</body>
</html>
HTML;
    }

    private function renderPdfTable(array $headers, string $rows): string
    {
        $headerHtml = '';

        foreach ($headers as $header) {
            $align = in_array($header, ['Subtotal', 'Discount', 'Total', 'Current Stock', 'Alert Level', 'Gap', 'Qty Sold', 'Revenue', 'Profit', 'PO Count', 'PO Value', 'Ordered Units', 'Received Units', 'Pending Units', 'Received Rate'], true)
                ? ' class="text-right"'
                : '';
            $headerHtml .= '<th' . $align . '>' . e($header) . '</th>';
        }

        return "<table><thead><tr>{$headerHtml}</tr></thead><tbody>{$rows}</tbody></table>";
    }

    private function pdfStyles(): string
    {
        return 'body { font-family: DejaVu Sans, sans-serif; color: #0f172a; font-size: 12px; line-height: 1.45; }
            .header { border-bottom: 2px solid #cbd5e1; margin-bottom: 20px; padding-bottom: 12px; }
            .title { font-size: 22px; font-weight: 700; margin: 0; }
            .subtitle { color: #475569; margin-top: 6px; }
            .meta { color: #64748b; font-size: 11px; margin-top: 4px; }
            .cards { margin: 16px 0 20px; }
            .card { display: inline-block; vertical-align: top; width: 23%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; margin-right: 1%; box-sizing: border-box; }
            .card-label { font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
            .card-value { font-size: 18px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #e2e8f0; color: #1e293b; text-align: left; padding: 10px; font-size: 11px; }
            td { border-bottom: 1px solid #e2e8f0; padding: 9px 10px; vertical-align: top; }
            .text-right { text-align: right; }
            .muted { color: #64748b; }';
    }

    private function streamCsvDownload(string $filename, array $headers, array $rows): StreamedResponse
    {
        return response()->streamDownload(function () use ($headers, $rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $headers);

            foreach ($rows as $row) {
                fputcsv($handle, array_values($row));
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
