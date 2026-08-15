import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  Menu,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Category = 'All pieces' | 'Stamps' | 'Coins' | 'Currency';
type Lot = {
  id: string;
  title: string;
  place: string;
  era: string;
  category: Exclude<Category, 'All pieces'>;
  type: 'Auction' | 'Fixed price';
  price: string;
  timing?: string;
  image: string;
  art: string;
  note: string;
};

const lots: Lot[] = [
  {
    id: 'ceylon-king-george',
    title: 'Ceylon, King George V',
    place: 'Ceylon · Indian Ocean',
    era: '1921 · 15 cents',
    category: 'Stamps',
    type: 'Auction',
    price: '$84',
    timing: '2d 04h',
    image: '/archive-desk.jpg',
    art: 'stamp-art',
    note: 'A small blue stamp with the weather of a port city still in its paper.',
  },
  {
    id: 'vienna-crown',
    title: 'Vienna 10 Kronen',
    place: 'Austria · Central Europe',
    era: '1924 · Silver',
    category: 'Coins',
    type: 'Fixed price',
    price: '$126',
    image: '/silver-coin.jpg',
    art: 'coin-art',
    note: 'The final issue before a currency disappeared into a new republic.',
  },
  {
    id: 'tanganyika-note',
    title: 'Tanganyika Shilling',
    place: 'East Africa · Dar es Salaam',
    era: '1961 · 5 shillings',
    category: 'Currency',
    type: 'Auction',
    price: '$58',
    timing: '8h 12m',
    image: '/world-archive.jpg',
    art: 'currency-art',
    note: 'A bright green note from the short interval between colony and nation.',
  },
  {
    id: 'japan-fuji',
    title: 'Japan, Mount Fuji',
    place: 'Japan · Honshu',
    era: '1952 · 24 yen',
    category: 'Stamps',
    type: 'Fixed price',
    price: '$42',
    image: '/archive-desk.jpg',
    art: 'stamp-art',
    note: 'A mountain, airmail, and the soft blue of a first journey abroad.',
  },
];

