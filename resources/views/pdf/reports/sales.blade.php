<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #0f172a; font-size: 12px; line-height: 1.45; }
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
        .muted { color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <p class="title">{{ $title }}</p>
        <p class="subtitle">Period: {{ $periodLabel }}</p>
        <p class="meta">Generated at {{ now()->format('d M Y H:i') }}</p>
    </div>

    <div class="cards">
        <div class="card">
            <div class="card-label">Transactions</div>
            <div class="card-value">{{ $summary->total_transactions ?? 0 }}</div>
        </div>
        <div class="card">
            <div class="card-label">Subtotal</div>
            <div class="card-value">Rp {{ number_format($summary->total_subtotal ?? 0, 0, ',', '.') }}</div>
        </div>
        <div class="card">
            <div class="card-label">Discount</div>
            <div class="card-value">Rp {{ number_format($summary->total_discount ?? 0, 0, ',', '.') }}</div>
        </div>
        <div class="card">
            <div class="card-label">Revenue</div>
            <div class="card-value">Rp {{ number_format($summary->total_revenue ?? 0, 0, ',', '.') }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Cashier</th>
                <th class="text-right">Subtotal</th>
                <th class="text-right">Discount</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($sales as $sale)
                <tr>
                    <td>{{ $sale->invoice_no }}</td>
                    <td>{{ $sale->sold_at?->format('d M Y H:i') }}</td>
                    <td>{{ $sale->customer?->name ?? 'Walk-in' }}</td>
                    <td>{{ $sale->user?->name ?? '-' }}</td>
                    <td class="text-right">Rp {{ number_format($sale->subtotal, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($sale->discount, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($sale->total, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="muted">No sales data found for this period.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
