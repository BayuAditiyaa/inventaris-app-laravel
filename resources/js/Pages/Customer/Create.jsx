import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomerForm from './CustomerForm';

export default function CreateCustomer({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Customer" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
                    <p className="text-gray-600 mt-1">Create a new customer record</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <CustomerForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}