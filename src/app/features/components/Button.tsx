import * as React from "react";
import { cn } from "@/../lib/utils";

// ボタン独自のプロパティを定義
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonColorType: 'normal' | 'confirm' | 'delete' | `#${string}` | 'none';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, className, children, disabled, ...props }, ref) => {
    const Styles = {
        normal: 'px-3 py-1 bg-gray-500 text-black rounded hover:bg-gray-500',
        confirm: 'px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600',
        delete: 'px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50',
        none: ''
    };

    const isPresetColor = props.buttonColorType in Styles;
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          `px-3 py-1 rounded font-medium ${isPresetColor ? Styles[props.buttonColorType as keyof typeof Styles] : ``}`,
          className
        )}
        ref={ref}
        // ローディング中もクリックできないように disabled を制御
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };