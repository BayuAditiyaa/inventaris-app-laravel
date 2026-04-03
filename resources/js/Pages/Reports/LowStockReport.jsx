import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductPerformanceReport({ bestSelling, mostProfitable, slowMoving, filters, auth }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);

    const handleFilter = () => {
        router.get('/reports/product-performance', { date_from: dateFrom, date_to: dateTo });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Product Performance Report" />

            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="px-2 sm:px-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Performance</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Analyze product sales and profitability</p>
                </div>

                {/* Date Filter */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">From Date</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">To Date</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-end mt-2 sm:mt-0 sm:col-span-2 md:col-span-1">
                            <button
                                onClick={handleFilter}
                                className="w-full px-4 py-2 sm:py-3 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Best Selling Chart */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">🏆 Best Selling Products</h2>
                    <div className="w-full overflow-hidden -ml-4 sm:ml-0">
                        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                            <BarChart data={bestSelling.map(item => ({
                                name: item.name,
                                qty: item.total_qty || 0,
                            }))} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                {/* Adjusted angle and height for mobile */}
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{fontSize: 11}} />
                                <YAxis tick={{fontSize: 12}} width={40} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} />
                                <Bar dataKey="qty" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Selling Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top 10 Best Sellers</h3>
                    </div>
                    <div className="w-full">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Product</th>
                                    {/* Hide Qty on Mobile */}
                                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Qty Sold</th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bestSelling.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">{item.sku}</p>
                                            {/* Mobile Fallback */}
                                            <div className="sm:hidden text-xs text-blue-600 mt-1 font-medium">
                                                {item.total_qty || 0} units sold
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-900 text-sm sm:text-base">
                                            {item.total_qty || 0}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-right text-gray-700 text-sm sm:text-base whitespace-nowrap">
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
                    <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">💰 Most Profitable</h3>
                    </div>
                    <div className="w-full">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Product</th>
                                    {/* Hide detailed costs on Mobile/Tablet */}
                                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Unit Cost</th>
                                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Unit Price</th>
                                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Qty Sold</th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Profit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {mostProfitable.map((item) => {
                                    // FIXED MATH BUG: Using item.price and item.cost
                                    const profit = (item.price - item.cost) * (item.total_qty || 0);
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-600">{item.sku}</p>
                                                {/* Mobile Fallback: Shows quantity sold on tiny screens */}
                                                <div className="sm:hidden text-xs text-gray-500 mt-1">
                                                    {item.total_qty || 0} units sold
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-right text-gray-700 text-sm sm:text-base whitespace-nowrap">
                                                Rp {item.cost.toLocaleString('id-ID')}
                                            </td>
                                            <td className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-right text-gray-700 text-sm sm:text-base whitespace-nowrap">
                                                Rp {item.price.toLocaleString('id-ID')}
                                            </td>
                                            <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-right text-gray-700 text-sm sm:text-base">
                                                {item.total_qty || 0}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-bold text-green-600 text-sm sm:text-base whitespace-nowrap">
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
                    <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">🐌 Slow Moving Products</h3>
                    </div>
                    <div className="w-full">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Product</th>
                                    {/* Hide stats on mobile, put them under the name */}
                                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Current Stock</th>
                                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Qty Sold</th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {slowMoving.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">{item.sku}</p>
                                            {/* Mobile Fallback */}
                                            <div className="sm:hidden flex items-center gap-3 text-xs text-gray-500 mt-2">
                                                <span>Stock: <strong className="text-gray-700">{item.stock}</strong></span>
                                                <span>Sold: <strong className="text-red-600">{item.total_qty || 0}</strong></span>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-right text-gray-700 text-sm sm:text-base">
                                            {item.stock}
                                        </td>
                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-red-600 text-sm sm:text-base">
                                            {item.total_qty || 0}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap">
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