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
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Sales</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">View all sales transactions</p>
                    </div>
                    <Link
                        href="/sales/create"
                        className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all font-medium text-center text-sm md:text-base shadow-md hover:shadow-lg"
                    >
                        + New Sale
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Total Sales (Period)</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            Rp {totalSales.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Total Profit (Period)</p>
                        <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                            Rp {totalProfit.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Transactions (Period)</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-2">{sales.total}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">From Date</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">To Date</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Customer</label>
                            <select
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 text-sm"
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
                                className="w-full px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all font-medium text-sm"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Invoice
                                    </th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                                        Date
                                    </th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                                        Customer
                                    </th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden xl:table-cell">
                                        Cashier
                                    </th>
                                    <th className="px-3 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                                        Items
                                    </th>
                                    <th className="px-3 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Total
                                    </th>
                                    <th className="px-3 md:px-6 py-3 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {sales.data.length > 0 ? (
                                    sales.data.map((sale) => {
                                        const profit = sale.items.reduce((p, item) => {
                                            return p + ((item.unit_price - item.unit_cost) * item.qty);
                                        }, 0);

                                        return (
                                            <tr key={sale.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-3 md:px-6 py-3 md:py-4 font-mono text-xs md:text-sm font-semibold text-gray-900 dark:text-white">
                                                    {sale.invoice_no}
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                                                    {new Date(sale.sold_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                                                    {sale.customer?.name || 'Walk-in'}
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700 dark:text-gray-300 hidden xl:table-cell">
                                                    {sale.user.name}
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                                                    {sale.items.length}
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4 text-right font-semibold text-gray-900 dark:text-white text-xs md:text-sm">
                                                    <div>
                                                        Rp {sale.total.toLocaleString('id-ID')}
                                                    </div>
                                                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                        Profit: Rp {profit.toLocaleString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                                                    <Link
                                                        href={`/sales/${sale.id}`}
                                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all inline-block"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
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