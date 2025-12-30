-- レシピ本体
create table recipes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 材料マスタ
create table ingredients (
  id uuid default gen_random_uuid() primary key,
  name text unique not null
);

-- レシピと材料の紐付け
create table recipe_ingredients (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id),
  amount text
);

alter table recipes enable row level security;
alter table ingredients enable row level security;
alter table recipe_ingredients enable row level security;

create policy "Allow public access" on recipes for all using (true) with check (true);
create policy "Allow public access" on ingredients for all using (true) with check (true);
create policy "Allow public access" on recipe_ingredients for all using (true) with check (true);