import { forwardRef, type InputHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';
import { Typography } from '../atoms/Typography';
import { cn } from '../../utils/cn';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, containerClassName, id, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${fieldId}-error`;

    return (
      <div className={cn("flex w-full flex-col gap-2", containerClassName)}>
        <label htmlFor={fieldId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
        <Input 
          id={fieldId}
          ref={ref} 
          hasError={!!error} 
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props} 
        />
        {error && (
          <Typography id={errorId} variant="small" className="text-red-500" role="alert">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };
