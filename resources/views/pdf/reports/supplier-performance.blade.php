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
</body>
</html>
