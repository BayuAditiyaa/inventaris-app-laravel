import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

export default function StockMovementForm({ products }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        type: 'in',
        qty: '',
        adjustment_type: 'increase',
        note: '',
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductChange = (e) => {
        const productId = e.target.value;
        setData('product_id', productId);
        const product = products.find((p) => p.id == productId);
        setSelectedProduct(product);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/stock-movements');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                {/* Product */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Product *</label>
                    <select
                        value={data.product_id}
                        onChange={handleProductChange}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                            errors.product_id ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                    >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} (Stock: {p.stock})
                            </option>
                        ))}
                    </select>
                    {errors.product_id && <p className="text-red-600 text-sm mt-1">{errors.product_id}</p>}
                </div>

                {/* Current Stock */}
                {selectedProduct && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm">
                            <strong>Current Stock:</strong> {selectedProduct.stock} units
                        </p>
                        {selectedProduct.stock <= selectedProduct.stock_alert && (
                            <p className="text-sm text-red-600 font-semibold">
                                ⚠️ Low stock alert!
                            </p>
                        )}
                    </div>
                )}

                {/* Type */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Movement Type *</label>
                    <select
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                            errors.type ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                    >
                        <option value="in">Stock In (Restock)</option>
                        <option value="out">Stock Out (Sale/Adjustment)</option>
                        <option value="adjust">Adjustment (Stock Opname)</option>
                    </select>
                    {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
                </div>

                {/* Adjustment Type (for adjust) */}
                {data.type === 'adjust' && (
                    <div>
                        <label className="block text-sm font-semibold mb-2">Adjust Direction</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="adjustment_type"
                                    value="increase"
                                    checked={data.adjustment_type === 'increase'}
                                    onChange={(e) => setData('adjustment_type', e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm">Increase Stock (+)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="adjustment_type"
                                    value="decrease"
                                    checked={data.adjustment_type === 'decrease'}
                                    onChange={(e) => setData('adjustment_type', e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm">Decrease Stock (-)</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Quantity *</label>
                    <input
                        type="number"
                        value={data.qty}
                        onChange={(e) => setData('qty', e.target.value)}
                        placeholder="e.g., 10"
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                            errors.qty ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                    />
                    {errors.qty && <p className="text-red-600 text-sm mt-1">{errors.qty}</p>}
                </div>

                {/* Note */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Note</label>
                    <textarea
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
                        placeholder="e.g., Received goods from supplier XYZ"
                        rows="4"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Recording...' : 'Record Movement'}
                    </button>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}