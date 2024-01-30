'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const Pagination = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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

  const setPage = (page: number) => {
    replace(`${pathname}?${getParams(page)}`);
  };

  return (
    <div className="grid grid-cols-3 items-center place-items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              variant={'ghost'}
              disabled={page === 1}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <ArrowLeft />
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
              onClick={() => {
                console.log('hello');
                setPage(page + 1);
              }}
            >
              <ArrowRight />
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
