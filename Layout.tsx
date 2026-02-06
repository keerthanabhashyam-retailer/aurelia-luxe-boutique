
import React from 'react';
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
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner / Scrolling Text */}
      <div className="bg-amber-800 text-amber-50 py-2 overflow-hidden whitespace-nowrap border-b border-amber-900/20">
        <div className="flex animate-marquee">
          {OFFERS.map((offer, idx) => (
            <span key={idx} className="mx-12 font-medium tracking-wide uppercase text-xs">
              {offer}
            </span>
          ))}
          {OFFERS.map((offer, idx) => (
            <span key={`dup-${idx}`} className="mx-12 font-medium tracking-wide uppercase text-xs">
              {offer}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-serif text-2xl font-bold">
              A
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-800 hidden md:block">
              Aura <span className="text-amber-600">Jewelry Mart</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, SKU or category..."
                className="w-full bg-stone-100 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-sm"
                onChange={(e) => onSearch(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <Icons.Search />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{role} Account</span>
              <button 
                onClick={onLogout}
                className="text-xs font-bold text-amber-600 hover:text-amber-700"
              >
                Logout
              </button>
            </div>
            
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-stone-600 hover:text-amber-600 transition-colors"
            >
              <Icons.Cart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="p-2 text-stone-600 hover:text-amber-600 transition-colors hidden sm:block">
              <Icons.User />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Categories</h3>
              <nav className="space-y-1">
                {['All', 'Rings', 'Earrings', 'Bangles', 'Bracelets', 'Necklace', 'Pendants'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat 
                        ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600' 
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Navigation</h3>
              <nav className="space-y-1">
                <button onClick={() => onNavigate('home')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100">Home Catalog</button>
                <button onClick={() => onNavigate('request')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100">Special Requests</button>
                <button onClick={() => onNavigate('community')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100">Community Group</button>
                <button onClick={() => onNavigate('contact')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100">Direct Contact</button>
                {role === UserRole.ADMIN && (
                  <button onClick={() => onNavigate('admin')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50">Admin Dashboard</button>
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
      <footer className="bg-stone-900 text-stone-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-white font-serif text-2xl mb-4">Aura Jewelry Mart</h2>
              <p className="max-w-md mb-6 leading-relaxed">
                Defining elegance since 1995. Our jewelry is more than just an accessory; it's a testament to timeless beauty and artisanal excellence.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center hover:text-amber-500 hover:border-amber-500 cursor-pointer transition-colors">FB</div>
                <div className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center hover:text-amber-500 hover:border-amber-500 cursor-pointer transition-colors">IG</div>
                <div className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center hover:text-amber-500 hover:border-amber-500 cursor-pointer transition-colors">TW</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-amber-500 transition-colors">Contact Us</button></li>
                <li><button className="hover:text-amber-500 transition-colors">Shipping & Returns</button></li>
                <li><button className="hover:text-amber-500 transition-colors">Size Guide</button></li>
                <li><button className="hover:text-amber-500 transition-colors">Jewelry Care</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Our Store</h4>
              <ul className="space-y-2 text-sm">
                <li>123 Luxury Avenue, Diamond District</li>
                <li>New York, NY 10001</li>
                <li>Email: concierge@aurajewelry.com</li>
                <li>Phone: +1 (555) 987-6543</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-center text-xs">
            &copy; 2024 Aura Jewelry Mart. All Rights Reserved. Data stored securely in Google Workspace.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
