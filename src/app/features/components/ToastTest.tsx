'use client';

import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';
import { Button } from './Button';

export function ToastTest() {
    const { toasts, show, remove } = useToast();

    return (
        <>
            <div className="space-x-2">
                <Button onClick={() => show('success', 'Success message', 3000)} text="Show Success" buttonType="confirm" />
                <Button onClick={() => show('error', 'Error message', 3000)} text="Show Error" buttonType="delete" />
                <Button onClick={() => show('info', 'Info message', 3000)} text="Show Info" buttonType="normal" />
                <Button onClick={() => show('warning', 'Warning message', 3000)} text="Show Warning" buttonType="normal" />
            </div>
            <ToastContainer toasts={toasts} remove={remove} />
        </>
    );
}
