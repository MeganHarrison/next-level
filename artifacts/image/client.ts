import { Artifact } from '@/components/create-artifact';
import { ImageEditor } from '@/components/image-editor';
import type { DataStreamDelta } from '@/components/data-stream-handler';

export const imageArtifact = new Artifact({
  kind: 'image',
  description: 'Image',
  content: ImageEditor,
  actions: [],
  toolbar: [],
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'image-delta') {
      setArtifact((artifact) => ({
        ...artifact,
        content: artifact.content + (streamPart.content as string),
      }));
    }
  },
});