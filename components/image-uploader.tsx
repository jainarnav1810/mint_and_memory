'use client';

import React, { useState } from 'react';
import { AlertCircle, ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { resolveImageUrl } from '@/lib/images';

const BUCKET = 'listing-images';
const MAX_IMAGES = 8;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

interface ImageUploaderProps {
  /** Storage object keys, in display order. The first is the primary image. */
  images: string[];
  onChange: (images: string[]) => void;
}

function objectKey(userId: string, fileName: string): string {
  const ext = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : 'jpg';
  return `${userId}/${crypto.randomUUID()}.${ext}`;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    // Let the same file be picked again after a removal.
    event.target.value = '';
    if (files.length === 0) return;

    setError(null);

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setError(`A specimen entry holds at most ${MAX_IMAGES} plates.`);
      return;
    }

    const batch = files.slice(0, room);
    const rejected = batch.find((f) => !ACCEPTED.includes(f.type) || f.size > MAX_BYTES);
    if (rejected) {
      setError(
        `${rejected.name} was skipped — plates must be JPEG, PNG, WebP, or AVIF under 5 MB.`,
      );
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Your session expired. Sign in again to upload plates.');
        return;
      }

      const uploaded: string[] = [];

      for (const file of batch) {
        const key = objectKey(user.id, file.name);
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(key, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
        });

        if (uploadError) {
          // Keep whatever landed; report the first failure rather than silently
          // dropping files the curator thinks were saved.
          setError(`${file.name} failed to upload: ${uploadError.message}`);
          break;
        }
        uploaded.push(key);
      }

      if (uploaded.length > 0) onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = (key: string) => {
    onChange(images.filter((img) => img !== key));
    // The orphaned object stays in the bucket; a curator can prune it from the
    // Supabase dashboard. Deleting here would break an in-flight save.
  };

  const makePrimary = (key: string) => {
    onChange([key, ...images.filter((img) => img !== key)]);
  };

  const remaining = MAX_IMAGES - images.length;

  return (
    <div className="space-y-3 pt-4 border-t border-[#A08D6F]/40">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor="plate-upload"
          className="block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider"
        >
          Specimen Photographic Plates
        </label>
        <span className="font-mono-tag text-[10px] text-[#A08D6F]">
          {images.length}/{MAX_IMAGES} · first plate is the catalog cover
        </span>
      </div>

      <label
        htmlFor="plate-upload"
        className={`flex flex-col items-center justify-center gap-2 p-6 rounded border-2 border-dashed transition-colors ${
          uploading || remaining <= 0
            ? 'border-[#A08D6F]/40 bg-[#F5F0E6]/50 cursor-not-allowed'
            : 'border-[#A08D6F] bg-[#F5F0E6] hover:bg-[#D8DCC8] cursor-pointer'
        }`}
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 text-[#A08D6F] animate-spin" />
        ) : (
          <ImagePlus className="w-6 h-6 text-[#A08D6F]" />
        )}
        <span className="font-serif-museum text-xs text-[#3F3A32]/85 text-center">
          {uploading
            ? 'Uploading plates to the archive...'
            : remaining <= 0
              ? 'Plate limit reached'
              : 'Select photographs — JPEG, PNG, WebP or AVIF, up to 5 MB each'}
        </span>
        <input
          id="plate-upload"
          type="file"
          accept={ACCEPTED.join(',')}
          multiple
          disabled={uploading || remaining <= 0}
          onChange={handleFiles}
          className="hidden"
        />
      </label>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-serif-museum">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((key, idx) => (
            <div
              key={key}
              className={`relative aspect-square rounded overflow-hidden border-2 ${
                idx === 0 ? 'border-[#3F3A32]' : 'border-[#A08D6F]/50'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(key)}
                alt={`Plate ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {idx === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#3F3A32] text-[#F5F0E6] font-mono-tag text-[9px] font-bold uppercase">
                  Cover
                </span>
              )}

              <div className="absolute bottom-1 right-1 flex gap-1">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(key)}
                    aria-label={`Make plate ${idx + 1} the catalog cover`}
                    className="p-1 rounded bg-[#F5F0E6]/90 text-[#3F3A32] hover:bg-[#D8DCC8] transition-colors"
                  >
                    <Star className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(key)}
                  aria-label={`Remove plate ${idx + 1}`}
                  className="p-1 rounded bg-[#F5F0E6]/90 text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
