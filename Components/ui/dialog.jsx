import React from 'react';
import { cn } from '@/lib/utils';

const Dialog = ({ open, onOpenChange, children, ...props }) => {
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center', !open && 'hidden')} {...props}>
      {children}
    </div>
  );
};

Dialog.displayName = 'Dialog';

const DialogTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn('', className)} {...props} />
));

DialogTrigger.displayName = 'DialogTrigger';

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <>
    <div className="fixed inset-0 z-50 bg-black/50" />
    <div
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  </>
));

DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }) => <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />;

DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }) => <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />;

DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />);

DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />);

DialogDescription.displayName = 'DialogDescription';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
