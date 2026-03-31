import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductForm from './ProductForm';

export default function CreateProduct({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Product" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
                    <p className="text-gray-600 mt-1">Add a new product to your inventory</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <ProductForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}