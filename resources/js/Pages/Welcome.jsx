import { Head, Link } from '@inertiajs/react';
import { ShoppingCartIcon, CubeIcon, ChartBarIcon, LockClosedIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Inventory Management System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
                {/* Navigation */}
                <nav className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <CubeIcon className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Inventory Pro</h1>
                        </div>
                        <div className="flex gap-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                                Manage Your Inventory with Ease
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                A complete inventory management system designed for businesses of all sizes. Track products, manage stock, process sales, and analyze your business performance in real-time.
                            </p>
                            <div className="flex gap-4">
                                {!auth.user && (
                                    <>
                                        <Link
                                            href="/register"
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl"
                                        >
                                            Start Free Now
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CubeIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Product Management</h3>
                                        <p className="text-sm text-gray-600">Organize and manage your product catalog with SKU tracking and pricing</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ShoppingCartIcon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Point of Sale</h3>
                                        <p className="text-sm text-gray-600">Fast, intuitive POS system for processing sales transactions</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ChartBarIcon className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Advanced Reports</h3>
                                        <p className="text-sm text-gray-600">Detailed analytics and reports for data-driven decisions</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <LockClosedIcon className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Secure & Reliable</h3>
                                        <p className="text-sm text-gray-600">Enterprise-grade security with role-based access control</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: CubeIcon,
                                    title: 'Product Tracking',
                                    description: 'Monitor stock levels and product details'
                                },
                                {
                                    icon: ShoppingCartIcon,
                                    title: 'Sales Management',
                                    description: 'Handle transactions and generate invoices'
                                },
                                {
                                    icon: ChartBarIcon,
                                    title: 'Real-time Reports',
                                    description: 'Get insights into your business metrics'
                                },
                                {
                                    icon: SparklesIcon,
                                    title: 'User Friendly',
                                    description: 'Intuitive interface for easy navigation'
                                }
                            ].map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6">
                                        <Icon className="w-10 h-10 text-blue-600 mb-4" />
                                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Inventory Pro?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                'Reduce inventory management time by 70%',
                                'Prevent stockouts with smart alerts',
                                'Track profitability in real-time',
                                'Multi-user support with role-based access',
                                'Mobile-friendly responsive design',
                                'Automated inventory tracking'
                            ].map((benefit, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700 font-medium">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-12 text-center text-white mb-20">
                        <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Inventory?</h2>
                        <p className="text-blue-100 mb-8">Join hundreds of businesses that trust Inventory Pro</p>
                        {!auth.user && (
                            <Link
                                href="/register"
                                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-bold shadow-lg hover:shadow-xl"
                            >
                                Get Started Free
                            </Link>
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="text-center text-gray-600 border-t border-gray-200 pt-8">
                        <p>&copy; 2026 Inventory Pro. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </>
    );
}