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
        <p class="subtitle">Products that need replenishment soon</p>
        <p class="meta">Generated at {{ $generatedAt->format('d M Y H:i') }}</p>
    </div>

    <div class="cards">
        <div class="card">
            <div class="card-label">Low Stock Products</div>
            <div class="card-value">{{ $stats->count ?? 0 }}</div>
        </div>
        <div class="card">
            <div class="card-label">Current Stock Total</div>
            <div class="card-value">{{ $stats->total_stock ?? 0 }}</div>
        </div>
        <div class="card">
            <div class="card-label">Alert Threshold Total</div>
            <div class="card-value">{{ $stats->total_alert ?? 0 }}</div>
        </div>
        <div class="card">
            <div class="card-label">Restock Gap</div>
            <div class="card-value">{{ collect($products)->sum('gap') }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>SKU</th>
                <th class="text-right">Current Stock</th>
                <th class="text-right">Alert Level</th>
                <th class="text-right">Gap</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($products as $product)
                <tr>
                    <td>{{ $product['name'] }}</td>
                    <td>{{ $product['sku'] }}</td>
                    <td class="text-right">{{ $product['stock'] }}</td>
                    <td class="text-right">{{ $product['stock_alert'] }}</td>
                    <td class="text-right">{{ $product['gap'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="muted">No low-stock products found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
