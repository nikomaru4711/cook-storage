
'use client';

import type { Recipe } from '@/../types';
import { updateRecipe } from '../recipe_crud.action';
import { useState, useTransition } from 'react';

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
        ingredients: recipe.ingredients
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('url', formData.url);
        form.append('ingredients', formData.ingredients);

        startTransition(async () => {
            await updateRecipe(recipe.id, form);
            onClose();
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                        <label className="block text-sm font-medium mb-2">材料</label>
                        <textarea
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            required
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
