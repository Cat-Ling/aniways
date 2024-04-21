'use client';

import { Button } from '@aniways/ui/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@aniways/ui/components/ui/tooltip';
import { cn } from '@aniways/ui/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Skeleton } from '@aniways/ui/components/ui/skeleton';

export const PaginationLoader = () => {
  return (
    <div className="grid h-[40px] w-full grid-cols-3 items-center md:w-[120px]">
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
    </div>
  );
};

export const Pagination = ({ hasNext }: { hasNext: boolean }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get('page') || '1');

  const getParams = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
      return params.toString();
    }
    params.set('page', String(page));
    return params.toString();
  };

  return (
    <div className="grid grid-cols-3 place-items-center items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              variant={'ghost'}
              disabled={page === 1}
              className={cn(page === 1 && 'pointer-events-none opacity-50')}
              asChild
            >
              <Link href={`${pathname}?${getParams(page - 1)}`}>
                <ArrowLeft />
                <span className="sr-only">Previous Page</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Previous Page</p>
          </TooltipContent>
        </Tooltip>
        <p className="text-muted-foreground">{page || 1}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              variant={'ghost'}
              disabled={!hasNext}
              className={cn(!hasNext && 'pointer-events-none opacity-50')}
              asChild
            >
              <Link href={`${pathname}?${getParams(page + 1)}`}>
                <ArrowRight />
                <span className="sr-only">Next Page</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Next Page</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
