import { createDocumentHandler } from '@/lib/artifacts/server';

export const imageDocumentHandler = createDocumentHandler({
  kind: 'image',
  onCreateDocument: async () => '',
  onUpdateDocument: async ({ document }) => document.content,
});