'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Fetches all products from the Supabase 'products' table.
 */
export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}