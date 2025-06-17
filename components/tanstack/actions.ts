"use server"

import { createClient } from "@/utils/supabase/server"
import { Tables } from "@/types/database.types"
import { FilterType } from "@/components/tanstack/data-table-search"

type DatabaseSchema = Tables<'content_ideas'>

export async function fetchDataForTableView(options: {
  pageIndex: number
  pageSize: number
  filters: FilterType[]
}): Promise<{ data: DatabaseSchema[]; count: number }> {
  const { pageIndex, pageSize, filters } = options

  const supabase = await createClient()

  let query = supabase
    .from("content_ideas")
    .select("*", { count: "exact" })

  filters.forEach((filter) => {
    switch (filter.operator) {
      case "contains":
        query = query.ilike(filter.field, `%${filter.value}%`)
        break
      case "equals":
        query = query.eq(filter.field, filter.value)
        break
      case "startsWith":
        query = query.ilike(filter.field, `${filter.value}%`)
        break
      case "endsWith":
        query = query.ilike(filter.field, `%${filter.value}`)
        break
      case "before":
        query = query.lt(filter.field, filter.value)
        break
      case "after":
        query = query.gt(filter.field, filter.value)
        break
      case "greaterThan":
        query = query.gt(filter.field, filter.value)
        break
      case "lessThan":
        query = query.lt(filter.field, filter.value)
        break
    }
  })

  const { data, error, count } = await query
    .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)

  if (error) {
    console.error("Error fetching data:", error)
    return { count: 0, data: [] }
  }

  // console.debug('Fetched data:', data, 'Count:', count)

  return { data: data as DatabaseSchema[], count: count ?? 0 }
}