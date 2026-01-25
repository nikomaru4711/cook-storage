"use client"
import { List } from './features/components/List';
import { IngredientSearch } from './features/components/IngredientSearch';
import { getAllRecipes } from './features/recipe_crud.action';
import { ToastTest } from './features/components/ToastTest';
import { ToastContainer } from '@/app/features/components/Toast';
import { useToast } from './features/hooks/useToast';
import { useCallback, useEffect, useState } from 'react';
import type { Recipe, ingredient } from '@/../types';
import { getAllIngredients } from './features/ingredient_crud.action';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<ingredient[]>([]);
  const { toasts, show, remove } = useToast();

  //材料リストの取得処理
  useEffect(() => {
      const fetchIngredients = async () => {
          const result = await getAllIngredients();
          if (result.data) {
              setIngredients(result.data);
          }
        }
      fetchIngredients();
  }, [recipes]);

  //関数を引数に渡すためにuseEffect外に記述
  const fetchData = useCallback(async () => {
    try{
      const results = await getAllRecipes();
      if(!results.error){
        setRecipes(results.data);
      }
      console.log("results.data:", results.data);
    } catch (error) {
      console.error("データの取得に失敗しました。", error);
      show('error', 'データの取得に失敗しました。', 4000);
    }
  },[show]);

  //データ取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <List
        data={recipes}
        show={show}
        getData={fetchData}
       />
      <IngredientSearch
        ingredients={ingredients}
      />
      {/* <ToastTest /> */}
      <ToastContainer toasts={toasts} remove={remove} />

    </div>
  );
}
