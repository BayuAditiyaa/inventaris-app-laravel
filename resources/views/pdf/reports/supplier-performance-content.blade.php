<div class="header">
    <p class="title">{{ $title }}</p>
    <p class="subtitle">Period: {{ $periodLabel }}</p>
    <p class="meta">Generated at {{ now()->format('d M Y H:i') }}</p>
</div>

<div class="cards">
    <div class="card">
        <div class="card-label">Active Suppliers</div>
        <div class="card-value">{{ $summary['total_suppliers'] }}</div>
    </div>
    <div class="card">
        <div class="card-label">PO Value</div>
        <div class="card-value">Rp {{ number_format($summary['total_po_amount'], 0, ',', '.') }}</div>
    </div>
    <div class="card">
        <div class="card-label">Pending Units</div>
        <div class="card-value">{{ $summary['total_pending_units'] }}</div>
    </div>
    <div class="card">
        <div class="card-label">Avg Received Rate</div>
        <div class="card-value">{{ $summary['avg_received_rate'] }}%</div>
    </div>
</div>

<table>
    <thead>
        <tr>
            <th>Supplier</th>
            <th>Contact Person</th>
            <th class="text-right">PO Count</th>
            <th class="text-right">PO Value</th>
            <th class="text-right">Ordered Units</th>
            <th class="text-right">Received Units</th>
            <th class="text-right">Pending Units</th>
            <th class="text-right">Received Rate</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($suppliers as $supplier)
            <tr>
                <td>
                    {{ $supplier->name }}<br>
                    <span class="muted">{{ $supplier->phone ?? '-' }}</span>
                </td>
                <td>{{ $supplier->contact_person ?? '-' }}</td>
                <td class="text-right">{{ $supplier->purchase_orders_count }}</td>
                <td class="text-right">Rp {{ number_format($supplier->total_po_amount, 0, ',', '.') }}</td>
                <td class="text-right">{{ $supplier->ordered_units }}</td>
                <td class="text-right">{{ $supplier->received_units }}</td>
                <td class="text-right">{{ $supplier->pending_units }}</td>
                <td class="text-right">{{ $supplier->received_rate }}%</td>
            </tr>
        @empty
            <tr>
                <td colspan="8" class="muted">No supplier activity found for this period.</td>
            </tr>
        @endforelse
    </tbody>
</table>
