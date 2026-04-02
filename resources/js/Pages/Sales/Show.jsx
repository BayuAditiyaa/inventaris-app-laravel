import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PrinterIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ShowSale({ sale, auth }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Invoice ${sale.invoice_no}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
                        <p className="text-gray-600 mt-1">{sale.invoice_no}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 print:hidden"
                        >
                            <PrinterIcon className="w-5 h-5" />
                            Print
                        </button>
                        <Link
                            href="/sales"
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 print:hidden"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            Back
                        </Link>
                    </div>
                </div>

                {/* Invoice */}
                <div className="bg-white rounded-lg shadow p-8 print:shadow-none print:p-0">
                    {/* Company Header */}
                    <div className="border-b-2 border-gray-300 pb-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Your Company Name</h2>
                        <p className="text-gray-600">Your Address</p>
                        <p className="text-gray-600">Phone: (XXX) XXX-XXXX</p>
                    </div>

                    {/* Invoice Details */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-sm text-gray-600 font-semibold">INVOICE NUMBER</p>
                            <p className="text-lg font-bold text-gray-900">{sale.invoice_no}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 font-semibold">INVOICE DATE</p>
                            <p className="text-lg font-bold text-gray-900">
                                {new Date(sale.sold_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    {sale.customer && (
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 font-semibold mb-2">CUSTOMER</p>
                            <p className="font-semibold text-gray-900">{sale.customer.name}</p>
                            {sale.customer.phone && <p className="text-gray-600">{sale.customer.phone}</p>}
                            {sale.customer.address && <p className="text-gray-600">{sale.customer.address}</p>}
                        </div>
                    )}

                    {/* Items Table */}
                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Item
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        Qty
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">{item.product.sku}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-700">
                                            Rp {item.unit_price.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-700">{item.qty}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                            Rp {item.line_total.toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-8">
                        <div className="w-64">
                            <div className="flex justify-between mb-3 pb-3 border-b border-gray-300">
                                <span className="text-gray-700">Subtotal:</span>
                                <span className="font-semibold text-gray-900">
                                    Rp {sale.subtotal.toLocaleString('id-ID')}
                                </span>
                            </div>

                            {sale.discount > 0 && (
                                <div className="flex justify-between mb-3 pb-3 border-b border-gray-300">
                                    <span className="text-gray-700">Discount:</span>
                                    <span className="font-semibold text-red-600">
                                        -Rp {sale.discount.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-gray-900">Total:</span>
                                <span className="text-green-600">Rp {sale.total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Cashier Info */}
                    <div className="border-t-2 border-gray-300 pt-6 text-sm text-gray-600">
                        <p>Cashier: {sale.user.name}</p>
                        <p>Time: {new Date(sale.sold_at).toLocaleString('id-ID')}</p>
                    </div>

                    {/* Thank You */}
                    <div className="text-center mt-8 pt-8 border-t border-gray-300">
                        <p className="text-gray-600 font-semibold">Thank you for your purchase!</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body {
                        background: white;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}