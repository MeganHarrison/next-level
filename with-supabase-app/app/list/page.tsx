'use client'

import React from 'react'
import { useInfiniteQuery } from '@/hooks/useInfiniteQuery' // Adjust import path as needed

export default function ContentIdeasList() {
  const {
    data,
    count,
    isLoading,
    isFetching,
    error,
    hasMore,
    fetchNextPage,
  } = useInfiniteQuery({
    tableName: 'content_ideas',         // <---- set to your table
    columns: '*',                       // or specify: 'id, title, description, created_at'
    pageSize: 10,                       // fetch 10 per page
    trailingQuery: (q) => q.order('created_at', { ascending: false }), // order newest first
  })

  // For infinite scroll, you might want to use an intersection observer,
  // but for simplicity, here's a "Load More" button example:

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Content Ideas ({count})</h2>
      <ul className="space-y-2">
        {data.map((idea) => (
          <li key={idea.id} className="p-4 rounded border">
            <h3 className="font-semibold">{idea.title}</h3>
            <p>{idea.description}</p>
            <div className="text-xs text-gray-500">{idea.created_at}</div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
          onClick={fetchNextPage}
          disabled={isFetching}
        >
          {isFetching ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
