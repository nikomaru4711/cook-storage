"use server"
import { createClient } from '../utils/supabase/client'
import { createRecipeSchema } from './recipe_crud.schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

// レシピの作成
export async function createRecipe(formData: FormData) {
    const supabase = createClient();

    const name = formData.get('name') as string;
    const url = formData.get('url') as string;

    //ingredientsの取り扱いは今後修正する予定
    const ingredients = formData.get('ingredients') as string;

    const validatedData = createRecipeSchema.safeParse({ 
        name, 
        url: url || undefined, 
        ingredients 
    });

    if (!validatedData.success) {
        // ここでエラーメッセージを返却する処理などを記述
        throw new Error("入力内容が正しくありません。");
    }
    const { data, error } = await supabase
        .from('recipes')
        .insert([validatedData])
        .select();

    if (error) {
        throw new Error("レシピの作成に失敗しました。");
    }

    revalidatePath('/');
    redirect('/');
}

// レシピの更新
export async function updateRecipe(id: string, formData: FormData) {
    const supabase = createClient();

    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const ingredients = formData.get('ingredients') as string;

    const validatedData = createRecipeSchema.parse({ name, url: url || undefined, ingredients });

    // 現在ingredientsの保存方法が適切でないためエラーが発生する。
    const { data, error } = await supabase
        .from('recipes')
        .update(validatedData)
        .eq('id', id)
        .select();

    if (error) {
        throw new Error("レシピの更新に失敗しました。");
    }

    revalidatePath('/');
    redirect('/');
}

// レシピの削除
export async function deleteRecipe(id: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error("レシピの削除に失敗しました。");
    }

    revalidatePath('/');
    redirect('/');
}
