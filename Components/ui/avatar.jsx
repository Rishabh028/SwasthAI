import React from 'react';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100', className)}
    {...props}
  />
));

Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <img ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
));

AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center justify-center font-medium text-gray-600', className)} {...props} />
));

AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
