import React from 'react';
import { cn } from '@/lib/utils';

const RadioGroupContext = React.createContext();

const RadioGroup = React.forwardRef(({ className, value, onValueChange, disabled, ...props }, ref) => (
  <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
    <div ref={ref} className={cn('grid gap-2', className)} role="radiogroup" {...props} />
  </RadioGroupContext.Provider>
));

RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef(({ className, value, disabled: itemDisabled, id, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);
  const disabled = itemDisabled || context?.disabled;
  const isChecked = context?.value === value;

  const handleChange = (e) => {
    e.stopPropagation();
    if (!disabled && context?.onValueChange) {
      context.onValueChange(value);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      if (context?.onValueChange) {
        context.onValueChange(value);
      }
    }
  };

  return (
    <input
      ref={ref}
      type="radio"
      id={id}
      value={value}
      checked={isChecked}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        'appearance-none h-4 w-4 rounded-full border-2 border-gray-300 cursor-pointer transition-all',
        'checked:bg-blue-600 checked:border-blue-600',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
