import { TitleElement } from "@/../types";
import { BRAND_COLORS } from "@/../types/colors";

export function Title({text, color, size, isUnderline}:TitleElement) {
    const textColor = BRAND_COLORS[color];
    const sizeStyles = {
        small: 'text-sm',
        medium: 'text-xl',
        large: 'text-4xl font-bold',
    };

    return (
        <h1 
            className={`${sizeStyles[size]} mb-3`}
            style={{ color: textColor }}
        >
            {text}
            {isUnderline && <hr className="border-t-2 mt-1 mb-3" style={{ borderColor: textColor }} />}
        </h1>
    );
};