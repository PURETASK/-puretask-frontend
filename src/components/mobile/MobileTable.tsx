'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { isMobile } from '@/lib/mobile/viewport';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  mobileHidden?: boolean;
}

interface MobileTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
  emptyMessage?: string;
}

/**
 * Responsive table component
 * - Shows as table on desktop
 * - Shows as cards on mobile
 */
export function MobileTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  className,
  emptyMessage = 'No data available',
}: MobileTableProps<T>) {
  const [isMobileView, setIsMobileView] = React.useState(false);

  React.useEffect(() => {
    setIsMobileView(isMobile());
    const handleResize = () => setIsMobileView(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Mobile view: Card layout
  if (isMobileView) {
    const visibleColumns = columns.filter((col) => !col.mobileHidden);
    
    return (
      <div className={cn('space-y-4', className)}>
        {data.map((item) => (
          <Card key={keyExtractor(item)}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {visibleColumns.map((column) => (
                  <div key={column.key} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">
                      {column.header}:
                    </span>
                    <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                      {column.render
                        ? column.render(item)
                        : item[column.key]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop view: Table layout
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.mobileHidden && 'hidden md:table-cell'
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                    column.mobileHidden && 'hidden md:table-cell'
                  )}
                >
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
