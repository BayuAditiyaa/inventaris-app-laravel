import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesReport({ salesByDate, salesByCustomer, salesByCashier, summary, totalProfit, filters, auth }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);

    const handleFilter = () => {
        router.get('/reports/sales', { date_from: dateFrom, date_to: dateTo });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sales Report" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Report</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Track your sales performance and trends</p>
                </div>

                {/* Date Filter */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards - PERFECT RESPONSIVE GRID APPLIED HERE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{summary?.total_transactions || 0}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2 truncate">
                            Rp {(summary?.total_revenue || 0).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Discount</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-2 truncate">
                            Rp {(summary?.total_discount || 0).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Profit</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2 truncate">
                            Rp {totalProfit.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales by Date */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h2>
                        <div className="-ml-4 sm:ml-0">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={salesByDate.map(item => ({
                                    date: new Date(item.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                                    total: item.total,
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                                    <YAxis tick={{fontSize: 12}} width={80} tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Customers */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
                        <div className="-ml-4 sm:ml-0">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={salesByCustomer.map(item => ({
                                    name: item.customer?.name || 'Walk-in',
                                    total: item.total,
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                                    <YAxis tick={{fontSize: 12}} width={80} tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                    <Bar dataKey="total" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Sales by Cashier Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Sales by Cashier</h2>
                    </div>
                    {/* Notice overflow-x-auto is no longer strictly necessary because we hide columns! */}
                    <div className="w-full">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Cashier</th>
                                    
                                    {/* HIDDEN ON MOBILE, VISIBLE ON TABLET (sm) AND UP */}
                                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-right text-sm font-semibold text-gray-700">Transactions</th>
                                    
                                    <th className="px-4 sm:px-6 py-3 text-right text-sm font-semibold text-gray-700">Revenue</th>
                                    
                                    {/* HIDDEN ON MOBILE AND TABLET, VISIBLE ON DESKTOP (md) AND UP */}
                                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-right text-sm font-semibold text-gray-700">Avg per Transaction</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {salesByCashier.map((item) => (
                                    <tr key={item.user_id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">
                                            {item.user.name}
                                            {/* Mobile-only fallback data so the user still sees it! */}
                                            <div className="sm:hidden text-xs text-gray-500 mt-1">
                                                {item.count} transactions
                                            </div>
                                        </td>
                                        
                                        {/* HIDDEN ON MOBILE */}
                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-right text-gray-700">
                                            {item.count}
                                        </td>
                                        
                                        <td className="px-4 sm:px-6 py-4 text-right font-semibold text-gray-900">
                                            Rp {item.total.toLocaleString('id-ID')}
                                        </td>
                                        
                                        {/* HIDDEN ON MOBILE & TABLET */}
                                        <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-right text-gray-700">
                                            Rp {(item.total / item.count).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}