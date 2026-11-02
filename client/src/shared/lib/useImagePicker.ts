'use client';

import { useRef, useState, type ChangeEvent } from 'react';

export interface UseImagePickerOptions {
  /** existing image URL, if one is already set */
  value?: string | null;
  maxSizeMB?: number;
  onChange?: (file: File | null) => void;
  onError?: (message: string) => void;
}

/**
 * Shared state/logic behind every "pick an image, preview it, remove it"
 * spot in the app (room photo, profile photo, create-room photo, …).
 * Returns everything a picker UI needs; doesn't render anything itself, so
 * it works whether the trigger is a circular avatar button, a plain
 * "Upload" link, a drag-and-drop zone, etc.
 */
export default function useImagePicker({
  value,
  maxSizeMB = 5,
  onChange,
  onError,
}: UseImagePickerOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    onChange?.(file);
  };

  const pick = () => inputRef.current?.click();

  const remove = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return {
    /** data: URL to render as the preview, or null if nothing's picked */
    preview,
    hasImage: !!preview,
    /** opens the native file dialog — wire to your trigger's onClick */
    pick,
    /** clears the picked file and resets the underlying <input> */
    remove,
    /** spread directly onto a hidden <input type="file"> */
    inputProps: {
      ref: inputRef,
      type: 'file' as const,
      accept: 'image/png,image/jpeg',
      onChange: handleChange,
      style: { display: 'none' } as const,
    },

  };
}
