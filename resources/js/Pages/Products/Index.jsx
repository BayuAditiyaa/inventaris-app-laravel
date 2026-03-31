import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ProductIndex({ products, search, auth }) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [imagePreview, setImagePreview] = useState(null);

    const handleSearch = () => {
        router.get('/products', { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure?')) {
            router.delete(`/products/${id}`);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Products" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600 mt-1">Manage your product inventory</p>
                    </div>
                    <Link
                        href="/products/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Create Product
                    </Link>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.data.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            {/* Image Preview */}
                                            <td className="px-6 py-4">
                                                {product.image_path ? (
                                                    <div
                                                        className="relative group cursor-pointer"
                                                        onMouseEnter={() => setImagePreview(product.id)}
                                                        onMouseLeave={() => setImagePreview(null)}
                                                    >
                                                        <img
                                                            src={`/storage/${product.image_path}`}
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                        {/* Hover Preview */}
                                                        {imagePreview === product.id && (
                                                            <div className="absolute left-12 top-0 z-50 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
                                                                <img
                                                                    src={`/storage/${product.image_path}`}
                                                                    alt={product.name}
                                                                    className="w-32 h-32 object-cover rounded"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">N/A</span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 font-mono text-sm text-gray-700">{product.sku}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4 text-gray-700">Rp {product.cost.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 text-gray-700">Rp {product.price.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock <= product.stock_alert
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={`/products/${product.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
                            {/* Added || 0 fallbacks in case the table is completely empty */}
                            Showing {products.from || 0} to {products.to || 0} of {products.total}
                        </div>
                        <div className="space-x-1 flex">
                            {products.links.map((link, idx) => (
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