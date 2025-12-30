import { List } from './features/components/List';
import { getAllRecopes } from './features/recipe_crud.action';

export default async function Home() {
  const recipes = await getAllRecopes();

  return (
    <div>
      <List data={recipes} />
      <p>材料で検索</p>

    </div>
  );
}
