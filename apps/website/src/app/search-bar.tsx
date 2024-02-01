'use client';

import { Input } from '@aniways/ui/components/ui/input';
import { cn } from '@aniways/ui/lib/utils';
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
    <div className="group relative">
      <Input
        placeholder="Search for anime"
        className={cn('w-[264px] pl-9 focus:w-[500px]')}
        defaultValue={query}
        onChange={e => setQuery(e.target.value)}
      />
      <Search
        className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform"
        size={18}
      />
    </div>
  );
};
