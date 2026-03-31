import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductForm from './ProductForm';

export default function EditProduct({ product, auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit ${product.name}`} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-gray-600 mt-1">Update product information</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <ProductForm product={product} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}