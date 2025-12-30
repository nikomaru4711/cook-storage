"use client"
import { List } from './features/components/List';
import { getAllRecipes } from './features/recipe_crud.action';
import { ToastTest } from './features/components/ToastTest';
import { useToast } from './features/hooks/useToast';
import { use, useEffect, useState } from 'react';
import type { Recipe } from '@/../types';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const {show} = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try{
        const results = await getAllRecipes();
        if(!results.error)
          setRecipes(results.data);
      } catch (error) {
        console.error("データの取得に失敗しました。", error);
        show('error', 'データの取得に失敗しました。', 4000);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <List data={recipes} />
      <p>材料で検索</p>
      <ToastTest />

    </div>
  );
}
