import { createClient } from '@/app/utils/supabase/client';
import { List } from './features/components/List';

export default function Home() {
  return (
    <div>
      開発中
      <List data={[]} />
    </div>
  );
}
