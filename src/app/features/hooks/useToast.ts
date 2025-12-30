import { useState, useCallback } from 'react';
import { ToastElement } from '@/../types';

let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState<(ToastElement & { id: number })[]>([]);

    const show = useCallback((type: ToastElement['type'], text: string, showingtime: number) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, text, showingtime }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, showingtime);
    }, []);

    const remove = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return { toasts, show, remove };
}
