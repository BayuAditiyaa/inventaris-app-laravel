import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StockMovementForm from './StockMovementForm';

export default function CreateStockMovement({ products }) {
    return (
        <AuthenticatedLayout>
            <Head title="Create Stock Movement" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">Record Stock Movement</h1>
                            <StockMovementForm products={products} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}