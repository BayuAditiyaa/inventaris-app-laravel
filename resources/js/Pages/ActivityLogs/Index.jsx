import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function ActivityLogIndex({ auth, logs, filters }) {
    const [action, setAction] = useState(filters.action || '');

    const handleFilter = () => {
        router.get('/activity-logs', { action }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Activity Log" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
                    <p className="mt-1 text-gray-600">Audit trail for inventory, procurement, sales, and admin changes.</p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end">
                        <div className="w-full md:max-w-xs">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Action</label>
                            <input
                                type="text"
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                placeholder="sale.created, product.updated..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleFilter}
                            className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="divide-y divide-gray-200 lg:hidden">
                        {logs.data.length > 0 ? logs.data.map((log) => (
                            <div key={log.id} className="p-4">
                                <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                                    <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                                        {log.action}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm font-semibold text-gray-900">{log.description}</p>
                                <dl className="mt-4 grid grid-cols-1 gap-3 text-sm min-[420px]:grid-cols-2">
                                    <div>
                                        <dt className="font-medium text-gray-500">User</dt>
                                        <dd className="mt-1 text-gray-900">{log.user_name || 'System'}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-500">Subject</dt>
                                        <dd className="mt-1 break-words text-gray-900">
                                            {log.subject_type ? `${log.subject_type} #${log.subject_id}` : '-'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        )) : (
                            <div className="px-6 py-10 text-center text-gray-500">
                                No activity logs found.
                            </div>
                        )}
                    </div>

                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">When</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {logs.data.length > 0 ? logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{log.user_name || 'System'}</td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{log.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {log.subject_type ? `${log.subject_type} #${log.subject_id}` : '-'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                            No activity logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="text-sm text-gray-600">
                            Showing {logs.from || 0} to {logs.to || 0} of {logs.total || 0}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {logs.links.map((link, idx) => (
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
