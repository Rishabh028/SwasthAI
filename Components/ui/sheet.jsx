import React from 'react';
import { cn } from '@/lib/utils';

const Sheet = ({ open, onOpenChange, children, ...props }) => {
  return (
    <div className={cn('fixed inset-0 z-50', !open && 'hidden')} {...props}>
      {children}
    </div>
  );
};

Sheet.displayName = 'Sheet';

const SheetTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn('', className)} {...props} />
));

SheetTrigger.displayName = 'SheetTrigger';

const SheetContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <>
    <div className="fixed inset-0 z-50 bg-black/50" />
    <div
      ref={ref}
      className={cn(
        'fixed right-0 top-0 z-50 w-3/4 max-w-sm h-screen bg-white shadow-lg p-6 overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  </>
));

SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }) => <div className={cn('flex flex-col space-y-2', className)} {...props} />;

SheetHeader.displayName = 'SheetHeader';

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-lg font-semibold text-gray-900', className)} {...props} />);

SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />);

SheetDescription.displayName = 'SheetDescription';

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription };
