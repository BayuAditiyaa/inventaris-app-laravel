import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ExclamationIcon } from '@heroicons/react/24/outline';

export default function LowStockReport({ products, stats, auth }) {
    const getStockStatus = (stock, alert) => {
        if (stock === 0) return { color: 'bg-red-100 text-red-800', label: 'Out of Stock' };
        if (stock <= alert / 2) return { color: 'bg-red-100 text-red-800', label: 'Critical' };
        if (stock <= alert) return { color: 'bg-yellow-100 text-yellow-800', label: 'Low' };
        return { color: 'bg-green-100 text-green-800', label: 'OK' };
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Low Stock Report" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Low Stock Report</h1>
                    <p className="text-gray-600 mt-1">⚠️ Products below alert level</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
                        <p className="text-red-600 text-sm font-medium">Products Below Alert</p>
                        <p className="text-3xl font-bold text-red-700 mt-2">{stats?.count || 0}</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
                        <p className="text-yellow-600 text-sm font-medium">Total Stock (Low Items)</p>
                        <p className="text-3xl font-bold text-yellow-700 mt-2">{stats?.total_stock || 0} units</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <p className="text-blue-600 text-sm font-medium">Recommended Stock</p>
                        <p className="text-3xl font-bold text-blue-700 mt-2">{stats?.total_alert || 0} units</p>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                        <ExclamationIcon className="w-5 h-5 text-red-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Products Requiring Attention</h2>
                    </div>

                    {products.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Current Stock</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Alert Level</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Shortage</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.data.map((product) => {
                                        const shortage = product.stock_alert - product.stock;
                                        const status = getStockStatus(product.stock, product.stock_alert);

                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-sm text-gray-600">{product.sku}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-lg font-bold text-gray-900">{product.stock}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-700">
                                                    {product.stock_alert}
                                                </td>
                                                <td className="px-6 py-4 text-center font-semibold text-red-600">
                                                    -{shortage}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={`/stock-movements/create?product=${product.id}`}
                                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                                    >
                                                        Restock
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                            ✅ All products are well-stocked!
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
                            {products.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                            ? 'bg-gray-200 hover:bg-gray-300'
                                            : 'bg-gray-100 text-gray-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}