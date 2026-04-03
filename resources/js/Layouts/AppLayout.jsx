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
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';

export default function AppLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { url } = usePage();

    const isActive = (route) => url.startsWith(route);

    const menuItems = [
        { label: 'Dashboard', route: '/dashboard', icon: HomeIcon },
        { label: 'Products', route: '/products', icon: CubeIcon },
        { label: 'Customers', route: '/customers', icon: UsersIcon },
        { label: 'Stock Movements', route: '/stock-movements', icon: ArrowsRightLeftIcon },
        { label: 'Sales', route: '/sales', icon: ShoppingCartIcon },
        { label: 'Reports', route: '/reports', icon: ChartBarIcon },
        { label: 'Reports', route: '/reports/sales', icon: ChartBarIcon },

    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Toast />
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-screen z-40`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className={`${!sidebarOpen && 'hidden'}`}>
                        <h1 className="text-2xl font-bold">Inventory</h1>
                        <p className="text-xs text-gray-400">System</p>
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
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-800">
                    <div className={`${!sidebarOpen && 'hidden'} mb-4 pb-4 border-b border-gray-800`}>
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
                        <span className={`${!sidebarOpen && 'hidden'}`}>Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col transition-all duration-300`}>
                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
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
                        <h2 className="text-xl font-semibold text-gray-800">Inventory Management System</h2>
                    </div>

                    {/* Top Right: User Info */}
                    <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}