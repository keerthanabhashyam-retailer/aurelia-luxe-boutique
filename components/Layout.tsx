
import React, { useState } from 'react';
import { Icons, OFFERS } from '../constants';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
  onSearch: (term: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, role, onLogout, onSearch, cartCount, 
  onOpenCart, activeCategory, onCategoryChange, onNavigate 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner */}
      <div className="bg-amber-800 text-amber-50 py-2 overflow-hidden whitespace-nowrap border-b border-amber-900/20">
        <div className="flex animate-marquee">
          {OFFERS.map((offer, idx) => (
            <span key={idx} className="mx-12 font-medium tracking-wide uppercase text-[10px]">
              {offer}
            </span>
          ))}
          {OFFERS.map((offer, idx) => (
            <span key={`dup-${idx}`} className="mx-12 font-medium tracking-wide uppercase text-[10px]">
              {offer}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-serif text-2xl font-bold shadow-inner">
                A
              </div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-stone-800 hidden sm:block">
                Aura <span className="text-amber-600">Boutique</span>
              </h1>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4 md:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search treasures..."
                className="w-full bg-stone-100 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-sm"
                onChange={(e) => onSearch(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <Icons.Search />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {role === UserRole.ADMIN && (
              <button 
                onClick={() => onNavigate('admin')}
                className="hidden md:flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
                Admin Dashboard
              </button>
            )}

            <button 
              onClick={onOpenCart}
              className="relative p-2.5 text-stone-600 hover:text-amber-600 transition-colors bg-stone-50 rounded-full"
            >
              <Icons.Cart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{role} Mode</span>
              <button 
                onClick={onLogout}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 py-8 gap-8 relative">
        {/* Mobile Sidebar Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 w-72 bg-white z-[60] p-8 border-r border-stone-100 transform transition-transform duration-300 lg:relative lg:transform-none lg:bg-transparent lg:border-none lg:p-0 lg:w-64 lg:block
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="sticky top-28 space-y-10">
            <div className="lg:hidden flex justify-between items-center mb-8">
              <div className="font-serif font-bold text-xl">Navigation</div>
              <button onClick={() => setIsMenuOpen(false)} className="text-stone-400">✕</button>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Collections</h3>
              <nav className="space-y-1">
                {['All', 'Rings', 'Earrings', 'Bangles', 'Bracelets', 'Necklace', 'Pendants'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { onCategoryChange(cat); setIsMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === cat 
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' 
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Boutique Services</h3>
              <nav className="space-y-1">
                <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100">Catalog</button>
                <button onClick={() => { onNavigate('request'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100">Bespoke Design</button>
                <button onClick={() => { onNavigate('community'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100">Trove Community</button>
                <button onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100">Concierge Desk</button>
                {role === UserRole.ADMIN && (
                  <button onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 mt-4">
                    Admin Portal
                  </button>
                )}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-white font-serif text-2xl mb-4">Aura Jewelry Mart</h2>
              <p className="max-w-md mb-8 leading-relaxed text-sm">
                Established in 1995, Aura is dedicated to the art of fine jewelry. Each piece is meticulously crafted to tell a story of elegance, power, and timeless grace.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:text-amber-500 hover:border-amber-500 cursor-pointer transition-all">FB</div>
                <div className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:text-amber-500 hover:border-amber-500 cursor-pointer transition-all">IG</div>
                <div className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:text-amber-500 hover:border-amber-500 cursor-pointer transition-all">LI</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-[0.2em] text-[10px]">Client Services</h4>
              <ul className="space-y-3 text-xs">
                <li><button className="hover:text-amber-500 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-amber-500 transition-colors">Shipping & Returns</button></li>
                <li><button className="hover:text-amber-500 transition-colors">Valuation Services</button></li>
                <li><button className="hover:text-amber-500 transition-colors">Ethical Sourcing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-[0.2em] text-[10px]">Global Flagship</h4>
              <ul className="space-y-3 text-xs">
                <li>Diamond District, Suite 402</li>
                <li>New York, NY 10001</li>
                <li>concierge@aura.com</li>
                <li>+1 (555) 987-6543</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-16 pt-8 text-center text-[10px] tracking-widest uppercase text-stone-600">
            &copy; 2024 Aura Boutique Mart. Artisanally crafted web experience.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
