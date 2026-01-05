import React from 'react';
import { cn } from '@/lib/utils';

export function Shimmer({ className }) {
  return (
    <div className={cn(
      'relative overflow-hidden bg-gray-200 rounded-lg',
      'before:absolute before:inset-0',
      'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
      'before:animate-[shimmer_2s_infinite]',
      className
    )} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        <Shimmer className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Shimmer className="h-5 w-3/4" />
          <Shimmer className="h-4 w-1/2" />
          <Shimmer className="h-4 w-2/3" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Shimmer className="h-8 w-20 rounded-full" />
        <Shimmer className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer 
          key={i} 
          className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')} 
        />
      ))}
    </div>
  );
}