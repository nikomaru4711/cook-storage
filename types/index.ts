import { BRAND_COLORS, BrandColor } from '@/../../types/colors';

export type Recipe = {
    id: string;
    name: string;
    url?: string;
    ingredients: string;
    created_at: string;
}

export type ingredient = {
    id: string;
    name: string;
    created_at: string;
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