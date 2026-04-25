import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SupplierForm from './SupplierForm';

export default function CreateSupplier({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Supplier" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Supplier</h1>
                    <p className="mt-1 text-gray-600">Add a new procurement partner to your supplier directory.</p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <SupplierForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
