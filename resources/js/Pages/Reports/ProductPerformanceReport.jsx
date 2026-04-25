import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProductPerformanceReport({ bestSelling, mostProfitable, slowMoving, filters, auth }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);

    const handleFilter = () => {
        router.get('/reports/product-performance', { date_from: dateFrom, date_to: dateTo });
    };

    const exportCsvUrl = `/reports/product-performance/export?date_from=${dateFrom}&date_to=${dateTo}`;
    const exportPdfUrl = `/reports/product-performance/pdf?date_from=${dateFrom}&date_to=${dateTo}`;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Product Performance Report" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Performance Report</h1>
                        <p className="text-gray-600 mt-1">Analyze product sales and profitability</p>
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

                {/* Date Filter */}
                <div className="bg-white rounded-lg shadow p-6">
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

                {/* Best Selling Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">🏆 Best Selling Products</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bestSelling.map(item => ({
                            name: item.name,
                            qty: item.total_qty || 0,
                        }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="qty" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Best Selling Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Top 10 Best Sellers</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Qty Sold</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bestSelling.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-600">{item.sku}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {item.total_qty || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-700">
                                            Rp {(item.total_revenue || 0).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Most Profitable Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">💰 Most Profitable Products</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Unit Cost</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Unit Price</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Qty Sold</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Profit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {mostProfitable.map((item) => {
                                    const profit = (item.unit_price - item.unit_cost) * (item.total_qty || 0);
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">{item.sku}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-700">
                                                Rp {item.cost.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-700">
                                                Rp {item.price.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-700">
                                                {item.total_qty || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-green-600">
                                                Rp {profit.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Slow Moving Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">🐌 Slow Moving Products</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Current Stock</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Qty Sold (Period)</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Recommendation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {slowMoving.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-600">{item.sku}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-700">{item.stock} units</td>
                                        <td className="px-6 py-4 text-right font-semibold text-red-600">
                                            {item.total_qty || 0}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                                Consider Discount
                                            </span>
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
