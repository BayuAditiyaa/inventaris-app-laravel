import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function StockMovementIndex({ movements, products, filters, auth }) {
    const [productId, setProductId] = useState(filters.product_id || '');
    const [type, setType] = useState(filters.type || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const isAdmin = auth.user.role === 'admin';

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (productId) params.append('product_id', productId);
        if (type) params.append('type', type);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);

        router.get(`/stock-movements?${params.toString()}`);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'in':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'out':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
            case 'adjust':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
        }
    };

    const getQtyDisplay = (movement) => {
        if (movement.type === 'out') {
            return '-' + movement.qty;
        }
        return '+' + movement.qty;
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'in':
                return 'Stock In';
            case 'out':
                return 'Stock Out';
            case 'adjust':
                return 'Adjustment';
            default:
                return type;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Stock Movements" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Stock Movements</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">Track inventory changes</p>
                    </div>
                    {isAdmin && (
                        <Link
                            href="/stock-movements/create"
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all font-medium text-center text-sm md:text-base shadow-md hover:shadow-lg"
                        >
                            + Create Movement
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product</label>
                            <select
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 text-sm"
                            >
                                <option value="">All</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 text-sm"
                            >
                                <option value="">All</option>
                                <option value="in">Stock In</option>
                                <option value="out">Stock Out</option>
                                <option value="adjust">Adjustment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 text-sm"
                            />
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

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">Product</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                                    <th className="px-3 md:px-6 py-3 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">Note</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden xl:table-cell">By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {movements.data.length > 0 ? (
                                    movements.data.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                                                {new Date(movement.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-gray-900 dark:text-white hidden sm:table-cell text-sm">
                                                {movement.product.name}
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4">
                                                <span
                                                    className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                                                        movement.type
                                                    )}`}
                                                >
                                                    {getTypeLabel(movement.type)}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 text-center font-semibold text-gray-900 dark:text-white text-sm">
                                                {getQtyDisplay(movement)}
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                                                {movement.note || '-'}
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden xl:table-cell">
                                                {movement.created_by_user?.name}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No movements found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {movements.from || 0} to {movements.to || 0} of {movements.total}
                        </div>
                        <div className="space-x-1 flex">
                            {movements.links.map((link, idx) => (
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`px-3 py-1 text-xs border rounded ${link.active
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white hover:bg-gray-100 text-gray-700'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-xs border rounded bg-gray-50 text-gray-400 cursor-not-allowed"
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
