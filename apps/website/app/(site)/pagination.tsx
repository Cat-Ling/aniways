'use client';
import { Button } from '@aniways/ui/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@aniways/ui/components/ui/tooltip';
import { cn } from '@ui/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

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
              <Link
                href={`${pathname}?${getParams(page - 1)}#${'recently-released'}`}
              >
                <ArrowLeft />
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
              <Link
                href={`${pathname}?${getParams(page + 1)}#${'recently-released'}`}
              >
                <ArrowRight />
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
