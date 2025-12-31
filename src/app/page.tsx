"use client"
import { List } from './features/components/List';
import { getAllRecipes } from './features/recipe_crud.action';
import { ToastTest } from './features/components/ToastTest';
import { ToastContainer } from '@/app/features/components/Toast';
import { useToast } from './features/hooks/useToast';
import { useCallback, useEffect, useState } from 'react';
import type { Recipe } from '@/../types';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { toasts, show, remove } = useToast();


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

  //最初に一度だけデータ取得
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
      <p>材料で検索</p>
      {/* <ToastTest /> */}
      <ToastContainer toasts={toasts} remove={remove} />

    </div>
  );
}
