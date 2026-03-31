import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome to your inventory management system</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Today's Sales</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">More dashboard features coming soon...</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}