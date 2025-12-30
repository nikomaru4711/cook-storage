import { BRAND_COLORS, BrandColor } from '@/../../types/colors';

export type Recipe = {
    id: number;
    name: string;
    url?: string | null;
    created_at: string;
}

export type ingredient = {
    id: string;
    name: string;
}

export type Recipe_Ingredient = {
    id : number;
    recipe_id: number;
    ingredient_id: number;
    amount?: number | null;
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
    buttonType: 'normal' | 'confirm' | 'delete';
}

export type ToastElement = {
    type: 'success' | 'error' | 'info' | 'warning';
    text: string;
    showingtime: number;
}
