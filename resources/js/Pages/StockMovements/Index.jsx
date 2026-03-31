import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function StockMovementIndex({ movements, products, filters }) {
    const [productId, setProductId] = useState(filters.product_id || '');
    const [type, setType] = useState(filters.type || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

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
                return 'bg-green-100 text-green-800';
            case 'out':
                return 'bg-red-100 text-red-800';
            case 'adjust':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
        <AuthenticatedLayout>
            <Head title="Stock Movements" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Stock Movements</h1>
                                <Link
                                    href="/stock-movements/create"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Create Movement
                                </Link>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 p-4 bg-gray-50 rounded border">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Product</label>
                                        <select
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                            className="w-full px-3 py-2 border rounded text-sm"
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
                                        <label className="block text-sm font-semibold mb-2">Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full px-3 py-2 border rounded text-sm"
                                        >
                                            <option value="">All</option>
                                            <option value="in">Stock In</option>
                                            <option value="out">Stock Out</option>
                                            <option value="adjust">Adjustment</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">From</label>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="w-full px-3 py-2 border rounded text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">To</label>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="w-full px-3 py-2 border rounded text-sm"
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            onClick={handleFilter}
                                            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                        >
                                            Filter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Date</th>
                                            <th className="px-4 py-2 text-left">Product</th>
                                            <th className="px-4 py-2 text-left">Type</th>
                                            <th className="px-4 py-2 text-center">Qty</th>
                                            <th className="px-4 py-2 text-left">Note</th>
                                            <th className="px-4 py-2 text-left">By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movements.data.length > 0 ? (
                                            movements.data.map((movement) => (
                                                <tr key={movement.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-xs">
                                                        {new Date(movement.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-4 py-2">{movement.product.name}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(movement.type)}`}>
                                                            {getTypeLabel(movement.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center font-semibold">
                                                        {getQtyDisplay(movement)}
                                                    </td>
                                                    <td className="px-4 py-2 text-xs text-gray-600">{movement.note}</td>
                                                    <td className="px-4 py-2 text-xs">{movement.created_by?.name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}