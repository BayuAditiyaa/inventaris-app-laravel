import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

export default function SalesIndex({ sales, customers, filters, auth }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [customerId, setCustomerId] = useState(filters.customer_id || '');

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (customerId) params.append('customer_id', customerId);

        router.get(`/sales?${params.toString()}`);
    };

    // Calculate totals for display
    const totalSales = sales.data.reduce((sum, sale) => sum + sale.total, 0);
    const totalProfit = sales.data.reduce((sum, sale) => sum + sale.profit, 0);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sales" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
                        <p className="text-gray-600 mt-1">View all sales transactions</p>
                    </div>
                    <Link
                        href="/sales/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + New Sale
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Sales (Period)</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            Rp {totalSales.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Profit (Period)</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                            Rp {totalProfit.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Transactions (Period)</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{sales.meta.total}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Customer</label>
                            <select
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Cashier
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sales.data.length > 0 ? (
                                    sales.data.map((sale) => {
                                        return (
                                            <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">
                                                    {sale.invoice_no}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {new Date(sale.sold_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {sale.customer?.name || 'Walk-in'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">{sale.user.name}</td>
                                                <td className="px-6 py-4 text-right text-gray-700">
                                                    {sale.items.length} item(s)
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                                    <div>Rp {sale.total.toLocaleString('id-ID')}</div>
                                                    <div className="text-xs text-green-600 font-medium">
                                                        Profit: Rp {sale.profit.toLocaleString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={`/sales/${sale.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors inline-block"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No sales found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {sales.from || 0} to {sales.to || 0} of {sales.total}
                        </div>
                        <div className="space-x-1 flex">
                            {sales.links.map((link, idx) => (
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`px-3 py-1 text-sm rounded transition-colors ${link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-400 cursor-not-allowed"
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