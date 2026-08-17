import React, { useState } from 'react';
import { Trash2, UploadCloud } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
          }
          resolve(true);
        };
        reader.readAsDataURL(file);
      });
    }

    setUploading(false);
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">Item Photos</label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden group">
            <img src={img} alt={`Collectible angle ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-950/80 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-zinc-950">
                Primary
              </span>
            )}
          </div>
        ))}

        <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-zinc-800 hover:border-amber-500/50 bg-zinc-900/40 hover:bg-zinc-900/80 cursor-pointer transition-all p-3 text-center">
          <UploadCloud className="w-6 h-6 text-zinc-400 mb-1" />
          <span className="text-xs font-medium text-zinc-300">{uploading ? 'Processing...' : 'Upload Image'}</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">PNG, JPG, WEBP</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
