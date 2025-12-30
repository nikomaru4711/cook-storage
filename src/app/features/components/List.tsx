'use client';

import type { Recipe } from '@/../types';
import { createRecipe, updateRecipe, deleteRecipe } from '../recipe_crud.action';
import { RecipeEditModal } from './RecipeEditModal';
import { RecipeCreateModal } from './RecipeCreateModal';
import { useState, useTransition } from 'react';
import { Title } from './Title';
import { Button} from './Button';

export function List({data}: {data: Recipe[]}) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [isPending, startTransition] = useTransition();



    const handleDelete = async (id: string) => {
        startTransition(async () => {
            await deleteRecipe(id);
        });
    };

    return (
        <div className="recipe-list bg-gray-100 m-3 p-6 rounded-lg shadow-md border-2 border-gray-300">
            <div className="flex justify-end">
                <Button
                    onClick={() => setIsCreating(true)}
                    text="新規レシピ追加"
                    buttonType="confirm"
                />
            </div>
            <Title
                text="レシピ一覧" 
                color="text"
                size="large"
                isUnderline={true}
            />
            {data.map((recipe) => (
                // レシピのカード部分
                <div key={recipe.id} className="recipe-item flex justify-between items-center p-4 border rounded-lg mb-4 shadow-sm">
                    <div className="recipe-content">
                        <h3 className="text-lg font-semibold">{recipe.name}</h3>
                        <p className="text-gray-600">{recipe.ingredients}</p>
                        {recipe.url && <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Recipe Link</a>}
                        <small className="text-gray-400">Created at: {new Date(recipe.created_at).toLocaleDateString()}</small>
                    </div>
                    <div className="actions flex gap-2">
                        <Button
                            onClick={() => setEditingRecipe(recipe)}
                            text="編集"
                            buttonType="confirm"
                        />
                        <Button
                            onClick={() => handleDelete(recipe.id)}
                            text="削除"
                            buttonType="delete"
                        />
                    </div>
                </div>
            ))}

            {editingRecipe && (
                <RecipeEditModal
                    recipe={editingRecipe}
                    isOpen={!!editingRecipe}
                    onClose={() => setEditingRecipe(null)}
                />
            )}

            <RecipeCreateModal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
            />
        </div>
    );
}
