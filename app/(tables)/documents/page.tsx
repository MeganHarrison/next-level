
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/page-header';
import { DocumentsDataTable } from './documents-data-table';
import type { Tables } from '@/types/database.types';

/**
 * Document metadata row from Supabase
 */


export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  // This fetches from the correct table!
  const supabase = await createClient();
  const { data, error } = await supabase.from('document_metadata').select('*');
  if (error) throw new Error(error.message);
  const documents = (data as Tables<'document_metadata'>[]) || [];

  return (
    <div className="w-[90%] mx-auto">
      <PageHeader
        title="Documents"
        description="Manage your document library"
      />
      <DocumentsDataTable documents={documents} />
    </div>
  );
}
