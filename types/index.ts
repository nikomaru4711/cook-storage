import { BrandColor } from '@/../../types/colors';

export type Recipe = {
    id: string;
    name: string;
    url?: string | null;
    created_at: string;
    ingredients?: string[] | null; // for backward compatibility, but will be removed
}

export type ingredient = {
    id: string;
    name: string;
}

export type Recipe_Ingredient = {
    id : string;
    recipe_id: string;
    ingredient_id: string;
    amount?: string | null;
}

export type TitleElement = {
    text: string;
    size: 'small' | 'medium' | 'large';
    isUnderline: boolean;
    // 'primary' | 'secondary' | ... のいずれかのみを許可
    color: BrandColor; 
}

export type ButtonElement = {
    onClick: () => void;
    text: string;
    className?: string;
    buttonColorType: 'normal' | 'confirm' | 'delete' | `#${string}`;
}

export type ToastElement = {
    type: 'success' | 'error' | 'info' | 'warning';
    text: string;
    showingtime: number;
}
