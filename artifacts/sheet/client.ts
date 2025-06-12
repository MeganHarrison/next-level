import { Artifact } from '@/components/create-artifact';
import { SpreadsheetEditor } from '@/components/sheet-editor';
import type { DataStreamDelta } from '@/components/data-stream-handler';

export const sheetArtifact = new Artifact({
  kind: 'sheet',
  description: 'Spreadsheet',
  content: SpreadsheetEditor,
  actions: [],
  toolbar: [],
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'sheet-delta') {
      setArtifact((artifact) => ({
        ...artifact,
        content: artifact.content + (streamPart.content as string),
      }));
    }
  },
});