import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      options,
      placeholder,
      className = '',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const selectId =
      id || `select-${label?.replace(/\s+/g, '-').toLowerCase()}`;
    const hasError = Boolean(error);

    const baseStyles =
      'px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 bg-white';

    const normalStyles =
      'border-gray-300 focus:border-primary focus:ring-primary';

    const errorStyles = 'border-danger focus:border-danger focus:ring-danger';

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          className={`${baseStyles} ${hasError ? errorStyles : normalStyles} ${widthStyle} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';

export default Select;
