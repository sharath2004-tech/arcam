'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'h-10 px-4 py-2 rounded-lg border border-input bg-background text-foreground',
          'placeholder:text-muted-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
);

FormField.displayName = 'FormField';

export { FormField };
