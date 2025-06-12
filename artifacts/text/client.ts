import { Artifact } from '@/components/create-artifact';
import { Editor as TextEditor } from '@/components/text-editor';
import type { DataStreamDelta } from '@/components/data-stream-handler';

export const textArtifact = new Artifact({
  kind: 'text',
  description: 'Text',
  content: TextEditor,
  actions: [],
  toolbar: [],
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'text-delta') {
      setArtifact((artifact) => ({
        ...artifact,
        content: artifact.content + (streamPart.content as string),
      }));
    }
  },
});