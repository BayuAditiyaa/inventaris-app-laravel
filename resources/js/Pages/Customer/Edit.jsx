import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomerForm from './CustomerForm';

export default function EditCustomer({ customer, auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit ${customer.name}`} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
                    <p className="text-gray-600 mt-1">Update customer information</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <CustomerForm customer={customer} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}