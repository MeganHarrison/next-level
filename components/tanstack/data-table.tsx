"use client"

import { useCallback, useEffect, useState } from "react"
import {
  FilterFn,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable
} from "@tanstack/react-table"
import { fetchDataForTableView } from "@/components/tanstack/actions"
import DataTableSearch, { FilterType } from "@/components/tanstack/data-table-search"
import { BasicDataTable } from "@/components/tanstack/basic-data-table"
import { columns } from "./columns"
import type { Tables } from "@/types/database.types"

// 👇 Our actual row type from Supabase types
type ContentIdea = Tables<'content_ideas'>

export function DataTable() {
  const [rowCount, setRowCount] = useState<number>(0)
  const [tableData, setTableData] = useState<ContentIdea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = useState<FilterType[]>([])

  const fetchData = useCallback(async (pageIndex: number, pageSize: number, filters: FilterType[]) => {
    setIsLoading(true)
    try {
      const { data, count } = await fetchDataForTableView({
        pageIndex,
        pageSize,
        filters,
      })
      setTableData(data)
      setRowCount(count)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(pageIndex, pageSize, filters)
  }, [fetchData, pageIndex, pageSize, filters])

  const globalFilterFn: FilterFn<ContentIdea> = useCallback(
    (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      return filterValue.every((filter: FilterType) => {
        if (filter.field !== columnId) return true
        switch (filter.operator) {
          case 'contains':
            return String(value).toLowerCase().includes(filter.value.toLowerCase())
          case 'equals':
            return String(value).toLowerCase() === filter.value.toLowerCase()
          case 'startsWith':
            return String(value).toLowerCase().startsWith(filter.value.toLowerCase())
          case 'endsWith':
            return String(value).toLowerCase().endsWith(filter.value.toLowerCase())
          case 'before':
            return new Date(value as string) < new Date(filter.value)
          case 'after':
            return new Date(value as string) > new Date(filter.value)
          default:
            return true
        }
      })
    },
    []
  )

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: Math.ceil(rowCount / pageSize),
    state: {
      pagination: { pageIndex, pageSize },
      globalFilter: filters,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setFilters,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  })

  const handleFiltersChange = (newFilters: FilterType[]) => {
    setFilters(newFilters)
    setPagination({ pageIndex: 0, pageSize })
  }

  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto">
          <div className="py-4 mt-4">
            <h1 className="text-3xl font-semibold">Supabase + shadcn/ui + TanStack Table</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2"></div>
              <div className="flex items-center space-x-2">
                <DataTableSearch onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-10">
        <BasicDataTable table={table} isLoading={isLoading} showPagination={true} />
      </div>
    </div>
  )
}