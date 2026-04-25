<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use App\Http\Requests\StoreSaleRequest;
use App\Services\ActivityLogService;
use App\Services\SalesService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SaleController extends Controller
{
    protected SalesService $salesService;

    public function __construct(SalesService $salesService, protected ActivityLogService $activityLogService)
    {
        $this->salesService = $salesService;
    }

    // Create form (cashier screen)
    public function create()
    {
        Gate::authorize('create', Sale::class);

        $products = Product::where('stock', '>', 0)
            ->orderBy('name')
            ->get();
        $customers = Customer::orderBy('name')->get();

        return Inertia::render('Sales/Create', [
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    // Store sale
    public function store(StoreSaleRequest $request)
    {
        Gate::authorize('create', Sale::class);

        try {
            // Create or get customer if provided
            $customerId = null;
            if ($request->customer_name) {
                $customer = $this->salesService->createOrUpdateCustomer(
                    $request->customer_name,
                    $request->customer_phone,
                    $request->customer_address
                );
                $customerId = $customer->id;
            }

            // Create sale
            $sale = $this->salesService->createSale(
                items: $request->items,
                discount: $request->discount ?? 0,
                customerId: $customerId,
                userId: auth()->id()
            );

            $this->activityLogService->log(
                'sale.created',
                "Completed sale {$sale->invoice_no}",
                $sale,
                ['total' => $sale->total, 'customer_id' => $sale->customer_id]
            );

            return redirect()->route('sales.show', $sale)
                ->with('success', 'Sale completed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    // View sale / invoice
    public function show(Sale $sale)
    {
        Gate::authorize('view', $sale);

        $sale->load(['items.product', 'customer', 'user']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }

    public function exportPdf(Sale $sale)
    {
        Gate::authorize('view', $sale);

        $sale->load(['items.product', 'customer', 'user']);

        $company = [
            'name' => 'Breeze Inventory',
            'address' => 'Demo portfolio project for retail and warehouse operations',
            'phone' => '+62 812-0000-0000',
        ];

        $pdf = Pdf::loadHTML($this->buildInvoicePdfHtml($sale, $company))->setPaper('a4');

        return $pdf->download("invoice-{$sale->invoice_no}.pdf");
    }

    private function buildInvoicePdfHtml(Sale $sale, array $company): string
    {
        $rows = '';

        foreach ($sale->items as $item) {
            $rows .= sprintf(
                '<tr><td>%s</td><td>%s</td><td class="text-right">Rp %s</td><td class="text-right">%s</td><td class="text-right">Rp %s</td></tr>',
                e($item->product?->name),
                e($item->product?->sku),
                number_format($item->unit_price, 0, ',', '.'),
                $item->qty,
                number_format($item->line_total, 0, ',', '.')
            );
        }

        $companyName = e($company['name']);
        $companyAddress = e($company['address']);
        $companyPhone = e($company['phone']);
        $invoiceNo = e($sale->invoice_no);
        $soldAt = e($sale->sold_at?->format('d M Y H:i'));
        $customerName = e($sale->customer?->name ?? 'Walk-in Customer');
        $customerPhone = e($sale->customer?->phone ?? '-');
        $customerAddress = e($sale->customer?->address ?? '-');
        $cashierName = e($sale->user?->name ?? '-');
        $subtotal = number_format($sale->subtotal, 0, ',', '.');
        $discount = number_format($sale->discount, 0, ',', '.');
        $total = number_format($sale->total, 0, ',', '.');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {$invoiceNo}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #0f172a; font-size: 12px; line-height: 1.45; }
        .header { border-bottom: 2px solid #cbd5e1; margin-bottom: 20px; padding-bottom: 12px; }
        .title { font-size: 22px; font-weight: 700; margin: 0; }
        .subtitle { color: #475569; margin-top: 6px; }
        .meta { color: #64748b; font-size: 11px; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #e2e8f0; color: #1e293b; text-align: left; padding: 10px; font-size: 11px; }
        td { border-bottom: 1px solid #e2e8f0; padding: 9px 10px; vertical-align: top; }
        .text-right { text-align: right; }
        .muted { color: #64748b; }
        .footer { margin-top: 22px; font-size: 10px; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <div style="float: left; width: 60%;">
            <p class="title">{$companyName}</p>
            <p class="subtitle">{$companyAddress}</p>
            <p class="meta">Phone: {$companyPhone}</p>
        </div>
        <div style="float: right; width: 35%; text-align: right;">
            <p class="title" style="font-size: 20px;">Invoice</p>
            <p class="subtitle">{$invoiceNo}</p>
            <p class="meta">{$soldAt}</p>
        </div>
        <div style="clear: both;"></div>
    </div>

    <table style="margin-bottom: 18px;">
        <tr>
            <td style="width: 50%; border: none; padding-left: 0;">
                <strong>Customer</strong><br>
                {$customerName}<br>
                <span class="muted">{$customerPhone}</span><br>
                <span class="muted">{$customerAddress}</span>
            </td>
            <td style="width: 50%; border: none; padding-right: 0;">
                <strong>Cashier</strong><br>
                {$cashierName}<br>
                <span class="muted">Generated from portfolio demo environment</span>
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>SKU</th>
                <th class="text-right">Price</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            {$rows}
        </tbody>
    </table>

    <table style="margin-top: 18px;">
        <tr>
            <td style="width: 62%; border: none; padding-left: 0;">
                <span class="muted">Thank you for your purchase.</span>
            </td>
            <td style="width: 38%; border: none; padding-right: 0;">
                <table>
                    <tr>
                        <td style="border: none; padding: 6px 0;">Subtotal</td>
                        <td style="border: none; padding: 6px 0;" class="text-right">Rp {$subtotal}</td>
                    </tr>
                    <tr>
                        <td style="border: none; padding: 6px 0;">Discount</td>
                        <td style="border: none; padding: 6px 0;" class="text-right">Rp {$discount}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 2px solid #cbd5e1; padding: 8px 0 0;"><strong>Total</strong></td>
                        <td style="border-top: 2px solid #cbd5e1; padding: 8px 0 0;" class="text-right"><strong>Rp {$total}</strong></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="footer">
        Invoice exported as PDF from the Breeze Inventory portfolio project.
    </div>
</body>
</html>
HTML;
    }

    // List sales
    public function index()
    {
        Gate::authorize('viewAny', Sale::class);

        $sales = Sale::query()
            ->with(['customer', 'user', 'items'])
            ->when(request('date_from'), function ($query) {
                $query->whereDate('sold_at', '>=', request('date_from'));
            })
            ->when(request('date_to'), function ($query) {
                $query->whereDate('sold_at', '<=', request('date_to'));
            })
            ->when(request('customer_id'), function ($query) {
                $query->where('customer_id', request('customer_id'));
            })
            ->orderBy('sold_at', 'desc')
            ->paginate(15);

        $customers = Customer::orderBy('name')->get();

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'customers' => $customers,
            'filters' => [
                'date_from' => request('date_from'),
                'date_to' => request('date_to'),
                'customer_id' => request('customer_id'),
            ],
        ]);
    }
}
