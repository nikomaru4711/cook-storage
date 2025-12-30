"use server"
import { createClient } from '../utils/supabase/client'
import { revalidatePath } from 'next/cache'

// Ingredientsテーブルの情報を取得する。
export async function getAllIngredients() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name', { ascending: true });
    if (!data || error)
        return {data: null, error: "データの取得に失敗しました。"};
    return {data, error: null};
}