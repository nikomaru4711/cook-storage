"use server"
import { createClient } from '../utils/supabase/client'


// レシピ一覧の取得
export async function getAllRecopes() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
    if (!data || error)
        throw new Error("データの取得に失敗しました。");
    return data;
}