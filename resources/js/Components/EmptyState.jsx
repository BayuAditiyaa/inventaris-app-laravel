import { InboxIcon } from '@heroicons/react/24/outline';

export function EmptyState({ icon: Icon = InboxIcon, title, description, action }) {
    return (
        <div className="text-center py-12">
            <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
}

export function NoProductsInCart() {
    return (
        <EmptyState
            title="Your cart is empty"
            description="Add products to get started"
        />
    );
}

export function NoSalesFound() {
    return (
        <EmptyState
            title="No sales found"
            description="Try adjusting your filters or create a new sale"
        />
    );
}

export function NoLowStockItems() {
    return (
        <EmptyState
            title="All products are well-stocked!"
            description="✅ No items below alert level"
        />
    );
}