import { z } from 'zod';

/**
 * 料理登録用スキーマ
 */
export const createRecipeSchema = z.object({
    name: z
    .string()
    .min(1, '料理名は必須です')
    .max(100, '料理名は100文字以内で入力してください'),
    url: z
    .string()
    .url('有効なURLを入力してください')
    .optional(),
    ingredients: z
    .string()
    .max(500, '材料は500文字以内で入力してください')
})