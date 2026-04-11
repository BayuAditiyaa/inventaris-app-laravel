import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ auth, stats, recentMovements }) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const formatCurrency = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    const movementBadgeClasses = {
        in: 'text-green-700 bg-green-50',
        out: 'text-red-700 bg-red-50',
        adjust: 'text-amber-700 bg-amber-50',
    };
    const movementValueClasses = {
        in: 'text-green-600',
        out: 'text-red-600',
        adjust: 'text-amber-600',
    };

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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Link href="/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                        <p className="text-gray-600 text-sm font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_products}</p>
                        <p className="text-sm text-blue-600 mt-2 font-medium">Live database count</p>
                    </Link>

                    <Link href="/reports/low-stock" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-red-500">
                        <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">{stats.low_stock_items}</p>
                        <p className="text-sm text-red-600 mt-2 font-medium">Needs attention</p>
                    </Link>

                    <Link href="/sales" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-green-500">
                        <p className="text-gray-600 text-sm font-medium">Today's Sales</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{stats.today_sales}</p>
                        <p className="text-sm text-green-600 mt-2 font-medium">Transactions today</p>
                    </Link>

                    <Link href="/reports/sales" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-purple-500">
                        <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">{formatCurrency(stats.total_revenue)}</p>
                        <p className="text-sm text-purple-600 mt-2 font-medium">All recorded sales</p>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4 gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Stock Activity</h2>
                        <Link href="/stock-movements" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            View all
                        </Link>
                    </div>

                    {recentMovements.length === 0 ? (
                        <p className="text-sm text-gray-600">No stock activity yet. Start by recording your first stock movement.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentMovements.map((movement) => (
                                <div key={movement.id} className="flex items-start justify-between gap-4 border border-gray-100 rounded-lg p-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium text-gray-900">{movement.product_name || 'Unknown product'}</p>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${movementBadgeClasses[movement.type] || 'text-gray-700 bg-gray-100'}`}>
                                                {movement.type_label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{movement.note || 'No note provided'}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {movement.created_by || 'System'} • {movement.created_at ? new Date(movement.created_at).toLocaleString('id-ID') : '-'}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className={`text-lg font-bold ${movementValueClasses[movement.type] || 'text-gray-700'}`}>
                                            {movement.qty_display}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden">
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
