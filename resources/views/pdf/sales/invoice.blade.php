<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $sale->invoice_no }}</title>
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
            <p class="title">{{ $company['name'] }}</p>
            <p class="subtitle">{{ $company['address'] }}</p>
            <p class="meta">Phone: {{ $company['phone'] }}</p>
        </div>
        <div style="float: right; width: 35%; text-align: right;">
            <p class="title" style="font-size: 20px;">Invoice</p>
            <p class="subtitle">{{ $sale->invoice_no }}</p>
            <p class="meta">{{ $sale->sold_at?->format('d M Y H:i') }}</p>
        </div>
        <div style="clear: both;"></div>
    </div>

    <table style="margin-bottom: 18px;">
        <tr>
            <td style="width: 50%; border: none; padding-left: 0;">
                <strong>Customer</strong><br>
                {{ $sale->customer?->name ?? 'Walk-in Customer' }}<br>
                <span class="muted">{{ $sale->customer?->phone ?? '-' }}</span><br>
                <span class="muted">{{ $sale->customer?->address ?? '-' }}</span>
            </td>
            <td style="width: 50%; border: none; padding-right: 0;">
                <strong>Cashier</strong><br>
                {{ $sale->user?->name }}<br>
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
            @foreach ($sale->items as $item)
                <tr>
                    <td>{{ $item->product?->name }}</td>
                    <td>{{ $item->product?->sku }}</td>
                    <td class="text-right">Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                    <td class="text-right">{{ $item->qty }}</td>
                    <td class="text-right">Rp {{ number_format($item->line_total, 0, ',', '.') }}</td>
                </tr>
            @endforeach
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
                        <td style="border: none; padding: 6px 0;" class="text-right">Rp {{ number_format($sale->subtotal, 0, ',', '.') }}</td>
                    </tr>
                    <tr>
                        <td style="border: none; padding: 6px 0;">Discount</td>
                        <td style="border: none; padding: 6px 0;" class="text-right">Rp {{ number_format($sale->discount, 0, ',', '.') }}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 2px solid #cbd5e1; padding: 8px 0 0;"><strong>Total</strong></td>
                        <td style="border-top: 2px solid #cbd5e1; padding: 8px 0 0;" class="text-right"><strong>Rp {{ number_format($sale->total, 0, ',', '.') }}</strong></td>
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
