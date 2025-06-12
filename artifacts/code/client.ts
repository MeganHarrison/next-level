import { Artifact } from '@/components/create-artifact';
import { CodeEditor } from '@/components/code-editor';
import type { DataStreamDelta } from '@/components/data-stream-handler';

export const codeArtifact = new Artifact({
  kind: 'code',
  description: 'Code',
  content: CodeEditor,
  actions: [],
  toolbar: [],
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'code-delta') {
      setArtifact((artifact) => ({
        ...artifact,
        content: artifact.content + (streamPart.content as string),
      }));
    }
  },
});