const categories: { name: Category; count: string; mark: string }[] = [
  { name: 'Stamps', count: '1,284 pieces', mark: '01' },
  { name: 'Coins', count: '762 pieces', mark: '02' },
  { name: 'Currency', count: '418 pieces', mark: '03' },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All pieces');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [notice, setNotice] = useState('');
  const [bid, setBid] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredLots = useMemo(() => {
    const term = search.toLowerCase().trim();
    return lots.filter((lot) => {
      const categoryMatch = activeCategory === 'All pieces' || lot.category === activeCategory;
      const searchMatch = !term || `${lot.title} ${lot.place} ${lot.era}`.toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 3800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const toggleSaved = (id: string) => {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitBid = () => {
    if (!selectedLot || !bid) return;
    setNotice(`Your bid of $${bid} is ready for ${selectedLot.title}.`);
    setSelectedLot(null);
    setBid('');
  };

  const reserveLot = (lot: Lot) => {
    setNotice(`${lot.title} has been held in your collection for 10 minutes.`);
    setSelectedLot(null);
  };

  return (
    <div className="archive-page min-h-[100dvh]">
      <header className="nav-blur fixed inset-x-0 top-0 z-40 border-b rule">
        <div className="mx-auto flex h-[74px] max-w-[1360px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button onClick={() => scrollTo('top')} className="group flex items-center gap-3" data-testid="button-home">
            <span className="relative flex h-9 w-9 items-center justify-center border border-[#163b3d] text-[#163b3d]">
              <span className="font-display text-[21px] leading-none">M</span>
              <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-[#d2b66c]" />
            </span>
            <span className="text-left">
              <span className="block font-display text-[19px] leading-none tracking-[-.03em]">Mint & Memory</span>
              <span className="mt-1 block font-mono-archive text-[8px] uppercase tracking-[.2em] text-[#597173]">A collector's exchange</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <button onClick={() => scrollTo('browse')} className="eyebrow text-[#456062] transition hover:text-[#b86955]" data-testid="link-browse">Browse the archive</button>
            <button onClick={() => scrollTo('story')} className="eyebrow text-[#456062] transition hover:text-[#b86955]" data-testid="link-stories">Stories</button>
            <button onClick={() => scrollTo('about')} className="eyebrow text-[#456062] transition hover:text-[#b86955]" data-testid="link-about">Our promise</button>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="button-press flex h-10 items-center gap-2 border border-[#163b3d]/20 px-3 text-[#163b3d] hover:bg-[#e5decc]" data-testid="button-open-search">
              <Search size={16} strokeWidth={1.7} />
              <span className="hidden font-mono-archive text-[10px] uppercase tracking-[.14em] sm:inline">Search</span>
            </button>
            <button onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center border border-[#163b3d]/20 md:hidden" data-testid="button-mobile-menu" aria-label="Toggle menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button onClick={() => scrollTo('newsletter')} className="button-press hidden h-10 bg-[#163b3d] px-4 font-mono-archive text-[10px] uppercase tracking-[.12em] text-[#f5f0e3] hover:bg-[#b86955] sm:block" data-testid="button-join-circle">Join the circle</button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t rule bg-[#f5f0e3] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollTo('browse')} className="eyebrow text-left" data-testid="mobile-link-browse">Browse the archive</button>
              <button onClick={() => scrollTo('story')} className="eyebrow text-left" data-testid="mobile-link-stories">Stories</button>
              <button onClick={() => scrollTo('about')} className="eyebrow text-left" data-testid="mobile-link-about">Our promise</button>
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#163b3d]/70 px-5 pt-[96px]" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl border border-[#d2b66c]/50 bg-[#f5f0e3] p-5 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="mb-7 flex items-center justify-between">
              <span className="eyebrow text-[#b86955]">Search the collection</span>
              <button onClick={() => setSearchOpen(false)} data-testid="button-close-search" aria-label="Close search"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-3 border-b-2 border-[#163b3d] pb-3">
              <Search size={22} strokeWidth={1.4} />
              <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try a place, year, or denomination" className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-[#456062]/40 sm:text-3xl" data-testid="input-search" />
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {['Ceylon', '1924', 'silver', 'Japan'].map((term) => (
                <button key={term} onClick={() => { setSearch(term); setSearchOpen(false); scrollTo('browse'); }} className="border rule px-3 py-2 font-mono-archive text-[10px] uppercase tracking-[.12em] hover:bg-[#e5decc]" data-testid={`button-search-suggestion-${term}`}>{term}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main id="top">
        <section className="relative min-h-[760px] overflow-hidden border-b rule pt-[74px] lg:min-h-[840px]">
          <div className="hero-grid absolute inset-0 opacity-60" />
          <div className="absolute -right-20 top-28 h-80 w-80 rounded-full border border-[#b86955]/20 lg:right-[11%] lg:top-36" />
          <div className="absolute right-[6%] top-52 h-2 w-2 rounded-full bg-[#b86955] lg:right-[17%]" />
          <div className="relative mx-auto grid max-w-[1360px] items-center gap-12 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:px-12 lg:pb-28 lg:pt-28">
            <div className="max-w-[760px]">
              <div className="reveal flex items-center gap-3">
                <span className="h-px w-12 bg-[#b86955]" />
                <span className="eyebrow text-[#b86955]">A world of small histories</span>
              </div>
              <h1 className="reveal delay-1 mt-7 max-w-[760px] font-display text-[clamp(3.8rem,8.4vw,8.2rem)] leading-[.87] tracking-[-.065em] text-[#163b3d]">
                Objects that<br /><em>remember</em> for us.
              </h1>
              <p className="reveal delay-2 mt-9 max-w-[450px] text-[15px] leading-7 text-[#456062] sm:text-[17px]">
                Stamps, coins, and currency collected from the long way around. Browse the pieces, then stay for the story behind them.
              </p>
              <div className="reveal delay-3 mt-9 flex flex-wrap items-center gap-4">
                <button onClick={() => scrollTo('browse')} className="button-press group flex items-center gap-4 bg-[#163b3d] px-5 py-4 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#f5f0e3] hover:bg-[#b86955]" data-testid="button-browse-pieces">
                  Browse the pieces <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <button onClick={() => scrollTo('story')} className="button-press flex items-center gap-2 px-2 py-4 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#163b3d] hover:text-[#b86955]" data-testid="button-read-story">
                  Read a collector's note <ChevronRight size={15} />
                </button>
              </div>
            </div>
            <div className="reveal delay-2 relative mx-auto h-[420px] w-full max-w-[500px] lg:h-[515px]">
              <div className="absolute left-[6%] top-[8%] h-[74%] w-[73%] rotate-[-7deg] overflow-hidden bg-[#bcae8e] p-3 shadow-xl">
                <img src="/archive-desk.jpg" alt="Archival desk with a stamp and provenance card" className="h-full w-full object-cover grayscale-[.15] mix-blend-multiply" data-testid="img-hero-archive" />
              </div>
              <div className="stamp-shadow float-slow absolute bottom-[4%] right-[4%] h-[205px] w-[245px] rotate-[8deg] bg-[#e9dfc6] p-3 sm:h-[235px] sm:w-[280px]">
                <div className="stamp-art relative h-full w-full overflow-hidden">
                  <div className="absolute inset-3 border border-[#f5e9c4]/70" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#f5e9c4]">
                    <span className="font-display text-4xl italic">15</span>
                    <span className="eyebrow text-[8px]">Ceylon · 1921</span>
                  </div>
                  <div className="absolute left-5 top-5 font-mono-archive text-[8px] tracking-[.2em] text-[#f5e9c4]">POST / MEMORY</div>
                </div>
              </div>
              <div className="absolute right-[1%] top-[2%] flex items-center gap-2 bg-[#d2b66c] px-3 py-2 font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#163b3d]">
                <Sparkles size={12} /> Just found
              </div>
              <span className="absolute bottom-[1%] left-[2%] font-mono-archive text-[9px] uppercase tracking-[.16em] text-[#456062]">Fig. 01 — the kept thing</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t rule py-3">
            <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap font-mono-archive text-[10px] uppercase tracking-[.16em] text-[#456062]">
              <span>Provenance over polish</span><span className="text-[#b86955]">/</span><span>From one collection to another</span><span className="text-[#b86955]">/</span><span>14 countries represented</span><span className="text-[#b86955]">/</span><span>Provenance over polish</span><span className="text-[#b86955]">/</span><span>From one collection to another</span><span className="text-[#b86955]">/</span><span>14 countries represented</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32" id="browse">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <span className="eyebrow text-[#b86955]">The collection / 03 doors in</span>
              <h2 className="mt-5 max-w-[370px] font-display text-5xl leading-[.95] tracking-[-.05em] sm:text-6xl">Start where your curiosity pulls.</h2>
              <p className="mt-6 max-w-[320px] text-sm leading-6 text-[#456062]">Not everything here is valuable. That is the point. Every piece is chosen for the trace it leaves behind.</p>
              <button onClick={() => { setActiveCategory('All pieces'); scrollTo('pieces'); }} className="mt-8 flex items-center gap-3 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#b86955]" data-testid="button-view-all-pieces">View all pieces <ArrowUpRight size={15} /></button>
            </div>
            <div className="grid border-t rule sm:grid-cols-3">
              {categories.map((category) => (
                <button key={category.name} onClick={() => { setActiveCategory(category.name); scrollTo('pieces'); }} className="group relative border-b rule py-7 text-left transition hover:bg-[#e5decc] sm:border-b-0 sm:border-r sm:px-6 first:sm:pl-0 last:border-r-0" data-testid={`button-category-${category.name.toLowerCase()}`}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono-archive text-[10px] text-[#b86955]">{category.mark}</span>
                    <ArrowUpRight size={17} className="text-[#456062] transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <h3 className="mt-14 font-display text-3xl tracking-[-.04em]">{category.name}</h3>
                  <p className="mt-2 font-mono-archive text-[10px] uppercase tracking-[.12em] text-[#456062]">{category.count}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="pieces" className="border-y rule bg-[#e5decc]/55">
          <div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="eyebrow text-[#b86955]">Open drawer</span>
                <h2 className="mt-4 font-display text-5xl tracking-[-.05em] sm:text-6xl">Pieces with a pulse.</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(['All pieces', 'Stamps', 'Coins', 'Currency'] as Category[]).map((category) => (
                  <button key={category} onClick={() => setActiveCategory(category)} className={`border px-3 py-2 font-mono-archive text-[10px] uppercase tracking-[.1em] transition ${activeCategory === category ? 'border-[#163b3d] bg-[#163b3d] text-[#f5f0e3]' : 'border-[#163b3d]/20 text-[#456062] hover:border-[#163b3d]'}`} data-testid={`button-filter-${category.toLowerCase().replace(' ', '-')}`}>{category}</button>
                ))}
              </div>
            </div>
            {filteredLots.length > 0 ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filteredLots.map((lot, index) => (
                  <LotCard key={lot.id} lot={lot} index={index} saved={saved.has(lot.id)} onSave={() => toggleSaved(lot.id)} onOpen={() => setSelectedLot(lot)} />
                ))}
              </div>
            ) : (
              <div className="mt-12 border border-dashed border-[#163b3d]/30 px-6 py-20 text-center" data-testid="empty-search-state">
                <Bookmark className="mx-auto text-[#b86955]" size={24} strokeWidth={1.3} />
                <h3 className="mt-5 font-display text-3xl">Nothing in this drawer yet.</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#456062]">Try another country, year, or category. The archive is large, but intentionally not endless.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('All pieces'); }} className="mt-7 border border-[#163b3d] px-4 py-3 font-mono-archive text-[10px] uppercase tracking-[.12em]" data-testid="button-reset-search">Reset the drawer</button>
              </div>
            )}
          </div>
        </section>

        <section id="story" className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-24">
            <div className="relative min-h-[450px] overflow-hidden bg-[#163b3d] p-5 sm:min-h-[560px]">
              <img src="/world-archive.jpg" alt="World banknotes and stamps arranged in a collector's archive" className="absolute inset-0 h-full w-full object-cover opacity-70" data-testid="img-story-archive" />
              <div className="absolute inset-0 bg-[#163b3d]/40" />
              <div className="absolute left-8 top-8 border border-[#f5f0e3]/50 px-3 py-2 font-mono-archive text-[9px] uppercase tracking-[.15em] text-[#f5f0e3]">Collector's note · 07</div>
              <div className="absolute bottom-8 left-8 max-w-[250px] text-[#f5f0e3]">
                <p className="font-display text-4xl leading-[.98]">“I kept it because I could still smell the train.”</p>
                <p className="mt-5 font-mono-archive text-[9px] uppercase tracking-[.13em] text-[#d2b66c]">— A. Menon, Mumbai</p>
              </div>
            </div>
            <div>
              <span className="eyebrow text-[#b86955]">Why this little marketplace exists</span>
              <h2 className="mt-5 max-w-[610px] font-display text-5xl leading-[.95] tracking-[-.05em] sm:text-7xl">The object is only half the story.</h2>
              <p className="mt-8 max-w-[520px] text-[15px] leading-7 text-[#456062]">A stamp can be a goodbye. A coin can be the last thing a traveler has left from a city. A note can hold a fingerprint, a train route, a season.</p>
              <p className="mt-5 max-w-[520px] text-[15px] leading-7 text-[#456062]">Mint & Memory is a considered exchange for those things — with clear condition, honest provenance, and enough room to wonder.</p>
              <div className="mt-10 grid max-w-[520px] grid-cols-3 border-t rule pt-5">
                <div><p className="font-display text-3xl">14</p><p className="mt-1 font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#456062]">countries</p></div>
                <div><p className="font-display text-3xl">2,464</p><p className="mt-1 font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#456062]">pieces catalogued</p></div>
                <div><p className="font-display text-3xl">1921</p><p className="mt-1 font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#456062]">oldest story</p></div>
              </div>
              <button onClick={() => setNotice('The full collector notes are being prepared for the next edition.')} className="mt-9 flex items-center gap-3 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#b86955]" data-testid="button-read-notes">Read the collector notes <ArrowUpRight size={15} /></button>
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#163b3d] text-[#f5f0e3]">
          <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
            <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
              <div>
                <span className="eyebrow text-[#d2b66c]">A better way to browse</span>
                <h2 className="mt-5 max-w-[360px] font-display text-5xl leading-[.95] tracking-[-.05em] sm:text-6xl">Look closer. Ask better questions.</h2>
              </div>
              <div className="grid gap-0 sm:grid-cols-3">
                {[
                  { icon: '01', title: 'Context first', body: 'Every listing begins with the place, era, denomination, and the note that came with it.' },
                  { icon: '02', title: 'Two ways to collect', body: 'Bid on the rare finds or take home a fixed-price piece without the theatre.' },
                  { icon: '03', title: 'Small, considered', body: 'One personal collection, catalogued slowly. No anonymous warehouse of objects.' },
                ].map((item) => (
                  <div key={item.icon} className="border-t border-[#f5f0e3]/20 py-6 sm:border-l sm:border-t-0 sm:px-6 first:sm:pl-0">
                    <span className="font-mono-archive text-[10px] text-[#d2b66c]">{item.icon}</span>
                    <h3 className="mt-14 font-display text-2xl">{item.title}</h3>
                    <p className="mt-4 max-w-[220px] text-sm leading-6 text-[#bac9c3]">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="flex items-end justify-between border-b rule pb-6">
            <div>
              <span className="eyebrow text-[#b86955]">At this hour</span>
              <h2 className="mt-4 font-display text-5xl tracking-[-.05em] sm:text-6xl">Worth a closer look.</h2>
            </div>
            <button onClick={() => scrollTo('pieces')} className="hidden items-center gap-2 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#b86955] sm:flex" data-testid="button-see-market">See the market <ArrowUpRight size={15} /></button>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <button onClick={() => setSelectedLot(lots[0])} className="group relative min-h-[370px] overflow-hidden bg-[#b86955] text-left" data-testid="card-featured-auction">
              <img src="/archive-desk.jpg" alt="Ceylon stamp on an archival desk" className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-multiply transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#163b3d]/90 via-[#163b3d]/10 to-transparent" />
              <div className="relative flex min-h-[370px] flex-col justify-between p-6 text-[#f5f0e3] sm:p-8">
                <div className="flex items-center justify-between"><span className="border border-[#d2b66c] px-3 py-2 font-mono-archive text-[9px] uppercase tracking-[.13em] text-[#d2b66c]">Auction live</span><Clock3 size={17} strokeWidth={1.5} /></div>
                <div><p className="eyebrow text-[#d2b66c]">Featured lot · Ceylon, 1921</p><h3 className="mt-3 max-w-[550px] font-display text-4xl leading-none sm:text-6xl">A blue envelope from the edge of the map.</h3><div className="mt-6 flex items-end justify-between"><span className="font-mono-archive text-[10px] uppercase tracking-[.13em]">Current bid <strong className="ml-2 font-normal text-[#d2b66c]">$84</strong></span><ArrowUpRight className="transition group-hover:-translate-y-1 group-hover:translate-x-1" /></div></div>
              </div>
            </button>
            <div className="grid gap-8">
              <div className="border-t rule pt-5">
                <div className="flex items-start justify-between"><span className="eyebrow text-[#b86955]">Fixed price · Vienna, 1924</span><span className="font-mono-archive text-[10px] text-[#456062]">$126</span></div>
                <h3 className="mt-8 max-w-[350px] font-display text-3xl leading-none">The last silver of a vanished crown.</h3>
                <button onClick={() => setSelectedLot(lots[1])} className="mt-7 flex items-center gap-2 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#b86955]" data-testid="button-view-vienna">View the piece <ChevronRight size={15} /></button>
              </div>
              <div className="border-t rule pt-5">
                <div className="flex items-start justify-between"><span className="eyebrow text-[#b86955]">Ending soon · Tanganyika, 1961</span><span className="font-mono-archive text-[10px] text-[#456062]">8h 12m</span></div>
                <h3 className="mt-8 max-w-[350px] font-display text-3xl leading-none">A new country, printed in green.</h3>
                <button onClick={() => setSelectedLot(lots[2])} className="mt-7 flex items-center gap-2 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#b86955]" data-testid="button-view-tanganyika">View the piece <ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </section>

        <section id="newsletter" className="border-y rule bg-[#d2b66c]">
          <div className="mx-auto grid max-w-[1360px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:py-20">
            <div><span className="eyebrow text-[#163b3d]">The next envelope</span><h2 className="mt-4 max-w-[480px] font-display text-5xl leading-[.93] tracking-[-.05em] text-[#163b3d] sm:text-6xl">A quiet note, once in a while.</h2></div>
            <div>
              <p className="max-w-[490px] text-sm leading-6 text-[#163b3d]/75">Newly catalogued pieces, the stories behind them, and auctions worth setting an alarm for. No noise. Just a thoughtful dispatch from the archive.</p>
              {subscribed ? (
                <div className="mt-8 flex items-center gap-3 border-t border-[#163b3d]/30 pt-5 font-mono-archive text-[10px] uppercase tracking-[.12em] text-[#163b3d]" data-testid="status-subscribed"><Check size={17} /> You are on the list. Watch your post.</div>
              ) : (
                <form className="mt-8 flex max-w-[520px] border-b border-[#163b3d] pb-2" onSubmit={(event) => { event.preventDefault(); if (email) setSubscribed(true); }}><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent font-display text-xl outline-none placeholder:text-[#163b3d]/50" data-testid="input-newsletter-email" /><button type="submit" className="button-press flex items-center gap-2 font-mono-archive text-[10px] uppercase tracking-[.12em] text-[#163b3d]" data-testid="button-subscribe">Subscribe <ArrowUpRight size={16} /></button></form>
              )}
              <p className="mt-4 font-mono-archive text-[9px] uppercase tracking-[.12em] text-[#163b3d]/60">Unsubscribe whenever you like · Never sold or shared</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#163b3d] text-[#f5f0e3]">
        <div className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="flex flex-col justify-between gap-12 md:flex-row">
            <div><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center border border-[#d2b66c] font-display text-[21px] text-[#d2b66c]">M</span><span className="font-display text-2xl">Mint & Memory</span></div><p className="mt-5 max-w-[260px] text-sm leading-6 text-[#bac9c3]">A personal collection, opened carefully to the world.</p></div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-4 sm:grid-cols-3 sm:gap-x-20"><button onClick={() => scrollTo('browse')} className="text-left font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#bac9c3] hover:text-[#d2b66c]" data-testid="footer-link-browse">Browse</button><button onClick={() => scrollTo('story')} className="text-left font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#bac9c3] hover:text-[#d2b66c]" data-testid="footer-link-stories">Stories</button><button onClick={() => setNotice('Questions welcome. Write to hello@mintandmemory.example')} className="text-left font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#bac9c3] hover:text-[#d2b66c]" data-testid="footer-link-contact">Contact</button><button onClick={() => setNotice('Collector notes are private by default, always.')} className="text-left font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#bac9c3] hover:text-[#d2b66c]" data-testid="footer-link-privacy">Privacy</button><button onClick={() => scrollTo('about')} className="text-left font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#bac9c3] hover:text-[#d2b66c]" data-testid="footer-link-promise">Our promise</button></div>
          </div>
          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#f5f0e3]/20 pt-5 font-mono-archive text-[9px] uppercase tracking-[.13em] text-[#7e9b95] sm:flex-row"><span>© 2024 Mint & Memory</span><span>Collected with care · Shipped with a story</span></div>
        </div>
      </footer>

      {notice && <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 bg-[#163b3d] px-5 py-4 text-[#f5f0e3] shadow-xl" data-testid="status-notice"><Check size={16} className="text-[#d2b66c]" /><span className="font-mono-archive text-[10px] uppercase tracking-[.08em]">{notice}</span><button onClick={() => setNotice('')} data-testid="button-dismiss-notice"><X size={15} /></button></div>}

      {selectedLot && <LotDialog lot={selectedLot} bid={bid} setBid={setBid} onClose={() => setSelectedLot(null)} onBid={submitBid} onReserve={() => reserveLot(selectedLot)} />}
    </div>
  );
}

function LotCard({ lot, index, saved, onSave, onOpen }: { lot: Lot; index: number; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return (
    <article className="card-lift group relative bg-[#f5f0e3]" data-testid={`card-lot-${lot.id}`}>
      <div className="relative aspect-[.88] overflow-hidden bg-[#d2c6a9]">
        <img src={lot.image} alt={`${lot.title} archival photograph`} className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-multiply transition duration-500 group-hover:scale-105" />
        <div className={`absolute inset-[13%] overflow-hidden ${lot.art} shadow-lg`}>
          {lot.category === 'Coins' && <div className="coin-art absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full" />}
          {lot.category === 'Stamps' && <div className="absolute inset-5 border border-[#f5e9c4]/70"><span className="absolute bottom-3 left-3 font-display text-4xl italic text-[#f5e9c4]">{index === 0 ? '15' : '24'}</span><span className="absolute right-3 top-3 font-mono-archive text-[8px] text-[#f5e9c4]">POST</span></div>}
          {lot.category === 'Currency' && <div className="absolute inset-5 border border-[#d6d4a5]/70"><span className="absolute bottom-3 left-3 font-display text-4xl italic text-[#f4e8b1]">5</span><span className="absolute right-3 top-3 font-mono-archive text-[8px] text-[#d6d4a5]">SHILLINGS</span></div>}
        </div>
        <button onClick={onSave} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center border transition ${saved ? 'border-[#d2b66c] bg-[#d2b66c] text-[#163b3d]' : 'border-[#f5f0e3]/70 bg-[#163b3d]/30 text-[#f5f0e3] hover:bg-[#163b3d]'}`} data-testid={`button-save-${lot.id}`} aria-label={saved ? 'Remove from saved' : 'Save piece'}>{saved ? <Bookmark size={15} fill="currentColor" /> : <Heart size={15} />}</button>
        <span className="absolute bottom-3 left-3 bg-[#f5f0e3] px-2 py-1 font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#163b3d]">{lot.type}</span>
      </div>
      <div className="p-4 pb-5">
        <p className="font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#b86955]">{lot.place}</p>
        <h3 className="mt-2 font-display text-2xl leading-none tracking-[-.035em]">{lot.title}</h3>
        <div className="mt-4 flex items-end justify-between border-t rule pt-3"><div><p className="font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#456062]">{lot.era}</p><p className="mt-1 font-mono-archive text-sm text-[#163b3d]">{lot.price}{lot.type === 'Auction' && <span className="ml-1 text-[9px] text-[#456062]">current</span>}</p></div><button onClick={onOpen} className="flex items-center gap-1 font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#b86955]" data-testid={`button-open-lot-${lot.id}`}>Details <ArrowUpRight size={13} /></button></div>
      </div>
    </article>
  );
}

function LotDialog({ lot, bid, setBid, onClose, onBid, onReserve }: { lot: Lot; bid: string; setBid: (value: string) => void; onClose: () => void; onBid: () => void; onReserve: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#163b3d]/70 px-5 py-8" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto bg-[#f5f0e3] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-[#163b3d]/20 bg-[#f5f0e3]" data-testid="button-close-lot-dialog" aria-label="Close item details"><X size={17} /></button>
        <div className="grid md:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-[300px] bg-[#d2c6a9] md:min-h-[460px]"><img src={lot.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply" /><div className={`absolute inset-[13%] ${lot.art}`}>{lot.category === 'Coins' && <div className="coin-art absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full" />}<div className="absolute inset-5 border border-[#f5e9c4]/60" /></div><span className="absolute bottom-5 left-5 font-mono-archive text-[9px] uppercase tracking-[.15em] text-[#163b3d]">Archive no. {lot.id.slice(0, 6).toUpperCase()}</span></div>
          <div className="p-7 sm:p-10"><span className="eyebrow text-[#b86955]">{lot.type} · {lot.era}</span><h2 className="mt-4 font-display text-4xl leading-[.95] tracking-[-.05em] sm:text-5xl">{lot.title}</h2><p className="mt-3 font-mono-archive text-[10px] uppercase tracking-[.12em] text-[#456062]">{lot.place}</p><p className="mt-8 text-sm leading-7 text-[#456062]">{lot.note}</p><div className="mt-8 grid grid-cols-2 border-t rule pt-4"><div><span className="eyebrow text-[#456062]">Condition</span><p className="mt-2 text-sm">Very good · gentle patina</p></div><div><span className="eyebrow text-[#456062]">Provenance</span><p className="mt-2 text-sm">Personal collection</p></div></div>{lot.type === 'Auction' ? <div className="mt-8 border-t rule pt-5"><div className="flex items-end justify-between"><span className="eyebrow text-[#b86955]">Current bid</span><span className="font-display text-3xl">{lot.price}</span></div><div className="mt-4 flex border-b border-[#163b3d] pb-2"><span className="font-display text-xl">$</span><input value={bid} onChange={(event) => setBid(event.target.value)} inputMode="decimal" placeholder="Your maximum bid" className="ml-2 w-full bg-transparent font-display text-xl outline-none placeholder:text-[#456062]/50" data-testid="input-bid" /></div><button onClick={onBid} disabled={!bid} className="button-press mt-5 flex w-full items-center justify-center gap-2 bg-[#163b3d] px-4 py-4 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#f5f0e3] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#b86955]" data-testid="button-submit-bid">Place a considered bid <ArrowUpRight size={15} /></button><p className="mt-3 text-center font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#456062]">Auction closes in {lot.timing}</p></div> : <div className="mt-8 border-t rule pt-5"><div className="flex items-end justify-between"><span className="eyebrow text-[#b86955]">Fixed price</span><span className="font-display text-3xl">{lot.price}</span></div><button onClick={onReserve} className="button-press mt-5 flex w-full items-center justify-center gap-2 bg-[#163b3d] px-4 py-4 font-mono-archive text-[10px] uppercase tracking-[.13em] text-[#f5f0e3] hover:bg-[#b86955]" data-testid="button-reserve-lot">Hold this piece <ArrowUpRight size={15} /></button><p className="mt-3 text-center font-mono-archive text-[9px] uppercase tracking-[.1em] text-[#456062]">Single-item checkout · Ships worldwide</p></div>}</div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;