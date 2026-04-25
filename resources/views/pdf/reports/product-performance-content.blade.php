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
