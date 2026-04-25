import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast } from 'sonner';

export default function ShowPurchaseOrder({ auth, purchaseOrder }) {
    const [receiptItems, setReceiptItems] = useState(
        purchaseOrder.items.map((item) => ({
            id: item.id,
            qty_received: item.qty_ordered - item.qty_received,
        }))
    );

    const handleReceive = () => {
        if (!confirm(`Process receiving for ${purchaseOrder.po_number}?`)) {
            return;
        }

        router.post(`/purchase-orders/${purchaseOrder.id}/receive`, {
            items: receiptItems,
        }, {
            onSuccess: () => toast.success('Purchase order received successfully!'),
            onError: (errors) => toast.error(errors.error || 'Failed to receive purchase order'),
        });
    };

    const updateReceiptQty = (itemId, value) => {
        setReceiptItems((current) => current.map((item) => (
            item.id === itemId
                ? { ...item, qty_received: Number(value) || 0 }
                : item
        )));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={purchaseOrder.po_number} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{purchaseOrder.po_number}</h1>
                        <p className="mt-1 text-gray-600">Supplier: {purchaseOrder.supplier.name}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        {purchaseOrder.status !== 'received' && (
                            <button
                                type="button"
                                onClick={handleReceive}
                                className="rounded-lg bg-green-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-green-700"
                            >
                                Save Receipt
                            </button>
                        )}
                        <Link
                            href="/purchase-orders"
                            className="rounded-lg bg-gray-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-gray-700"
                        >
                            Back
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <p className="mt-2 text-xl font-bold capitalize text-gray-900 sm:text-2xl">{purchaseOrder.status}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Ordered Date</p>
                        <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                            {new Date(purchaseOrder.ordered_at).toLocaleDateString('id-ID')}
                        </p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Expected Arrival</p>
                        <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                            {purchaseOrder.expected_at
                                ? new Date(purchaseOrder.expected_at).toLocaleDateString('id-ID')
                                : '-'}
                        </p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Total Amount</p>
                        <p className="mt-2 break-words text-xl font-bold text-blue-600 sm:text-2xl">
                            Rp {purchaseOrder.total_amount.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Received Units</p>
                        <p className="mt-2 text-2xl font-bold text-green-600">{purchaseOrder.received_items_count}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Remaining Units</p>
                        <p className="mt-2 text-2xl font-bold text-amber-600">{purchaseOrder.remaining_items_count}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Receipt Progress</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{purchaseOrder.progress_percentage}%</p>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Details</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Created By</p>
                            <p className="mt-1 text-gray-900">{purchaseOrder.creator.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Received At</p>
                            <p className="mt-1 text-gray-900">
                                {purchaseOrder.received_at ? new Date(purchaseOrder.received_at).toLocaleString('id-ID') : '-'}
                            </p>
                        </div>
                    </div>
                    {purchaseOrder.notes && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-500">Notes</p>
                            <p className="mt-1 text-gray-800">{purchaseOrder.notes}</p>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">Ordered Items</h2>
                    </div>
                    <div className="divide-y divide-gray-200 lg:hidden">
                        {purchaseOrder.items.map((item) => {
                            const remainingQty = Math.max(item.qty_ordered - item.qty_received, 0);
                            const receiptItem = receiptItems.find((value) => value.id === item.id);

                            return (
                                <div key={item.id} className="p-4">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                                        <p className="mt-1 text-sm text-gray-500">{item.product.sku}</p>
                                    </div>

                                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <dt className="font-medium text-gray-500">Ordered</dt>
                                            <dd className="mt-1 text-gray-900">{item.qty_ordered}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Received</dt>
                                            <dd className="mt-1 text-gray-900">{item.qty_received}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Remaining</dt>
                                            <dd className="mt-1 font-semibold text-amber-600">{remainingQty}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Unit Cost</dt>
                                            <dd className="mt-1 text-gray-900">Rp {item.unit_cost.toLocaleString('id-ID')}</dd>
                                        </div>
                                    </dl>

                                    {purchaseOrder.status !== 'received' && (
                                        <label className="mt-4 block text-sm font-medium text-gray-700">
                                            Receive Now
                                            <input
                                                type="number"
                                                min="0"
                                                max={remainingQty}
                                                value={receiptItem?.qty_received ?? 0}
                                                onChange={(e) => updateReceiptQty(item.id, e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </label>
                                    )}

                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
                                        <span className="font-medium text-gray-500">Line Total</span>
                                        <span className="font-semibold text-gray-900">Rp {item.line_total.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Qty Ordered</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Qty Received</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Remaining</th>
                                    {purchaseOrder.status !== 'received' && (
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Receive Now</th>
                                    )}
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Unit Cost</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Line Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {purchaseOrder.items.map((item) => {
                                    const remainingQty = Math.max(item.qty_ordered - item.qty_received, 0);
                                    const receiptItem = receiptItems.find((value) => value.id === item.id);

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">{item.product.sku}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-700">{item.qty_ordered}</td>
                                            <td className="px-6 py-4 text-right text-gray-700">{item.qty_received}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-amber-600">{remainingQty}</td>
                                            {purchaseOrder.status !== 'received' && (
                                                <td className="px-6 py-4 text-right">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={remainingQty}
                                                        value={receiptItem?.qty_received ?? 0}
                                                        onChange={(e) => updateReceiptQty(item.id, e.target.value)}
                                                        className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                            )}
                                            <td className="px-6 py-4 text-right text-gray-700">Rp {item.unit_cost.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                                Rp {item.line_total.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
