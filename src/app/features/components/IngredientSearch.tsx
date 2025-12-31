'use client';

import { useState, useEffect } from 'react';
import type { Recipe, ingredient } from '@/../../types';
import { getAllIngredients } from '../ingredient_crud.action';
import { searchRecipesByIngredient } from '../recipe_crud.action';
import { Title } from './Title';
import { Button } from './Button';

export function IngredientSearch() {
    const [ingredients, setIngredients] = useState<ingredient[]>([]);
    const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchIngredients = async () => {
            const result = await getAllIngredients();
            if (result.data) {
                setIngredients(result.data);
            }
        };
        fetchIngredients();
    }, []);

    const handleSearch = async () => {
        console.log("選択された材料のID:", selectedIngredientId);
        if (!selectedIngredientId) return;
        setLoading(true);
        const result = await searchRecipesByIngredient(selectedIngredientId);
        setLoading(false);
        if (result.data) {
            setSearchResults(result.data);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className="ingredient-search bg-gray-100 m-3 p-6 rounded-lg shadow-md border-2 border-gray-300">
            <Title
                text="材料からレシピ検索"
                color="text"
                size="large"
                isUnderline={true}
            />
            <div className="search-controls flex items-center gap-4 mb-4">
                <select
                    value={selectedIngredientId || ''}
                    onChange={(e) => {
                        console.log("選択：", e.target.value);
                        setSelectedIngredientId(e.target.value || null)
                    }}
                    className="p-2 border rounded"
                >
                    <option value="">材料を選択してください</option>
                    {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                            {ing.name}
                        </option>
                    ))}
                </select>
                <Button
                    onClick={handleSearch}
                    text="検索"
                    buttonColorType="confirm"
                />
            </div>
            {loading && <p>検索中...</p>}
            <div className="search-results">
                {searchResults.length === 0 && !loading ? (
                    <p>検索結果がありません。</p>
                ) : (
                    searchResults.map((recipe) => (
                        <div key={recipe.id} className="recipe-item flex justify-between items-center p-4 border rounded-lg mb-4 shadow-sm">
                            <div className="recipe-content">
                                <h3 className="text-lg font-semibold">{recipe.name}</h3>
                                {recipe.url && <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Recipe Link</a>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
