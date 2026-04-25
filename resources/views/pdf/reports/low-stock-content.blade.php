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
