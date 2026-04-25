import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    CubeIcon,
    UsersIcon,
    ArrowsRightLeftIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    TruckIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    PresentationChartLineIcon,
    ExclamationTriangleIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';

export default function AppLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();
    const isAdmin = user?.role === 'admin';

    const isActive = (route) => url.startsWith(route);

    const menuItems = [
        { label: 'Dashboard', route: '/dashboard', icon: HomeIcon },
        { label: 'Products', route: '/products', icon: CubeIcon },
        { label: 'Customers', route: '/customers', icon: UsersIcon },
        ...(isAdmin ? [{ label: 'Suppliers', route: '/suppliers', icon: TruckIcon }] : []),
        { label: 'Stock Movements', route: '/stock-movements', icon: ArrowsRightLeftIcon },
        { label: 'Sales', route: '/sales', icon: ShoppingCartIcon },
        ...(isAdmin ? [{ label: 'Purchase Orders', route: '/purchase-orders', icon: ClipboardDocumentListIcon }] : []),
        ...(isAdmin ? [{ label: 'Activity Log', route: '/activity-logs', icon: ClockIcon }] : []),
    ];

    const reportItems = [
        { label: 'Sales Report', route: '/reports/sales', icon: ChartBarIcon },
        { label: 'Low Stock', route: '/reports/low-stock', icon: ExclamationTriangleIcon },
        { label: 'Product Performance', route: '/reports/product-performance', icon: CubeIcon },
        { label: 'Supplier Performance', route: '/reports/supplier-performance', icon: PresentationChartLineIcon },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Toast />
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar overlay"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
                />
            )}
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'translate-x-0 lg:w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
                    } fixed z-40 flex h-screen w-64 flex-col bg-gray-900 text-white transition-all duration-300 lg:left-0`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className={`${!sidebarOpen && 'hidden'}`}>
                        <h1 className="text-2xl font-bold">Breeze</h1>
                        <p className="text-xs text-gray-400">Inventory</p>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.route);

                        return (
                            <Link
                                key={item.route}
                                href={item.route}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${active
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                                title={item.label}
                            >
                                <Icon className="w-6 h-6 flex-shrink-0" />
                                <span className={`${!sidebarOpen && 'hidden'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {isAdmin && (
                        <div className="pt-4">
                            <div className={`${!sidebarOpen && 'lg:hidden'} px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500`}>
                                Reports
                            </div>
                            <div className="space-y-2">
                                {reportItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.route);

                                    return (
                                        <Link
                                            key={item.route}
                                            href={item.route}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors ${
                                                active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-800'
                                            }`}
                                            title={item.label}
                                        >
                                            <Icon className="h-6 w-6 flex-shrink-0" />
                                            <span className={`${!sidebarOpen && 'lg:hidden'}`}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-800">
                    <div className={`${!sidebarOpen && 'lg:hidden'} mb-4 pb-4 border-b border-gray-800`}>
                        <p className="text-sm text-gray-400">Logged in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <span className="inline-block px-2 py-1 mt-2 text-xs bg-blue-600 rounded">
                            {user?.role}
                        </span>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className={`${!sidebarOpen && 'lg:hidden'}`}>Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className={`${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} flex-1 flex flex-col transition-all duration-300 min-w-0`}>
                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                        <h2 className="truncate text-base font-semibold text-gray-800 sm:text-xl">Breeze Inventory</h2>
                    </div>

                    {/* Top Right: User Info */}
                    <div className="hidden items-center gap-4 sm:flex">
                        <div className="text-right text-sm max-w-40">
                            <p className="truncate font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
