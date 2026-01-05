import React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
      className
    )}
    {...props}
  />
));

Select.displayName = 'Select';

const SelectContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50', className)} {...props} />
));

SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef(({ className, ...props }, ref) => (
  <option ref={ref} className={cn('', className)} {...props} />
));

SelectItem.displayName = 'SelectItem';

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  >
    {children}
  </button>
));

SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder = 'Select...' }) => <span className="text-gray-400">{placeholder}</span>;

SelectValue.displayName = 'SelectValue';

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
