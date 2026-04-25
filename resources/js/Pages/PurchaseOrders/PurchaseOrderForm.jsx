import { useMemo, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function PurchaseOrderForm({ suppliers, products }) {
    const { data, setData, processing, errors } = useForm({
        supplier_id: '',
        ordered_at: new Date().toISOString().slice(0, 10),
        expected_at: '',
        notes: '',
        items: [],
    });

    const [selectedProduct, setSelectedProduct] = useState('');
    const [qtyOrdered, setQtyOrdered] = useState(1);
    const [unitCost, setUnitCost] = useState('');

    const addItem = () => {
        if (!selectedProduct || !unitCost || qtyOrdered < 1) {
            toast.error('Please complete product, quantity, and unit cost.');
            return;
        }

        const product = products.find((item) => item.id === Number(selectedProduct));
        if (!product) {
            return;
        }

        if (data.items.some((item) => item.product_id === product.id)) {
            toast.error('This product is already in the purchase order.');
            return;
        }

        setData('items', [
            ...data.items,
            {
                product_id: product.id,
                qty_ordered: qtyOrdered,
                unit_cost: Number(unitCost),
            },
        ]);

        setSelectedProduct('');
        setQtyOrdered(1);
        setUnitCost('');
    };

    const removeItem = (productId) => {
        setData('items', data.items.filter((item) => item.product_id !== productId));
    };

    const grandTotal = useMemo(() => {
        return data.items.reduce((total, item) => total + (item.qty_ordered * item.unit_cost), 0);
    }, [data.items]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.items.length === 0) {
            toast.error('Add at least one product before creating a purchase order.');
            return;
        }

        router.post('/purchase-orders', data, {
            onSuccess: () => toast.success('Purchase order created successfully!'),
            onError: () => toast.error('Failed to create purchase order'),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Purchase Order Details</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Supplier *</label>
                            <select
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select supplier...</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                ))}
                            </select>
                            {errors.supplier_id && <p className="mt-1 text-sm text-red-600">{errors.supplier_id}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Ordered Date *</label>
                            <input
                                type="date"
                                value={data.ordered_at}
                                onChange={(e) => setData('ordered_at', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.ordered_at && <p className="mt-1 text-sm text-red-600">{errors.ordered_at}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Expected Arrival</label>
                            <input
                                type="date"
                                value={data.expected_at}
                                onChange={(e) => setData('expected_at', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.expected_at && <p className="mt-1 text-sm text-red-600">{errors.expected_at}</p>}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Notes</label>
                        <textarea
                            rows="4"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add procurement notes, delivery instructions, or follow-up context..."
                        />
                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Add Products</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Product</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select product...</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} ({product.sku})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Qty</label>
                            <input
                                type="number"
                                min="1"
                                value={qtyOrdered}
                                onChange={(e) => setQtyOrdered(Number(e.target.value) || 1)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Unit Cost</label>
                            <input
                                type="number"
                                min="1000"
                                value={unitCost}
                                onChange={(e) => setUnitCost(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Item
                    </button>

                    <div className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 md:hidden">
                        {data.items.length > 0 ? data.items.map((item) => {
                            const product = products.find((value) => value.id === item.product_id);

                            return (
                                <div key={item.product_id} className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900">{product?.name}</p>
                                            <p className="mt-1 text-sm text-gray-500">{product?.sku}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.product_id)}
                                            className="shrink-0 rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
                                            aria-label={`Remove ${product?.name}`}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                                        <div>
                                            <dt className="font-medium text-gray-500">Qty</dt>
                                            <dd className="mt-1 text-gray-900">{item.qty_ordered}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Unit Cost</dt>
                                            <dd className="mt-1 text-gray-900">Rp {item.unit_cost.toLocaleString('id-ID')}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Total</dt>
                                            <dd className="mt-1 font-semibold text-gray-900">Rp {(item.qty_ordered * item.unit_cost).toLocaleString('id-ID')}</dd>
                                        </div>
                                    </dl>
                                </div>
                            );
                        }) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                No items added yet.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 hidden overflow-x-auto md:block">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Qty</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Unit Cost</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Line Total</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.items.length > 0 ? data.items.map((item) => {
                                    const product = products.find((value) => value.id === item.product_id);

                                    return (
                                        <tr key={item.product_id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-gray-900">{product?.name}</p>
                                                <p className="text-sm text-gray-500">{product?.sku}</p>
                                            </td>
                                            <td className="px-4 py-4 text-right text-gray-700">{item.qty_ordered}</td>
                                            <td className="px-4 py-4 text-right text-gray-700">Rp {item.unit_cost.toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-4 text-right font-semibold text-gray-900">
                                                Rp {(item.qty_ordered * item.unit_cost).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.product_id)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No items added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Summary</h2>
                    <div className="space-y-3 border-b border-blue-200 pb-4">
                        <div className="flex justify-between text-gray-700">
                            <span>Supplier</span>
                            <span className="font-medium">
                                {suppliers.find((supplier) => supplier.id === Number(data.supplier_id))?.name || '-'}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Items</span>
                            <span className="font-medium">{data.items.length}</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between text-2xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                    {processing ? 'Creating Purchase Order...' : 'Create Purchase Order'}
                </button>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
