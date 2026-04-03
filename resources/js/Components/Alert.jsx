import { ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export function Alert({ type = 'info', title, message, onClose }) {
    const styles = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        success: 'bg-green-50 border-green-200 text-green-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        error: 'bg-red-50 border-red-200 text-red-900',
    };

    const icons = {
        info: InformationCircleIcon,
        success: CheckCircleIcon,
        warning: ExclamationCircleIcon,
        error: XCircleIcon,
    };

    const Icon = icons[type];

    return (
        <div className={`border rounded-lg p-4 ${styles[type]} flex gap-3`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
                {title && <p className="font-semibold mb-1">{title}</p>}
                {message && <p className="text-sm">{message}</p>}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-sm font-medium underline hover:no-underline"
                >
                    Dismiss
                </button>
            )}
        </div>
    );
}