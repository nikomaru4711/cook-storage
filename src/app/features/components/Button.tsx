import { ButtonElement } from '@/../types';

export function Button({ onClick, text, customClass, buttonColorType }: ButtonElement) {
    const Styles = {
        normal: 'px-3 py-1 bg-gray-500 text-black rounded hover:bg-gray-500',
        confirm: 'px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600',
        delete: 'px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50',
    };

    // buttonColorType が Styles のキー（normal, confirm, delete）に含まれているか判定
    const isPresetColor = buttonColorType in Styles;

    return (
        <button 
            onClick={onClick} 
            // プリセットの場合はクラスを適用、そうでない場合は共通スタイルのみ適用
            // className={isPresetColor ? Styles[buttonColorType as keyof typeof Styles] : `px-3 py-1 text-white rounded ${customClass || ''}`}
            className={`px-3 py-1 rounded ${isPresetColor ? Styles[buttonColorType as keyof typeof Styles] : ``}  ${customClass || ''}`}
            // カラーコードが渡された場合のみ、style属性で背景色を指定
            style={!isPresetColor ? { backgroundColor: buttonColorType } : {}}
        >
            {text}
        </button>
    );
}