import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

export default function ProductForm({ product }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        sku: product?.sku || '',
        cost: product?.cost ? product.cost.toString() : '',
        price: product?.price ? product.price.toString() : '',
        stock_alert: product?.stock_alert || '5',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(
        product?.image_path ? `/storage/${product.image_path}` : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('sku', data.sku);
        formData.append('cost', Math.round(parseFloat(data.cost) * 100).toString());
        formData.append('price', Math.round(parseFloat(data.price) * 100).toString());
        formData.append('stock_alert', data.stock_alert);
        
        if (data.image) {
            formData.append('image', data.image);
        }

        if (product?.id) {
            formData.append('_method', 'PUT');
            router.post(`/products/${product.id}`, formData);
        } else {
            router.post('/products', formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Product Name *</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                            errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* SKU */}
                <div>
                    <label className="block text-sm font-semibold mb-2">SKU *</label>
                    <input
                        type="text"
                        value={data.sku}
                        onChange={(e) => setData('sku', e.target.value)}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                            errors.sku ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                    />
                    {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku}</p>}
                </div>

                {/* Cost & Price (grid) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Cost ($) *</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.cost}
                            onChange={(e) => setData('cost', e.target.value)}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                                errors.cost ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                        />
                        {errors.cost && <p className="text-red-600 text-sm mt-1">{errors.cost}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Price ($) *</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                                errors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                        />
                        {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                    </div>
                </div>

                {/* Stock Alert */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Stock Alert Level *</label>
                    <input
                        type="number"
                        value={data.stock_alert}
                        onChange={(e) => setData('stock_alert', e.target.value)}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                            errors.stock_alert ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                    />
                    {errors.stock_alert && <p className="text-red-600 text-sm mt-1">{errors.stock_alert}</p>}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                    {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}

                    {imagePreview && (
                        <div className="mt-4">
                            <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded" />
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : product ? 'Update' : 'Create'}
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