import { createDocumentHandler } from '@/lib/artifacts/server';

export const textDocumentHandler = createDocumentHandler({
  kind: 'text',
  onCreateDocument: async () => '',
  onUpdateDocument: async ({ document }) => document.content,
});