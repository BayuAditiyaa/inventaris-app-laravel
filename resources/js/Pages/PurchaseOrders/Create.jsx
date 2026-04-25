import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PurchaseOrderForm from './PurchaseOrderForm';

export default function CreatePurchaseOrder({ auth, suppliers, products }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Purchase Order" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Purchase Order</h1>
                    <p className="mt-1 text-gray-600">Create a procurement order and track incoming stock from suppliers.</p>
                </div>

                <PurchaseOrderForm suppliers={suppliers} products={products} />
            </div>
        </AuthenticatedLayout>
    );
}
