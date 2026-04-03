import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function ProductForm({ product }) {
    const { data, setData, post, processing, errors } = useForm({
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

    const clearImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('sku', data.sku);
        formData.append('cost', parseInt(data.cost));
        formData.append('price', parseInt(data.price));
        formData.append('stock_alert', data.stock_alert);

        if (data.image) {
            formData.append('image', data.image);
        }

        if (product?.id) {
            formData.append('_method', 'PUT');
            router.post(`/products/${product.id}`, formData, {
                onSuccess: () => {
                    toast.success('Product updated successfully!');
                },
                onError: (errors) => {
                    if (errors.error) {
                        toast.error(errors.error);
                    } else {
                        toast.error('Failed to update product');
                    }
                },
            });
        } else {
            router.post('/products', formData, {
                onSuccess: () => {
                    toast.success('Product created successfully!');
                },
                onError: (errors) => {
                    if (errors.error) {
                        toast.error(errors.error);
                    } else {
                        toast.error('Failed to create product');
                    }
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Left side: Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700  mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.name
                                    ? 'border-red-500 dark:border-red-600 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 dark:text-white focus:ring-blue-500 hover:border-gray-400'
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* SKU */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            SKU *
                        </label>
                        <input
                            type="text"
                            value={data.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.sku
                                    ? 'border-red-500 dark:border-red-600 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 dark:text-white focus:ring-blue-500 hover:border-gray-400'
                            }`}
                        />
                        {errors.sku && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.sku}</p>
                        )}
                    </div>

                    {/* Cost & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cost (Rp) *
                            </label>
                            <input
                                type="number"
                                value={data.cost}
                                onChange={(e) => setData('cost', e.target.value)}
                                placeholder="e.g., 50000"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                    errors.cost
                                        ? 'border-red-500 dark:border-red-600 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 dark:text-white focus:ring-blue-500 hover:border-gray-400'
                                }`}
                            />
                            {errors.cost && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.cost}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Price (Rp) *
                            </label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="e.g., 75000"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                    errors.price
                                        ? 'border-red-500 dark:border-red-600 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 dark:text-white focus:ring-blue-500 hover:border-gray-400'
                                }`}
                            />
                            {errors.price && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.price}</p>
                            )}
                        </div>
                    </div>

                    {/* Stock Alert */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Stock Alert Level *
                        </label>
                        <input
                            type="number"
                            value={data.stock_alert}
                            onChange={(e) => setData('stock_alert', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.stock_alert
                                    ? 'border-red-500 dark:border-red-600 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 dark:text-white focus:ring-blue-500 hover:border-gray-400'
                            }`}
                        />
                        {errors.stock_alert && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.stock_alert}</p>
                        )}
                    </div>
                </div>

                {/* Right side: Image Upload & Preview */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-all">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Product Image
                        </label>

                        {/* Image Preview */}
                        {imagePreview ? (
                            <div className="relative mb-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-1 bg-red-500 dark:bg-red-600 text-white rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-all"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mb-4">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No image yet</p>
                            </div>
                        )}

                        {/* File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg text-sm cursor-pointer hover:border-gray-400 transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            JPG, PNG, GIF (max 2MB)
                        </p>

                        {errors.image && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.image}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 flex flex-col md:flex-row gap-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg text-sm md:text-base"
                >
                    {processing ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                </button>

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all font-medium text-sm md:text-base"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}