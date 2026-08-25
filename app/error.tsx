'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app] unhandled error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 font-serif-museum">
      <div className="mx-auto w-16 h-16 rounded-full bg-[#EDE0D4] border-2 border-[#A08D6F] flex items-center justify-center shadow-md">
        <AlertTriangle className="w-8 h-8 text-[#A08D6F]" />
      </div>

      <div className="space-y-2">
        <span className="font-mono-tag text-xs font-bold uppercase tracking-widest text-[#A08D6F]">
          Cataloguing Error
        </span>
        <h1 className="text-3xl font-extrabold text-[#3F3A32]">This drawer would not open</h1>
        <p className="text-sm text-[#3F3A32]/80 max-w-md mx-auto leading-relaxed">
          Something went wrong while retrieving this part of the archive. The rest of the
          collection is unaffected.
        </p>
        {error.digest && (
          <p className="font-mono-tag text-[10px] text-[#A08D6F] uppercase tracking-widest">
            Reference {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase shadow-md transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[#A08D6F] bg-[#EDE0D4] hover:bg-[#D8DCC8] text-[#3F3A32] font-mono-tag font-bold text-xs uppercase shadow-sm transition-all"
        >
          <span>Back to Catalog</span>
        </Link>
      </div>
    </div>
  );
}
