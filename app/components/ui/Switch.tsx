'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className = '', ...props }, ref) => (
  <SwitchPrimitives.Root
    className={`
      group
      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
      transition-colors duration-200 ease-in-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
      disabled:cursor-not-allowed
      data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500
      data-[state=unchecked]:bg-gray-200
      hover:data-[state=checked]:from-purple-600 hover:data-[state=checked]:to-blue-600
      hover:data-[state=unchecked]:bg-gray-300
      disabled:data-[state=checked]:from-purple-400 disabled:data-[state=checked]:to-blue-400
      disabled:data-[state=unchecked]:bg-gray-200
      disabled:opacity-85
      ${className}
    `}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={`
        pointer-events-none
        block h-5 w-5 rounded-full bg-white shadow-lg ring-0
        transition-transform duration-200 ease-in-out
        data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0
        group-hover:scale-95
        group-active:scale-90
        group-data-[state=checked]:bg-white
        group-disabled:shadow-md
        group-disabled:scale-100
        group-disabled:bg-white
      `}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = 'Switch';

export { Switch };
