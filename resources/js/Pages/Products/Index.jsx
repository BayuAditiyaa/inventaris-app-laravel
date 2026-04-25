import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function ProductIndex({ products, search, auth }) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [imagePreview, setImagePreview] = useState(null);
    const isAdmin = auth.user.role === 'admin';

    const handleSearch = () => {
        router.get('/products', { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/products/${id}`, {
                onSuccess: () => {
                    toast.success(`${name} deleted successfully`);
                },
                onError: () => {
                    toast.error('Failed to delete product');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Products" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">Manage your product inventory</p>
                    </div>
                    {isAdmin && (
                        <Link
                            href="/products/create"
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-md hover:shadow-lg text-center"
                        >
                            + Create Product
                        </Link>
                    )}
                </div>

                {/* Search Box */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 text-sm md:text-base"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all font-medium text-sm md:text-base"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">Image</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">Cost</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">Price</th>
                                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                                    <th className="px-3 md:px-6 py-3 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.data.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-3 md:px-6 py-3 md:py-4">
                                                {product.image_path ? (
                                                    <div
                                                        className="relative group cursor-pointer"
                                                        onMouseEnter={() => setImagePreview(product.id)}
                                                        onMouseLeave={() => setImagePreview(null)}
                                                    >
                                                        <img
                                                            src={`/storage/${product.image_path}`}
                                                            alt={product.name}
                                                            className="w-8 h-8 md:w-10 md:h-10 object-cover rounded hover:ring-2 hover:ring-blue-400 transition-all"
                                                        />
                                                        {imagePreview === product.id && (
                                                            <div className="absolute left-12 top-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 border-2 border-blue-300 dark:border-blue-600 animate-in fade-in">
                                                                <img
                                                                    src={`/storage/${product.image_path}`}
                                                                    alt={product.name}
                                                                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">N/A</span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-3 md:px-6 py-3 md:py-4 font-mono text-xs md:text-sm text-gray-700 dark:text-gray-300">{product.sku}</td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-gray-900 dark:text-white text-sm md:text-base">{product.name}</td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 dark:text-gray-300 hidden lg:table-cell text-sm">Rp {product.cost.toLocaleString('id-ID')}</td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 dark:text-gray-300 hidden lg:table-cell text-sm">Rp {product.price.toLocaleString('id-ID')}</td>
                                            <td className="px-3 md:px-6 py-3 md:py-4">
                                                <span
                                                    className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold transition-all ${product.stock <= product.stock_alert
                                                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 animate-pulse'
                                                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                        }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                                                {isAdmin ? (
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={`/products/${product.id}/edit`}
                                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product.id, product.name)}
                                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-500">View only</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="text-gray-500 dark:text-gray-400">
                                                <p className="font-medium mb-1 text-sm md:text-base">No products found</p>
                                                <p className="text-xs md:text-sm">
                                                    Try adjusting your search or{' '}
                                                    {isAdmin ? (
                                                        <Link href="/products/create" className="text-blue-600 dark:text-blue-400 hover:underline">
                                                            create a new one
                                                        </Link>
                                                    ) : (
                                                        'check another keyword'
                                                    )}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                        <div className="text-sm text-gray-600">
                            Showing {products.from || 0} to {products.to || 0} of {products.total || 0}
                        </div>
                        <div className="space-x-1 flex">
                            {products.links.map((link, idx) => (
                                link.url ? (
                                    /* Render a clickable Link if the URL exists */
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`px-3 py-1 text-sm rounded transition-all ${link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    /* Render a gray, unclickable span if the URL is null */
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
