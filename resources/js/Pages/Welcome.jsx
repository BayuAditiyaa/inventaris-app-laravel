import { Head, Link } from '@inertiajs/react';
import { ShoppingCartIcon, CubeIcon, ChartBarIcon, LockClosedIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Breeze Inventory - Sistem Manajemen Modern" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
                {/* Navigation */}
                <nav className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <CubeIcon className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Breeze Inventory</h1>
                        </div>
                        <div className="flex gap-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                                >
                                    Masuk Dasbor
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                                    >
                                        Lihat Demo
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
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Sistem Manajemen Inventaris Modern & Skalabel
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Solusi komprehensif berbasis web untuk melacak stok, mengelola penjualan, dan menganalisis metrik bisnis secara real-time. Dirancang dengan fokus pada performa, keamanan, dan User Experience (UX) standar industri.
                            </p>
                            <div className="flex gap-4">
                                {!auth.user && (
                                    <>
                                        <Link
                                            href="/login"
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl"
                                        >
                                            Masuk Demo
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
                                        >
                                            Masuk Sistem
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
                                        <h3 className="font-semibold text-gray-900">Manajemen Data Terpadu</h3>
                                        <p className="text-sm text-gray-600">Arsitektur database yang efisien untuk pelacakan SKU dan pergerakan barang yang akurat.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ShoppingCartIcon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Point of Sale (POS) Reaktif</h3>
                                        <p className="text-sm text-gray-600">Sistem transaksi yang cepat dan asinkron untuk produktivitas kasir tanpa waktu tunggu (lag).</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ChartBarIcon className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Analitik & Visualisasi Data</h3>
                                        <p className="text-sm text-gray-600">Dasbor pelaporan real-time dengan grafik interaktif untuk pengambilan keputusan bisnis strategis.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <LockClosedIcon className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Infrastruktur Aman</h3>
                                        <p className="text-sm text-gray-600">Sistem autentikasi yang solid dengan perlindungan dari injeksi data dan ancaman keamanan web.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Fitur Inti Aplikasi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: CubeIcon,
                                    title: 'Pemantauan Stok Otomatis',
                                    description: 'Notifikasi cerdas saat persediaan barang mencapai batas minimum untuk mencegah kehabisan stok.'
                                },
                                {
                                    icon: ShoppingCartIcon,
                                    title: 'Sirkulasi Penjualan',
                                    description: 'Alur kerja transaksi yang mulus, lengkap dengan perhitungan diskon dan manajemen pelanggan.'
                                },
                                {
                                    icon: ChartBarIcon,
                                    title: 'Metrik Profitabilitas',
                                    description: 'Lacak margin keuntungan, produk terlaris, dan tren penjualan dalam satu antarmuka visual.'
                                },
                                {
                                    icon: SparklesIcon,
                                    title: 'UI/UX Intuitif',
                                    description: 'Desain responsif yang memprioritaskan pengalaman pengguna, berjalan sempurna di Desktop maupun Mobile.'
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
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Keunggulan Teknis & Operasional</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                'Meningkatkan efisiensi manajemen data hingga 70%',
                                'Mencegah kerugian dengan sistem peringatan stok (alerting)',
                                'Kalkulasi laba/rugi dan margin kotor secara instan',
                                'State management yang mulus tanpa muat ulang halaman (SPA)',
                                'Antarmuka responsif penuh yang dibangun dengan Tailwind CSS',
                                'Kode yang bersih, modular, dan dapat diskalakan (scalable)'
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
                        <h2 className="text-3xl font-bold mb-4">Siap Mengeksplorasi Breeze Inventory?</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Masuk untuk melihat bagaimana sistem ini dirancang dengan standar pengembangan web yang modern, efisien, dan siap memenuhi kebutuhan operasional bisnis tingkat tinggi.</p>
                        {!auth.user && (
                            <Link
                                href="/login"
                                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-bold shadow-lg hover:shadow-xl"
                            >
                                Masuk ke Demo
                            </Link>
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="text-center text-gray-600 border-t border-gray-200 pt-8 pb-12">
                        <p>
                            &copy; 2026 Breeze Inventory. Dikembangkan sebagai project portfolio oleh{' '}
                            <a
                                href="https://www.linkedin.com/in/m-bayu-aditiya-16671b274/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300"
                            >
                                M Bayu Aditiya
                            </a>.
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
}
