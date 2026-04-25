import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function SupplierForm({ supplier }) {
    const { data, setData, processing, errors } = useForm({
        name: supplier?.name || '',
        contact_person: supplier?.contact_person || '',
        email: supplier?.email || '',
        phone: supplier?.phone || '',
        address: supplier?.address || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(supplier ? 'Supplier updated successfully!' : 'Supplier created successfully!');
            },
            onError: () => {
                toast.error(supplier ? 'Failed to update supplier' : 'Failed to create supplier');
            },
        };

        if (supplier?.id) {
            router.put(`/suppliers/${supplier.id}`, data, options);
            return;
        }

        router.post('/suppliers', data, options);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier Name *</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person</label>
                    <input
                        type="text"
                        value={data.contact_person}
                        onChange={(e) => setData('contact_person', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.contact_person && <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                    rows="4"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Saving...' : supplier ? 'Update Supplier' : 'Create Supplier'}
                </button>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="rounded-lg bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-700"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
