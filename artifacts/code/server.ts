import { createDocumentHandler } from '@/lib/artifacts/server';

export const codeDocumentHandler = createDocumentHandler({
  kind: 'code',
  onCreateDocument: async () => '',
  onUpdateDocument: async ({ document }) => document.content,
});