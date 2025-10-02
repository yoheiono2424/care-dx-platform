import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || `textarea-${label?.replace(/\s+/g, '-').toLowerCase()}`;
    const hasError = Boolean(error);

    const baseStyles =
      'px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 resize-vertical';

    const normalStyles =
      'border-gray-300 focus:border-primary focus:ring-primary';

    const errorStyles = 'border-danger focus:border-danger focus:ring-danger';

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${baseStyles} ${hasError ? errorStyles : normalStyles} ${widthStyle} ${className}`}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
