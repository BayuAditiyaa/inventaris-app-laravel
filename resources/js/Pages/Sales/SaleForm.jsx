import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { TrashIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function SaleForm({ products, customers }) {
    const { data, setData, post, processing, errors } = useForm({
        items: [],
        discount: 0,
        customer_name: '',
        customer_phone: '',
        customer_address: '',
    });

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Add product to cart
    const addToCart = () => {
        if (!selectedProduct) {
            toast.error('Please select a product');
            return;
        }

        const product = products.find((p) => p.id == selectedProduct);
        if (!product) return;

        // Check if already in cart
        const existingItem = data.items.find((item) => item.product_id == selectedProduct);

        if (existingItem) {
            const newQty = Math.min(existingItem.qty + quantity, product.stock);
            if (newQty === existingItem.qty) {
                toast.warning('Max stock reached for this product');
                return;
            }
            setData({
                ...data,
                items: data.items.map((item) =>
                    item.product_id == selectedProduct
                        ? { ...item, qty: newQty }
                        : item
                ),
            });
            toast.success(`Updated ${product.name}`);
        } else {
            setData({
                ...data,
                items: [
                    ...data.items,
                    {
                        product_id: parseInt(selectedProduct),
                        qty: Math.min(quantity, product.stock),
                    },
                ],
            });
            toast.success(`Added ${product.name} to cart`);
        }

        setSelectedProduct('');
        setQuantity(1);
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        const product = products.find((p) => p.id === productId);
        setData({
            ...data,
            items: data.items.filter((item) => item.product_id !== productId),
        });
        toast.info(`Removed ${product.name} from cart`);
    };

    // Update quantity
    const updateQuantity = (productId, newQty) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }

        if (newQty > product.stock) {
            toast.warning(`Only ${product.stock} items available`);
            return;
        }

        setData({
            ...data,
            items: data.items.map((item) =>
                item.product_id === productId
                    ? { ...item, qty: newQty }
                    : item
            ),
        });
    };

    // Calculate totals
    const subtotal = data.items.reduce((total, item) => {
        const product = products.find((p) => p.id === item.product_id);
        return total + (product ? product.price * item.qty : 0);
    }, 0);

    const total = subtotal - data.discount;

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.items.length === 0) {
            toast.error('Please add products to the sale');
            return;
        }

        post('/sales', {
            onSuccess: () => {
                toast.success('Sale completed successfully!');
            },
            onError: (errors) => {
                if (errors.error) {
                    toast.error(errors.error);
                }
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
            {/* Left: Product Selection */}
            <div className="col-span-2 space-y-6">
                {/* Product Selector */}
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Products</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product
                                </label>
                                <select
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                                >
                                    <option value="">Select a product...</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.sku}) - Stock: {p.stock}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Qty
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addToCart}
                            disabled={!selectedProduct}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 flex items-center gap-2">
                        <ShoppingCartIcon className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Cart Items ({data.items.length})
                        </h2>
                    </div>

                    {data.items.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Qty
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.items.map((item) => {
                                        const product = products.find((p) => p.id === item.product_id);
                                        if (!product) return null;

                                        const lineTotal = product.price * item.qty;

                                        return (
                                            <tr key={item.product_id} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {product.name}
                                                    <p className="text-sm text-gray-600">{product.sku}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-700">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={product.stock}
                                                        value={item.qty}
                                                        onChange={(e) =>
                                                            updateQuantity(item.product_id, parseInt(e.target.value))
                                                        }
                                                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                                    Rp {lineTotal.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.product_id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <ShoppingCartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No products added yet.</p>
                            <p className="text-gray-400 text-sm">Select a product above to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Summary */}
            <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={data.customer_name}
                                onChange={(e) => setData({ ...data, customer_name: e.target.value })}
                                list="customer-list"
                                placeholder="Walk-in or select..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                            />
                            <datalist id="customer-list">
                                {customers.map((c) => (
                                    <option key={c.id} value={c.name} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={data.customer_phone}
                                onChange={(e) => setData({ ...data, customer_phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                value={data.customer_address}
                                onChange={(e) => setData({ ...data, customer_address: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border border-blue-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>

                    <div className="space-y-3 mb-6 pb-6 border-b-2 border-blue-300">
                        <div className="flex justify-between text-gray-700">
                            <span>Subtotal:</span>
                            <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Discount (Rp)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max={subtotal}
                                value={data.discount}
                                onChange={(e) => setData({ ...data, discount: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                            />
                        </div>

                        {data.discount > 0 && (
                            <div className="flex justify-between text-gray-700">
                                <span>Discount:</span>
                                <span className="font-medium text-red-600">-Rp {data.discount.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-6 pb-6 border-b-2 border-blue-300">
                        <div className="flex justify-between text-2xl font-bold">
                            <span>Total:</span>
                            <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing || data.items.length === 0}
                        className="w-full px-4 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            '✓ Complete Sale'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}