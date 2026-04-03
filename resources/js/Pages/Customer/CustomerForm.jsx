import { useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';

export default function CustomerForm({ customer }) {
    const { data, setData, post, processing, errors } = useForm({
        name: customer?.name || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (customer?.id) {
            router.put(`/customers/${customer.id}`, data, {
                onSuccess: () => {
                    toast.success('Customer updated successfully!');
                },
                onError: () => {
                    toast.error('Failed to update customer');
                },
            });
        } else {
            router.post('/customers', data, {
                onSuccess: () => {
                    toast.success('Customer created successfully!');
                },
                onError: () => {
                    toast.error('Failed to create customer');
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.name
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
                    }`}
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                </label>
                <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="e.g., +62 812-3456-7890"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
                    }`}
                />
                {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                </label>
                <textarea
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    rows="4"
                    placeholder="Enter customer address..."
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.address
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
                    }`}
                />
                {errors.address && (
                    <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
                >
                    {processing ? 'Saving...' : customer ? 'Update Customer' : 'Create Customer'}
                </button>

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}