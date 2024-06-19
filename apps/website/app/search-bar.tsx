'use client';

import { Input } from '@aniways/ui/components/ui/input';
import { cn } from '@aniways/ui/lib/utils';
import { Button } from '@ui/components/ui/button';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const SearchBarFallback = () => {
  return (
    <div className="group relative">
      <Input
        placeholder="Search for anime"
        className={cn('w-full pl-9')}
        disabled
      />
      <Search
        className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform"
        size={18}
      />
    </div>
  );
};

export const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query') || '';

  useEffect(() => {
    if (pathname === '/search') return;
    if (!ref.current) return;
    ref.current.value = '';
  }, [pathname, searchParams]);

  return (
    <form
      className="group relative"
      onSubmit={e => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const query = formData.get('query') as string;

        if (query === '') return router.push('/', { scroll: false });

        router.push(`/search?query=${query}`);
      }}
    >
      <Input
        ref={ref}
        name="query"
        placeholder="Search for anime"
        className={cn('w-full pl-9 md:w-96')}
        defaultValue={query}
        autoComplete="off"
      />
      <Button
        type="button"
        variant={'link'}
        size="sm"
        tabIndex={-1}
        className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 p-0 opacity-0 transition group-focus-within:pointer-events-auto group-focus-within:opacity-100"
        onClick={e => {
          e.currentTarget.blur();
          if (!ref.current) return;
          ref.current.value = '';
          router.push('/', { scroll: false });
        }}
      >
        Clear
      </Button>
      <Search
        className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform"
        size={18}
      />
    </form>
  );
};
