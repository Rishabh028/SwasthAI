import React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ className, min = 0, max = 100, step = 1, value, onChange, ...props }, ref) => {
  return (
    <div className={cn('w-full', className)} {...props}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value || min}
        onChange={(e) => onChange && onChange([Number(e.target.value)])}
        className={cn(
          'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      />
    </div>
  );
});

Slider.displayName = 'Slider';

export { Slider };
