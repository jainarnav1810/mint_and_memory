import React from 'react';
import { Compass, Gavel, Layers, PlusCircle, ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onNavigate?: (path: string) => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab = 'browse', onNavigate }) => {
  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6 font-bold" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-wider text-zinc-100 uppercase group-hover:text-amber-400 transition-colors">
              Mint & Memory
            </span>
            <span className="block text-[10px] font-semibold tracking-widest text-amber-400/80 uppercase">
              Global Collectibles Marketplace
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 rounded-full bg-zinc-900/80 border border-zinc-800 p-1">
          <button
            onClick={() => handleNav('/')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Explore
          </button>
          <button
            onClick={() => handleNav('/browse')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'browse'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Catalog
          </button>

          <button
            onClick={() => handleNav('/browse?type=auction')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'auctions'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            Auctions
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('/admin/listings/new')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>List Item</span>
          </button>

          <button
            onClick={() => handleNav('/admin/dashboard')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            title="Admin Portal"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
