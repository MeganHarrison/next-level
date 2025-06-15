"use client"

import { useEffect, useRef } from 'react';
import { DataTable } from "@/components/data-table";
import { useInfiniteQuery, type SupabaseTableName, type SupabaseTableData } from "@/hooks/use-infinite-query";

interface Column<T> {
  key: keyof T & string;
  label: string;
  format?: (value: any, row: T) => React.ReactNode;
}

interface TablePageProps<T extends SupabaseTableName> {
  table: T;
  columns: Column<SupabaseTableData<T>>[];
  pageSize?: number;
}

export function TablePage<T extends SupabaseTableName>({ table, columns, pageSize = 15 }: TablePageProps<T>) {
  const {
    data,
    hasMore,
    isFetching,
    fetchNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<SupabaseTableData<T>>({ tableName: table, pageSize });

  const observer = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isFetching) return;
    if (!loadMoreRef.current) return;
    observer.current?.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });
    observer.current.observe(loadMoreRef.current);
  }, [hasMore, isFetching, fetchNextPage]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading table: {error.message}</div>;

  return (
    <div className="space-y-4">
      <DataTable data={data} columns={columns as any} pageSize={pageSize} />
      {hasMore && <div ref={loadMoreRef} className="h-8" />}
    </div>
  );
}