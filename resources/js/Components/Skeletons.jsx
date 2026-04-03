export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded" />
                ))}
            </div>
        </div>
    );
}