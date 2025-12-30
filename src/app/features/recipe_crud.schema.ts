import { z } from 'zod';

/**
 * レシピ用スキーマ
 */
export const recipeSchema = z.object({
    name: z
    .string()
    .min(1, '料理名は必須です')
    .max(100, '料理名は100文字以内で入力してください'),
    url: z
    .string()
    .url('有効なURLを入力してください')
    .optional()
})