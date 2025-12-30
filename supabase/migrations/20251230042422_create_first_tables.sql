create table ingredients (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


create table recipes (
  id bigint generated always as identity primary key,
  name text not null,
  url text,
  ingredients text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table recipe_ingredients (
  recipe_id bigint references recipes(id) on delete cascade,
  ingredient_id bigint references ingredients(id) on delete cascade,
  amount text, -- 「100g」や「2個」など
  primary key (recipe_id, ingredient_id)
);

-- RLS（行単位セキュリティ）を有効にする（今回は簡単のため、誰でも操作可能に設定）
alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;

create policy "Allow public access" on ingredients for all using (true) with check (true);
create policy "Allow public access" on recipes for all using (true) with check (true);
create policy "Allow public access" on recipe_ingredients for all using (true) with check (true);