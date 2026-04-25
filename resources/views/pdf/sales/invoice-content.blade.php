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
