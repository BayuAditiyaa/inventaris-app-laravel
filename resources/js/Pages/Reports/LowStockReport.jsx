import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LowStockReport({ products, stats, auth }) {
    const exportCsvUrl = '/reports/low-stock/export';
    const exportPdfUrl = '/reports/low-stock/pdf';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Low Stock Report" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Low Stock Report</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Monitor products that need replenishment soon.
                        </p>
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
                        <Link
                            href="/stock-movements/create"
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            Record Stock Movement
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Products Below Alert</p>
                        <p className="mt-2 text-3xl font-bold text-red-600">{stats?.count || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Current Stock Total</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.total_stock || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Alert Threshold Total</p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">{stats?.total_alert || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Products Requiring Attention</h2>
                    </div>

                    {products.data.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            No low stock items found. Inventory levels look healthy.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                                        <th className="px-4 sm:px-6 py-3 text-right text-sm font-semibold text-gray-700">Current Stock</th>
                                        <th className="px-4 sm:px-6 py-3 text-right text-sm font-semibold text-gray-700">Alert Level</th>
                                        <th className="px-4 sm:px-6 py-3 text-right text-sm font-semibold text-gray-700">Gap</th>
                                        <th className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.data.map((product) => {
                                        const deficit = Math.max((product.stock_alert || 0) - (product.stock || 0), 0);

                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                                <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                                                <td className="px-4 sm:px-6 py-4 text-right font-semibold text-red-600">{product.stock}</td>
                                                <td className="px-4 sm:px-6 py-4 text-right text-gray-700">{product.stock_alert}</td>
                                                <td className="px-4 sm:px-6 py-4 text-right text-amber-600 font-semibold">{deficit}</td>
                                                <td className="px-4 sm:px-6 py-4 text-center">
                                                    <Link
                                                        href={`/stock-movements/create?product_id=${product.id}`}
                                                        className="inline-flex items-center rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-200"
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
                    )}

                    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                        <div className="text-sm text-gray-600">
                            Showing {products.from || 0} to {products.to || 0} of {products.total || 0}
                        </div>
                        <div className="space-x-1 flex">
                            {products.links.map((link, idx) => (
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`px-3 py-1 text-sm rounded transition-all ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
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
