'use client'

import React from 'react'
import { useInfiniteQuery } from '@/hooks/use-infinite-query'
import { Button } from '@/components/ui/button'

export default function ContentIdeasPage() {
  const {
    data,
    count,
    isLoading,
    isFetching,
    error,
    hasMore,
    fetchNextPage,
  } = useInfiniteQuery<any>({
    tableName: 'content_ideas',
    columns: '*',
    pageSize: 10,
    trailingQuery: (q) => q.order('created_at', { ascending: false }),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Content Ideas ({count})</h1>
      <ul className="space-y-2">
        {data.map((idea) => (
          <li key={idea.id} className="p-4 rounded border">
            {'title' in idea && <h3 className="font-semibold">{(idea as any).title}</h3>}
            {'description' in idea && <p>{(idea as any).description}</p>}
            {'created_at' in idea && (
              <div className="text-xs text-gray-500">{(idea as any).created_at}</div>
            )}
          </li>
        ))}
      </ul>
      {hasMore && (
        <Button onClick={fetchNextPage} disabled={isFetching} className="self-start">
          {isFetching ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  )
}
