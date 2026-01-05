import React from 'react';
import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative w-full h-full overflow-hidden',
      className
    )}
    {...props}
  >
    <div className="w-full h-full overflow-auto">
      {children}
    </div>
  </div>
));

ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef(({ className, orientation = 'vertical', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute bg-gray-300 hover:bg-gray-400 rounded-full transition-colors',
      orientation === 'vertical' ? 'w-2 right-0 top-0 bottom-0' : 'h-2 bottom-0 left-0 right-0',
      className
    )}
    {...props}
  />
));

ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
