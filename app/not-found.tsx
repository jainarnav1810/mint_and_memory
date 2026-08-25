import Link from 'next/link';
import { Layers } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 font-serif-museum">
      <div className="mx-auto w-16 h-16 rounded-full bg-[#EDE0D4] border-2 border-[#A08D6F] flex items-center justify-center shadow-md">
        <Layers className="w-8 h-8 text-[#A08D6F]" />
      </div>

      <div className="space-y-2">
        <span className="font-mono-tag text-xs font-bold uppercase tracking-widest text-[#A08D6F]">
          Specimen Not Catalogued
        </span>
        <h1 className="text-3xl font-extrabold text-[#3F3A32]">No such drawer</h1>
        <p className="text-sm text-[#3F3A32]/80 max-w-md mx-auto leading-relaxed">
          This entry is not in the archive. It may have been sold, withdrawn, or never
          catalogued at all.
        </p>
      </div>

      <Link
        href="/browse"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase shadow-md transition-all"
      >
        <Layers className="w-4 h-4" />
        <span>Browse the Catalog</span>
      </Link>
    </div>
  );
}
