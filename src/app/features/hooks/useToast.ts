import { useState, useCallback } from 'react';
import { ToastElement } from '@/../types';

let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState<(ToastElement & { id: number; isExiting: boolean })[]>([]);

    const show = useCallback((type: ToastElement['type'], text: string, showingtime: number) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, text, showingtime, isExiting: false }]);

        setTimeout(() => {
            setToasts(prev => prev.map(toast => toast.id === id ? { ...toast, isExiting: true } : toast));
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, 300); // Animation duration
        }, showingtime - 300); // Start exit animation before full time
    }, []);

    const remove = useCallback((id: number) => {
        setToasts(prev => prev.map(toast => toast.id === id ? { ...toast, isExiting: true } : toast));
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 300); // Animation duration
    }, []);

    return { toasts, show, remove };
}
