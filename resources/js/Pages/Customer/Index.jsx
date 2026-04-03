import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { PencilIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function CustomersIndex({ customers, search, auth }) {
    const [searchTerm, setSearchTerm] = useState(search || '');

    const handleSearch = () => {
        router.get('/customers', { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/customers/${id}`, {
                onSuccess: () => {
                    toast.success(`${name} deleted successfully`);
                },
                onError: () => {
                    toast.error('Failed to delete customer');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Customers" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                        <p className="text-gray-600 mt-1">Manage your customer database</p>
                    </div>
                    <Link
                        href="/customers/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                        + Add Customer
                    </Link>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {customers.data.length > 0 ? (
                                    customers.data.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                            <td className="px-6 py-4 text-gray-700">{customer.phone || '-'}</td>
                                            <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{customer.address || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={`/customers/${customer.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(customer.id, customer.name)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
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
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="font-medium mb-1">No customers found</p>
                                                <p className="text-sm">
                                                    Try adjusting your search or{' '}
                                                    <Link href="/customers/create" className="text-blue-600 hover:underline">
                                                        create a new one
                                                    </Link>
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
                            Showing {customers.from || 0} to {customers.to || 0} of {customers.total || 0}
                        </div>
                        <div className="space-x-1 flex">
                            {customers.links.map((link, idx) => (
                                link.url ? (
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