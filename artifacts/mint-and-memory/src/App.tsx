import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpecimenNavbar } from './components/specimen-navbar';
import HomePage from './app/page';
import BrowsePage from './app/browse/page';
import ItemDetailPage from './app/item/[id]/page';
import CheckoutPage from './app/checkout/page';
import AdminDashboardPage from './app/(admin)/dashboard/page';
import NewListingPage from './app/(admin)/listings/new/page';
import { ErrorBoundary } from './components/error-boundary';

const queryClient = new QueryClient();

export function App() {
  const [path, setPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveDrawer = () => {
    if (path.includes('category=stamp')) return 'stamps';
    if (path.includes('category=coin')) return 'coins';
    if (path.includes('category=currency')) return 'currency';
    return 'all';
  };

  const renderContent = () => {
    if (path === '/') {
      return <HomePage onNavigate={navigate} />;
    }
    if (path.startsWith('/browse')) {
      return <BrowsePage onNavigate={navigate} />;
    }
    if (path.startsWith('/item/')) {
      const id = path.replace('/item/', '');
      return <ItemDetailPage id={id} onNavigate={navigate} />;
    }
    if (path.startsWith('/checkout')) {
      return <CheckoutPage onNavigate={navigate} />;
    }
    if (path === '/admin/dashboard') {
      return <AdminDashboardPage onNavigate={navigate} />;
    }
    if (path === '/admin/listings/new') {
      return <NewListingPage onNavigate={navigate} />;
    }
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-[#F5F0E6] text-[#3F3A32] font-serif-museum selection:bg-[#C7B79C] selection:text-[#3F3A32] flex flex-col">
          <SpecimenNavbar activeDrawer={getActiveDrawer()} onNavigate={navigate} />
          <main className="flex-1">{renderContent()}</main>

          <footer className="border-t-2 border-[#A08D6F]/40 bg-[#EDE0D4]/80 py-8 px-4 text-center font-mono-tag text-xs text-[#3F3A32]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-semibold text-[#3F3A32]">
                © {new Date().getFullYear()} Mint &amp; Memory — The Specimen Drawer Archive.
              </span>
              <div className="flex gap-4 text-[#A08D6F] uppercase">
                <button onClick={() => navigate('/browse?category=stamp')} className="hover:text-[#3F3A32]">
                  Stamps
                </button>
                <button onClick={() => navigate('/browse?category=coin')} className="hover:text-[#3F3A32]">
                  Coins
                </button>
                <button onClick={() => navigate('/browse?category=currency')} className="hover:text-[#3F3A32]">
                  Banknotes
                </button>
              </div>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;