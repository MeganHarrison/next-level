import { createDocumentHandler } from '@/lib/artifacts/server';

export const sheetDocumentHandler = createDocumentHandler({
  kind: 'sheet',
  onCreateDocument: async () => '',
  onUpdateDocument: async ({ document }) => document.content,
});