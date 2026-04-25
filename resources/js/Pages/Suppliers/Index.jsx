import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function SupplierIndex({ auth, suppliers, search }) {
    const [searchTerm, setSearchTerm] = useState(search || '');

    const handleSearch = () => {
        router.get('/suppliers', { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (supplier) => {
        if (!confirm(`Delete supplier "${supplier.name}"?`)) {
            return;
        }

        router.delete(`/suppliers/${supplier.id}`, {
            onSuccess: () => toast.success('Supplier deleted successfully!'),
            onError: () => toast.error('Failed to delete supplier'),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Suppliers" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
                        <p className="mt-1 text-gray-600">Manage procurement partners and vendor contacts.</p>
                    </div>
                    <Link
                        href="/suppliers/create"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        + Add Supplier
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex flex-col gap-2 md:flex-row">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search supplier or contact person..."
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="divide-y divide-gray-200 md:hidden">
                        {suppliers.data.length > 0 ? suppliers.data.map((supplier) => (
                            <div key={supplier.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900">{supplier.name}</p>
                                        <p className="mt-1 text-sm text-gray-500">{supplier.address || '-'}</p>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <Link
                                            href={`/suppliers/${supplier.id}/edit`}
                                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-100"
                                            aria-label={`Edit ${supplier.name}`}
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(supplier)}
                                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
                                            aria-label={`Delete ${supplier.name}`}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
                                    <div>
                                        <dt className="font-medium text-gray-500">Contact</dt>
                                        <dd className="mt-1 text-gray-900">{supplier.contact_person || '-'}</dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                                        <div>
                                            <dt className="font-medium text-gray-500">Phone</dt>
                                            <dd className="mt-1 break-words text-gray-900">{supplier.phone || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 break-words text-gray-900">{supplier.email || '-'}</dd>
                                        </div>
                                    </div>
                                </dl>
                            </div>
                        )) : (
                            <div className="px-6 py-10 text-center text-gray-500">
                                No suppliers found.
                            </div>
                        )}
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Supplier</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {suppliers.data.length > 0 ? suppliers.data.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{supplier.name}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{supplier.address || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{supplier.contact_person || '-'}</td>
                                        <td className="px-6 py-4 text-gray-700">{supplier.phone || '-'}</td>
                                        <td className="px-6 py-4 text-gray-700">{supplier.email || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/suppliers/${supplier.id}/edit`}
                                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-100"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(supplier)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                            No suppliers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="text-sm text-gray-600">
                            Showing {suppliers.from || 0} to {suppliers.to || 0} of {suppliers.total || 0}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {suppliers.links.map((link, idx) => (
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="cursor-not-allowed rounded bg-gray-100 px-3 py-1 text-sm text-gray-400"
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
