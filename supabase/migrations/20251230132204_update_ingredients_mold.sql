-- 1. recipe_ingredients テーブルを削除
-- (CASCADEを付けることで、もし外部キー制約があっても一緒に削除します)
DROP TABLE IF EXISTS recipe_ingredients CASCADE;

-- 2. 既存の recipes テーブルの ingredients カラムの型を jsonb に変更
-- 型を text[] から jsonb に変換します
ALTER TABLE recipes 
  ALTER COLUMN ingredients SET DATA TYPE jsonb 
  USING to_jsonb(ingredients);

-- 3. (任意) デフォルト値を空の配列 '[]' に設定し、NULLを防ぐ
ALTER TABLE recipes 
  ALTER COLUMN ingredients SET DEFAULT '[]'::jsonb;