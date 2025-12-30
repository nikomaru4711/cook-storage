import { ToastElement } from '@/../types';

interface ToastProps extends ToastElement {
    id: number;
    isExiting: boolean;
    onRemove: (id: number) => void;
}

export function Toast({ type, text, showingtime, id, isExiting, onRemove }: ToastProps) {
    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-black',
    };

    const animationClasses = isExiting
        ? 'animate-toast-out'
        : 'animate-toast-in';

    return (
        <div
            className={`p-4 rounded shadow-lg z-50 cursor-pointer ${styles[type]} ${animationClasses}`}
            onClick={() => onRemove(id)}
        >
            {text}
        </div>
    );
}

export function ToastContainer({ toasts, remove }: { toasts: (ToastElement & { id: number; isExiting: boolean })[], remove: (id: number) => void }) {
    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onRemove={remove} />
            ))}
        </div>
    );
}
