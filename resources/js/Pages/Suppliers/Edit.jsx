import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SupplierForm from './SupplierForm';

export default function EditSupplier({ auth, supplier }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Supplier" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Supplier</h1>
                    <p className="mt-1 text-gray-600">Update supplier information and contact details.</p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <SupplierForm supplier={supplier} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
