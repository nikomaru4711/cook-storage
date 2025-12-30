
'use client';

import type { Recipe } from '@/../types';
import { updateRecipe, getRecipeWithIngredients } from '../recipe_crud.action';
import { getAllIngredients } from '../ingredient_crud.action';
import { useState, useTransition, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { ingredient } from '../../../../types/index';
import { redirect } from 'next/navigation';

interface RecipeEditModalProps {
    recipe: Recipe;
    isOpen: boolean;
    onClose: () => void;
}

export function RecipeEditModal({ recipe, isOpen, onClose }: RecipeEditModalProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        name: recipe.name,
        url: recipe.url || '',
        ingredients: [] as ingredient[]
    });
    const [allIngredients, setAllIngredients] = useState<ingredient[]>([]);
    const [inputValue, setInputValue] = useState('');
    const {show} = useToast();

    useEffect(() => {
        const fetchData = async () => {
            // 既存の材料を取得
            const recipeResult = await getRecipeWithIngredients(recipe.id);
            if (recipeResult.data) {
                const ings = recipeResult.data.recipe_ingredients.map((ri: any) => ri.ingredients);
                setFormData(prev => ({ ...prev, ingredients: ings }));
            }

            // 全材料を取得
            const allResult = await getAllIngredients();
            if (allResult.data) {
                setAllIngredients(allResult.data);
            }
        };
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, recipe.id]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('url', formData.url);
        form.append('ingredients', JSON.stringify(formData.ingredients));

        startTransition(async () => {
            const result = await updateRecipe(recipe.id, form);
            if(!result.success){
                show('error', 'レシピの更新に失敗しました。', 4000);
                return;
            }
            show('success', 'レシピが更新されました。', 4000);
            onClose();
            redirect("/");
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddIngredient = () => {
        if (!inputValue.trim()) return;
        const trimmed = inputValue.trim();
        const existing = allIngredients.find(ing => ing.name.toLowerCase() === trimmed.toLowerCase());
        const ing = existing || { id: Date.now(), name: trimmed };
        if (!formData.ingredients.some(i => i.id === ing.id)) {
            setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ing] }));
        }
        setInputValue('');
    };

    const handleRemoveIngredient = (id: number) => {
        setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter(i => i.id !== id) }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddIngredient();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">レシピ編集</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">料理名</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">URL (任意)</label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">材料(ひらがな入力)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.ingredients.map(ing => (
                                <span key={ing.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                                    {ing.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIngredient(ing.id)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="材料を入力してEnterまたは,で追加"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            disabled={isPending}
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending ? '更新中...' : '更新'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
