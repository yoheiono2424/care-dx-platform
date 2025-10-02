'use client';

import { ReactNode, useState } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className = '',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue === bValue) return 0;

    // Type assertion for comparison
    const comparison =
      (aValue as string | number) > (bValue as string | number) ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
                style={{ width: column.width }}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <span className="text-gray-400">
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? (
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                データがありません
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(row)
                      : (row[column.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
