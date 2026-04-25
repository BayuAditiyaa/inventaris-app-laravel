import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

export default function PurchaseOrderIndex({ auth, purchaseOrders, filters }) {
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get('/purchase-orders', { status }, { preserveState: true });
    };

    const statusClasses = {
        ordered: 'bg-amber-100 text-amber-800',
        partial: 'bg-blue-100 text-blue-800',
        received: 'bg-green-100 text-green-800',
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Purchase Orders" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
                        <p className="mt-1 text-gray-600">Monitor procurement activity and incoming inventory.</p>
                    </div>
                    <Link
                        href="/purchase-orders/create"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        + New Purchase Order
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end">
                        <div className="w-full md:max-w-xs">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                <option value="ordered">Ordered</option>
                                <option value="partial">Partial</option>
                                <option value="received">Received</option>
                            </select>
                        </div>
                        <button
                            onClick={handleFilter}
                            className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="divide-y divide-gray-200 lg:hidden">
                        {purchaseOrders.data.length > 0 ? purchaseOrders.data.map((purchaseOrder) => (
                            <div key={purchaseOrder.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="break-words font-mono text-sm font-semibold text-gray-900">{purchaseOrder.po_number}</p>
                                        <p className="mt-1 text-sm text-gray-600">{purchaseOrder.supplier.name}</p>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[purchaseOrder.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {purchaseOrder.status}
                                    </span>
                                </div>

                                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <dt className="font-medium text-gray-500">Ordered</dt>
                                        <dd className="mt-1 text-gray-900">{new Date(purchaseOrder.ordered_at).toLocaleDateString('id-ID')}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-500">Items</dt>
                                        <dd className="mt-1 text-gray-900">{purchaseOrder.items.length}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-500">Progress</dt>
                                        <dd className="mt-1 font-semibold text-gray-900">{purchaseOrder.progress_percentage}%</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-500">Total</dt>
                                        <dd className="mt-1 font-semibold text-gray-900">Rp {purchaseOrder.total_amount.toLocaleString('id-ID')}</dd>
                                    </div>
                                </dl>

                                <Link
                                    href={`/purchase-orders/${purchaseOrder.id}`}
                                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    View Details
                                </Link>
                            </div>
                        )) : (
                            <div className="px-6 py-10 text-center text-gray-500">
                                No purchase orders found.
                            </div>
                        )}
                    </div>

                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">PO Number</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Supplier</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ordered Date</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Items</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Progress</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {purchaseOrders.data.length > 0 ? purchaseOrders.data.map((purchaseOrder) => (
                                    <tr key={purchaseOrder.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{purchaseOrder.po_number}</td>
                                        <td className="px-6 py-4 text-gray-700">{purchaseOrder.supplier.name}</td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {new Date(purchaseOrder.ordered_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-700">{purchaseOrder.items.length}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            Rp {purchaseOrder.total_amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[purchaseOrder.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {purchaseOrder.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {purchaseOrder.progress_percentage}%
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={`/purchase-orders/${purchaseOrder.id}`}
                                                className="inline-flex rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-100"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                                            No purchase orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="text-sm text-gray-600">
                            Showing {purchaseOrders.from || 0} to {purchaseOrders.to || 0} of {purchaseOrders.total || 0}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {purchaseOrders.links.map((link, idx) => (
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="cursor-not-allowed rounded bg-gray-100 px-3 py-1 text-sm text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
