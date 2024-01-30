'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

export const SearchBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query') || '';

  const setQuery = debounce((query: string) => {
    if (query === '') return router.replace('/');
    router.replace(`/search?query=${query}`);
  }, 500);

  return (
    <div className="relative group">
      <Input
        placeholder="Search for anime"
        className={cn('w-[264px] pl-9 focus:w-[500px]')}
        defaultValue={query}
        onChange={e => setQuery(e.target.value)}
      />
      <Search
        className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground"
        size={18}
      />
    </div>
  );
};
