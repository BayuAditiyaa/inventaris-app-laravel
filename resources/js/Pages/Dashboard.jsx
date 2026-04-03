import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ auth }) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <SparklesIcon className="w-6 h-6" />
                        <h1 className="text-3xl font-bold">{greeting}, {auth.user.name}! 👋</h1>
                    </div>
                    <p className="text-blue-100">Welcome back to your inventory management system</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Link href="/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                        <p className="text-gray-600 text-sm font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
                        <p className="text-sm text-blue-600 mt-2 font-medium">View →</p>
                    </Link>

                    <Link href="/reports/low-stock" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-red-500">
                        <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">—</p>
                        <p className="text-sm text-red-600 mt-2 font-medium">Check →</p>
                    </Link>

                    <Link href="/sales" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-green-500">
                        <p className="text-gray-600 text-sm font-medium">Today's Sales</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">—</p>
                        <p className="text-sm text-green-600 mt-2 font-medium">View →</p>
                    </Link>

                    <Link href="/reports/sales" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-purple-500">
                        <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">—</p>
                        <p className="text-sm text-purple-600 mt-2 font-medium">Report →</p>
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Link
                            href="/sales/create"
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-center shadow-md hover:shadow-lg"
                        >
                            💳 New Sale
                        </Link>
                        <Link
                            href="/products/create"
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-center shadow-md hover:shadow-lg"
                        >
                            ➕ Add Product
                        </Link>
                        <Link
                            href="/stock-movements/create"
                            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-center shadow-md hover:shadow-lg"
                        >
                            📦 Stock In
                        </Link>
                        <Link
                            href="/reports/sales"
                            className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium text-center shadow-md hover:shadow-lg"
                        >
                            📊 Reports
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                            <div>
                                <p className="font-medium text-gray-900">Create Products</p>
                                <p className="text-sm text-gray-600">Go to Products and add items to your inventory</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                            <div>
                                <p className="font-medium text-gray-900">Manage Stock</p>
                                <p className="text-sm text-gray-600">Track inventory with Stock Movements</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                            <div>
                                <p className="font-medium text-gray-900">Start Selling</p>
                                <p className="text-sm text-gray-600">Use the POS to create sales and manage transactions</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                            <div>
                                <p className="font-medium text-gray-900">View Reports</p>
                                <p className="text-sm text-gray-600">Analyze sales, products, and business metrics</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}