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
