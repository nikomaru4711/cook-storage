import { text } from "stream/consumers";

// constants/colors.ts などに配置
export const BRAND_COLORS = {
  primary: '#0070f3',    // Next.js ブルー
  secondary: '#e5f7ff',  // ライトブルー
  success: '#0070e0',    // 成功色
  danger: '#ff0000',     // 警告色
  text: '#333333',       // テキスト色
} as const; // "as const" をつけることで、値が固定され、型として抽出可能になります

// 型だけを抽出する
export type BrandColor = keyof typeof BRAND_COLORS;