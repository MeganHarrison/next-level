import type { SupabaseTableData, SupabaseTableName } from '@/hooks/use-infinite-query';

/**
 * Maps a Supabase table name to its row type.
 */
export type Tables<T extends SupabaseTableName> = SupabaseTableData<T>;