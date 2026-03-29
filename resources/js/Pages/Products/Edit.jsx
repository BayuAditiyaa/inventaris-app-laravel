import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductForm from './ProductForm';

export default function EditProduct({ product }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${product.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
                            <ProductForm product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}