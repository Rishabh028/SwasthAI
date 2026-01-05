import React from 'react';
import { cn } from '@/lib/utils';

const DropdownMenuContext = React.createContext();

const DropdownMenu = ({ children, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={ref} className="relative inline-block text-left" {...props}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('useDropdownMenu must be used within DropdownMenu');
  }
  return context;
};

const DropdownMenuTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  const { isOpen, setIsOpen } = useDropdownMenu();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick: (e) => {
        setIsOpen(!isOpen);
        children.props?.onClick?.(e);
      },
      ...props
    });
  }

  return (
    <button
      ref={ref}
      className={cn('', className)}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
    </button>
  );
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = React.forwardRef(({ className, align = 'start', ...props }, ref) => {
  const { isOpen, setIsOpen } = useDropdownMenu();

  if (!isOpen) return null;

  const alignClass = align === 'end' ? 'right-0' : 'left-0';

  return (
    <div
      ref={ref}
      className={cn(
        `absolute ${alignClass} z-50 min-w-[200px] origin-top-right rounded-md bg-white p-1 shadow-md border border-gray-200`,
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    />
  );
});

DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef(({ className, asChild, children, ...props }, ref) => {
  const { setIsOpen } = useDropdownMenu();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      className: cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 w-full text-left hover:bg-gray-100 transition-colors',
        children.props?.className
      ),
      onClick: (e) => {
        setIsOpen(false);
        children.props?.onClick?.(e);
      },
      ...props
    });
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 w-full text-left hover:bg-gray-100 transition-colors',
        className
      )}
      onClick={() => setIsOpen(false)}
      {...props}
    />
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('-mx-1 my-1 h-px bg-gray-200', className)} {...props} />
));

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator };
