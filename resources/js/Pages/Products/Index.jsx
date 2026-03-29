import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProductIndex({ products, search }) {
    const [searchTerm, setSearchTerm] = useState(search || '');

    const handleSearch = () => {
        router.get('/products', { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure?')) {
            router.delete(`/products/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Products</h1>
                                <Link
                                    href="/products/create"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Create Product
                                </Link>
                            </div>

                            {/* Search */}
                            <div className="mb-6 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search by name or SKU..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left">SKU</th>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Cost</th>
                                            <th className="px-4 py-2 text-left">Price</th>
                                            <th className="px-4 py-2 text-left">Stock</th>
                                            <th className="px-4 py-2 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data.length > 0 ? (
                                            products.data.map((product) => (
                                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-mono text-xs">{product.sku}</td>
                                                    <td className="px-4 py-2">{product.name}</td>
                                                    <td className="px-4 py-2">${(product.cost / 100).toFixed(2)}</td>
                                                    <td className="px-4 py-2">${(product.price / 100).toFixed(2)}</td>
                                                    <td className="px-4 py-2">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${
                                                                product.stock <= product.stock_alert
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}
                                                        >
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center space-x-2">
                                                        <Link
                                                            href={`/products/${product.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-900 inline"
                                                        >
                                                            <PencilIcon className="w-4 h-4 inline" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <TrashIcon className="w-4 h-4 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                    No products found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Showing {products.meta.from} to {products.meta.to} of {products.meta.total}
                                </div>
                                <div className="space-x-1">
                                    {products.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-2 py-1 text-xs ${
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}