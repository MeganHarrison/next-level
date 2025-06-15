"use client";

import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone';
import { useEffect, useRef } from 'react';

export function DocumentUploader() {
  const upload = useSupabaseUpload({
    bucketName: 'documents',
    allowedMimeTypes: ['application/pdf', 'text/plain'],
    maxFiles: 5,
  });

  const processed = useRef<string[]>([]);

  useEffect(() => {
    const newFiles = upload.successes.filter((f) => !processed.current.includes(f));
    if (newFiles.length > 0) {
      processed.current = [...processed.current, ...newFiles];
      newFiles.forEach((file) => {
        fetch('/api/documents/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file }),
        });
      });
    }
  }, [upload.successes]);

  return (
    <Dropzone {...upload} className="mb-6">
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
}