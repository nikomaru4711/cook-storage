"use server"
import { createClient } from '../utils/supabase/client'
import { recipeSchema } from './recipe_crud.schema'
import { revalidatePath } from 'next/cache'
import type { Recipe } from '@/../../types'

// Recipesテーブルの情報を取得する。
export async function getAllRecipes() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
    if (!data || error)
        return {data: [], error: "データの取得に失敗しました。"};
    return {data, error: null};
}

// レシピと材料を取得する。
export async function getRecipeWithIngredients(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('recipes')
        .select(`
            *,
            recipe_ingredients (
                ingredient_id,
                ingredients (
                    id,
                    name
                )
            )
        `)
        .eq('id', id)
        .single();
    if (!data || error)
        return {data: null, error: "データの取得に失敗しました。"};
    return {data, error: null};
}

// レシピの作成
export async function createRecipe(formData: FormData) {
    const supabase = createClient();

    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const ingredientsJson = formData.get('ingredients') as string;
    const ingredients = JSON.parse(ingredientsJson);

    const validatedData = recipeSchema.safeParse({
        name,
        url: url || undefined,
    });

    if (!validatedData.success) {
        return {success: false, error: "入力情報に誤りがあります。"};
    }

    // レシピ作成
    const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert(validatedData.data)
        .select()
        .single();

    if (recipeError || !recipe) {
        return {success: false, error: recipeError};
    }

    // 材料処理
    for (const ing of ingredients) {
        let ingredientId = ing.id;
        // 新規材料の場合
        if (ing.id >= 1000000000000) { // 仮ID (Date.now())
            const { data: newIng, error: ingError } = await supabase
                .from('ingredients')
                .insert({ name: ing.name })
                .select('id')
                .single();
            if (ingError || !newIng) {
                return {success: false, error: "材料の作成に失敗しました。"};
            }
            ingredientId = newIng.id;
        }

        // recipe_ingredients 挿入
        const { error: relError } = await supabase
            .from('recipe_ingredients')
            .insert({ recipe_id: recipe.id, ingredient_id: ingredientId });

        if (relError) {
            return {success: false, error: "レシピ材料の関連付けに失敗しました。"};
        }
    }

    revalidatePath('/');
    return {success: true, error: null};
}

// レシピの更新
export async function updateRecipe(id: string, formData: FormData) {
    const supabase = createClient();
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const ingredientsJson = formData.get('ingredients') as string;
    const ingredients = JSON.parse(ingredientsJson);

    const validatedData = recipeSchema.safeParse({
        name,
        url: url || undefined,
    });

    if (!validatedData.success) {
        return {success: false, error: "入力情報に誤りがあります。"};
    }

    // レシピ更新
    const { error: updateError } = await supabase
        .from('recipes')
        .update(validatedData.data)
        .eq('id', id);

    if (updateError) {
        return {success: false, error: "レシピの更新に失敗しました。"};
    }

    // 既存の材料関連を削除
    const { error: deleteError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', id);

    if (deleteError) {
        return {success: false, error: "既存材料の削除に失敗しました。"};
    }

    // 新しい材料処理
    for (const ing of ingredients) {
        let ingredientId = ing.id;
        // 新規材料の場合
        if (ing.id >= 1000000000000) { // 仮ID (Date.now())
            const { data: newIng, error: ingError } = await supabase
                .from('ingredients')
                .insert({ name: ing.name })
                .select('id')
                .single();
            if (ingError || !newIng) {
                return {success: false, error: "材料の作成に失敗しました。"};
            }
            ingredientId = newIng.id;
        }

        // recipe_ingredients 挿入
        const { error: relError } = await supabase
            .from('recipe_ingredients')
            .insert({ recipe_id: id, ingredient_id: ingredientId });

        if (relError) {
            return {success: false, error: "レシピ材料の関連付けに失敗しました。"};
        }
    }

    revalidatePath('/');
    return {success: true, error: null};
}

// レシピの削除
export async function deleteRecipe(id: string) {
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

// 材料からレシピを検索
export async function searchRecipesByIngredient(ingredientId: string): Promise<{data: Recipe[], error: string | null}> {
    console.log("材料からレシピを検索します");
    const supabase = createClient();
    const { data, error } = await supabase
        .from('recipe_ingredients')
        .select(`
            recipes (
                id,
                name,
                url,
                created_at
            )
        `)
        .eq('ingredient_id', ingredientId);
    if (!data || error){
        console.log("データ取得に失敗");
        return {data: [], error: "データの取得に失敗しました。"};
    }



    // data は Recipe_Ingredient の配列で、各要素に recipes オブジェクトがある
    const recipes = data.map(item => item.recipes).filter(recipe => recipe !== null) as Recipe[];
    console.log("データ取得に成功：", recipes);
    return {data: recipes, error: null};
}
