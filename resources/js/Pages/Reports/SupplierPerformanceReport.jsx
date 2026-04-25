import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function SupplierPerformanceReport({ suppliers, summary, filters, auth }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);

    const handleFilter = () => {
        router.get('/reports/supplier-performance', { date_from: dateFrom, date_to: dateTo });
    };

    const exportCsvUrl = `/reports/supplier-performance/export?date_from=${dateFrom}&date_to=${dateTo}`;
    const exportPdfUrl = `/reports/supplier-performance/pdf?date_from=${dateFrom}&date_to=${dateTo}`;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Supplier Performance Report" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Supplier Performance Report</h1>
                        <p className="mt-1 text-gray-600">Evaluate supplier throughput, pending receipts, and procurement value.</p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={exportPdfUrl}
                            className="inline-flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                        >
                            Export PDF
                        </a>
                        <a
                            href={exportCsvUrl}
                            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                        >
                            Export CSV
                        </a>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">From Date</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">To Date</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{summary.total_suppliers}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">PO Value</p>
                        <p className="mt-2 text-3xl font-bold text-blue-600">Rp {Number(summary.total_po_amount || 0).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Pending Units</p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">{summary.total_pending_units}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-gray-600">Avg Received Rate</p>
                        <p className="mt-2 text-3xl font-bold text-green-600">{summary.avg_received_rate}%</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">Supplier Rankings</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Supplier</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">PO Count</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">PO Value</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Received Rate</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Pending Units</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {suppliers.length > 0 ? suppliers.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{supplier.name}</p>
                                            <p className="text-sm text-gray-500">{supplier.phone || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{supplier.contact_person || '-'}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">{supplier.purchase_orders_count}</td>
                                        <td className="px-6 py-4 text-right text-gray-700">Rp {Number(supplier.total_po_amount || 0).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                Number(supplier.received_rate) >= 80
                                                    ? 'bg-green-100 text-green-800'
                                                    : Number(supplier.received_rate) >= 40
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-red-100 text-red-800'
                                            }`}>
                                                {supplier.received_rate}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-amber-600">{supplier.pending_units}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                            No supplier activity found for this period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
