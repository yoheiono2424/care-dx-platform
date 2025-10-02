'use client';

import { InputHTMLAttributes, useState } from 'react';

interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = '検索...',
  fullWidth = false,
  className = '',
  ...props
}: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <div className="relative">
        {/* 検索アイコン */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 入力欄 */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          {...props}
        />

        {/* クリアボタン */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="クリア"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
