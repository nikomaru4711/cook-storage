'use client';

import { useState, useEffect } from 'react';
import type { Recipe, ingredient } from '@/../../types';
import { getAllIngredients } from '../ingredient_crud.action';
import { searchRecipesByIngredient, searchRecipesByIngredientName } from '../recipe_crud.action';
import { Title } from './Title';
import { Button } from './Button';
import { BrandColor } from '@/../../types/colors';

export function IngredientSearch({ingredients}: {ingredients: ingredient[]}) {
    ///※レシピ一覧にてデータ追加された場合にタグを更新(または取得)しなければいけない
    const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);


    const handleSearch = async () => {
        console.log("選択された材料のID:", selectedIngredientId);
        console.log("検索テキスト:", searchText);
        setLoading(true);
        let result;
        if (searchText.trim()) {
            result = await searchRecipesByIngredientName(searchText.trim());
        } else if (selectedIngredientId) {
            result = await searchRecipesByIngredient(selectedIngredientId);
        } else {
            setLoading(false);
            return;
        }
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
            テキストまたはドロップダウンに材料を入力してください
            <div className="flex justify-center items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="材料名を入力"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        if (e.target.value.trim()) {
                            setSelectedIngredientId(null);
                        }
                    }}
                    className="p-2 w-1/2 border rounded"
                />
                <select
                    value={selectedIngredientId || ''}
                    onChange={(e) => {
                        console.log("選択：", e.target.value);
                        setSelectedIngredientId(e.target.value || null);
                        if (e.target.value) {
                            setSearchText('');
                        }
                    }}
                    className="p-3 w-1/2 border rounded"
                >
                    <option value="">または材料を選択</option>
                    {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                            {ing.name}
                        </option>
                    ))}
                </select>
            </div>

            <Button 
                onClick={handleSearch} 
                className='w-full mb-3'
                buttonColorType="confirm"
            >
                {loading ? '検索中...' : '検索'}
            </Button>

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
