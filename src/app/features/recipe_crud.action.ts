"use server"
import { createClient } from '../utils/supabase/client'
import { recipeSchema } from './recipe_crud.schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Recipesテーブルの情報を取得する。
export async function getAllRecipes() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
    if (!data || error)
        return {data: null, error: "データの取得に失敗しました。"};
    return {data, error: null};
}

// レシピの作成
export async function createRecipe(formData: FormData) {
    const supabase = createClient();

    const name = formData.get('name') as string;
    const url = formData.get('url') as string;

    const validatedData = recipeSchema.safeParse({ 
        name, 
        url: url || undefined, 
    });

    if (!validatedData.success) {
        return {success: false, error: "入力情報に誤りがあります。"};
    }
    const { error } = await supabase
        .from('recipes')
        .insert(validatedData.data)
        .select();

    if (error) {
        return {success: false, error: "レシピの作成に失敗しました。"};
    }

    revalidatePath('/');
    return {success: true, error: null};
}

// レシピの更新
export async function updateRecipe(id: number, formData: FormData) {
    const supabase = createClient();
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;

    const validatedData = recipeSchema.safeParse({ 
        name,
        url: url || undefined,
    });

    if (!validatedData.success) {
        return {success: false, error: "入力情報に誤りがあります。"};
    }

    const { error } = await supabase
        .from('recipes')
        .update(validatedData.data)
        .eq('id', id)
        .select();

    if (error) {
        return {success: false, error: "レシピの更新に失敗しました。"};
    }

    revalidatePath('/');
    return {success: true, error: null};
}

// レシピの削除
export async function deleteRecipe(id: number) {
    const supabase = createClient();

    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

    if (error)
        return {success: false, error: "レシピの削除に失敗しました。"};

    revalidatePath('/');
    return {success: true, error: null};
}
