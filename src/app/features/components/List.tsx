'use client';

import type { Recipe } from '@/../types';
import { deleteRecipe } from '../recipe_crud.action';
import { RecipeEditModal } from './RecipeEditModal';
import { RecipeCreateModal } from './RecipeCreateModal';
import { useState, useTransition } from 'react';
import { Title } from './Title';
import { Button } from './Button';
import { ToastElement } from '@/../types';

interface ListProps {
    data: Recipe[];
    show: (type: ToastElement['type'], text: string, showingtime: number) => void;
    getData: () => void;
}

export function List({data, show, getData}: ListProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [isPending, startTransition] = useTransition();
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);


    const handleDelete = async (id: number) => {
        startTransition(async () => {
            const result = await deleteRecipe(id);
            if(!result.success){
                show('error', 'レシピの削除に失敗しました。', 4000);
                return;
            }
            show('success', 'レシピが削除されました。', 4000);
            await getData();
        });
    };

    return (
        <div className="recipe-list bg-gray-100 m-3 p-6 rounded-lg shadow-md border-2 border-gray-300">
            <div className="flex justify-end">
                <Button
                    onClick={() => setIsCreating(true)}
                    text="＋レシピ追加"
                    buttonType="confirm"
                />
            </div>
            <Title
                text="レシピ一覧"
                color="text"
                size="large"
                isUnderline={true}
            />
            <div className="list-container h-128 overflow-y-auto">
                {data.length === 0 ? (<p>レシピが存在しません。</p>
                ) : (
                paginatedData.map((recipe) => (
                    // レシピのカード部分
                    <div key={recipe.id} className="recipe-item flex justify-between items-center p-4 border rounded-lg mb-4 shadow-sm">
                        <div className="recipe-content">
                            <h3 className="text-lg font-semibold">{recipe.name}</h3>
                            {recipe.url && <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Recipe Link</a>}
                            {/* <small className="text-gray-400">Created at: {new Date(recipe.created_at).toLocaleDateString()}</small> */}
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
                )))}
            </div>

            {totalPages > 1 && (
                <div className="pagination flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        前へ
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        次へ
                    </button>
                </div>
            )}

            {editingRecipe && (
                <RecipeEditModal
                    recipe={editingRecipe}
                    isOpen={!!editingRecipe}
                    onClose={() => setEditingRecipe(null)}
                    show={show}
                    getData={getData}
                />
            )}

            <RecipeCreateModal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                show={show}
                getData={getData}
            />
        </div>
    );
}
