'use client';

import { Input } from '@aniways/ui/components/ui/input';
import { cn } from '@aniways/ui/lib/utils';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import { useEffect, useRef } from 'react';

export const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query') || '';

  const setQuery = debounce((query: string) => {
    if (query === '') return router.push('/');
    router.push(`/search?query=${query}`);
  }, 500);

  useEffect(() => {
    if (pathname === '/search') return;
    if (!ref.current) return;
    ref.current.value = '';
  }, [pathname, searchParams]);

  return (
    <div className="group relative">
      <Input
        ref={ref}
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
