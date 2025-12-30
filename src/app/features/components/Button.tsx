import { ButtonElement } from '@/../types';

export function Button({onClick, text, buttonType}: ButtonElement) {
        const Styles = {
        normal: 'px-3 py-1 bg-gray-500 text-black rounded hover:bg-gray-500',
        confirm: 'px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600',
        delete: 'px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50',
    };
    return (
        <button 
            onClick={onClick} 
            className={`${Styles[buttonType]}`}
        >
            {text}
        </button>
    );
}