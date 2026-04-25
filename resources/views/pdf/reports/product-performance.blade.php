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
            <div class="card-label">Tracked Products</div>
            <div class="card-value">{{ $products->count() }}</div>
        </div>
        <div class="card">
            <div class="card-label">Qty Sold</div>
            <div class="card-value">{{ $products->sum('qty_sold') }}</div>
        </div>
        <div class="card">
            <div class="card-label">Revenue</div>
            <div class="card-value">Rp {{ number_format($products->sum('revenue'), 0, ',', '.') }}</div>
        </div>
        <div class="card">
            <div class="card-label">Profit</div>
            <div class="card-value">Rp {{ number_format($products->sum('profit'), 0, ',', '.') }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>SKU</th>
                <th class="text-right">Current Stock</th>
                <th class="text-right">Qty Sold</th>
                <th class="text-right">Revenue</th>
                <th class="text-right">Profit</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($products as $product)
                <tr>
                    <td>{{ $product['name'] }}</td>
                    <td>{{ $product['sku'] }}</td>
                    <td class="text-right">{{ $product['stock'] }}</td>
                    <td class="text-right">{{ $product['qty_sold'] }}</td>
                    <td class="text-right">Rp {{ number_format($product['revenue'], 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($product['profit'], 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="muted">No product performance data found for this period.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
