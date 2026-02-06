
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard';
import SpecialRequest from './components/SpecialRequest';
import Community from './components/Community';
import Contact from './components/Contact';
import { Product, UserRole, CartItem, Order } from './types';
import { INITIAL_PRODUCTS } from './services/mockData';
import { syncToSheets, getUserRole } from './services/googleSheetsService';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [signupRole, setSignupRole] = useState<UserRole>(UserRole.USER);
  const [adminKey, setAdminKey] = useState('');
  const [view, setView] = useState('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('aura_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    const savedCart = localStorage.getItem('aura_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedOrders = localStorage.getItem('aura_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const handleAuth = async () => {
    if (!userEmail) return alert("Please enter your email.");
    
    setIsSyncing(true);
    if (authMode === 'login') {
      const remoteRole = await getUserRole(userEmail);
      if (remoteRole) {
        setRole(remoteRole as UserRole);
      } else {
        const detectedRole = userEmail.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER;
        setRole(detectedRole);
      }
    } else {
      if (signupRole === UserRole.ADMIN && adminKey !== 'AURA2024') {
        setIsSyncing(false);
        return alert("Invalid Staff Access Key.");
      }
      await syncToSheets('user', { email: userEmail, role: signupRole, timestamp: Date.now() });
      setRole(signupRole);
    }
    setIsSyncing(false);
  };

  const saveProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('aura_products', JSON.stringify(newProducts));
    setIsSyncing(true);
    await syncToSheets('product', newProducts);
    setIsSyncing(false);
  };

  const handleCheckout = async () => {
    const total = cart.reduce((sum, i) => sum + (i.price * i.cartQuantity), 0);
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userEmail,
      items: cart,
      total,
      timestamp: Date.now()
    };
    setIsSyncing(true);
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('aura_orders', JSON.stringify(updatedOrders));
    await syncToSheets('order', newOrder);
    setCart([]);
    localStorage.removeItem('aura_cart');
    setIsCartOpen(false);
    setIsSyncing(false);
    alert(`Order ${newOrder.id} placed.`);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, activeCategory]);

  if (!role) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-stone-900 p-10 text-center text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/20 blur-3xl -mr-16 -mt-16"></div>
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white font-serif text-3xl font-bold mx-auto mb-4">A</div>
            <h1 className="text-3xl font-serif font-bold tracking-tight mb-1">Aura Jewelry Mart</h1>
            <p className="text-stone-400 text-sm">Luxury defined by you.</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>Login</button>
              <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>Signup</button>
            </div>
            <div className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setSignupRole(UserRole.USER)} className={`py-2 text-[10px] font-bold uppercase border rounded-xl transition-all ${signupRole === UserRole.USER ? 'bg-amber-50 border-amber-600 text-amber-700' : 'bg-white border-stone-200 text-stone-400'}`}>Customer</button>
                    <button onClick={() => setSignupRole(UserRole.ADMIN)} className={`py-2 text-[10px] font-bold uppercase border rounded-xl transition-all ${signupRole === UserRole.ADMIN ? 'bg-amber-50 border-amber-600 text-amber-700' : 'bg-white border-stone-200 text-stone-400'}`}>Administrator</button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email Address</label>
                <input value={userEmail} onChange={e => setUserEmail(e.target.value)} type="email" placeholder="concierge@aura.com" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              {authMode === 'signup' && signupRole === UserRole.ADMIN && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Staff Access Key</label>
                  <input type="password" value={adminKey} onChange={e => setAdminKey(e.target.value)} placeholder="Enter Staff Key" className="w-full p-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-amber-900" />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Password</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
            <button onClick={handleAuth} disabled={isSyncing} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2">
              {isSyncing && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {isSyncing ? 'Verifying with Spreadsheet...' : authMode === 'login' ? 'Enter Boutique' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout
      role={role}
      onLogout={() => { setRole(null); setView('home'); }}
      onSearch={setSearchQuery}
      cartCount={cart.reduce((sum, item) => sum + item.cartQuantity, 0)}
      onOpenCart={() => setIsCartOpen(true)}
      activeCategory={activeCategory}
      onCategoryChange={(cat) => { setActiveCategory(cat); setView('home'); }}
      onNavigate={setView}
    >
      {isSyncing && (
        <div className="fixed top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg z-[60] text-xs font-bold animate-pulse flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          Synchronizing...
        </div>
      )}

      {view === 'home' && (
        <div className="space-y-12 animate-in fade-in duration-700">
          <div id="catalog" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <h2 className="text-4xl font-serif font-bold text-stone-800">{activeCategory === 'All' ? 'Our Collections' : activeCategory}</h2>
                <div className="h-1 w-20 bg-amber-600 mt-2 rounded-full"></div>
              </div>
              <div className="text-sm font-medium text-stone-400 bg-stone-100 px-4 py-2 rounded-full shadow-inner">{filteredProducts.length} Treasures Available</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={(prod) => { setCart(prev => [...prev, { ...prod, cartQuantity: 1 }]); setIsCartOpen(true); }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'request' && <SpecialRequest onSync={async (data) => { setIsSyncing(true); await syncToSheets('special_request', { ...data, userEmail }); setIsSyncing(false); }} />}
      {view === 'community' && <Community onSync={async (data) => { setIsSyncing(true); await syncToSheets('community_post', { ...data, userEmail }); setIsSyncing(false); }} />}
      {view === 'contact' && <Contact onSync={async (data) => { setIsSyncing(true); await syncToSheets('message', { ...data, userEmail }); setIsSyncing(false); }} />}

      {view === 'admin' && role === UserRole.ADMIN && (
        <AdminDashboard 
          products={products}
          orders={orders}
          onAdd={(p) => saveProducts([...products, { ...p, id: Math.random().toString(36).substr(2, 9) } as Product])}
          onUpdate={(p) => saveProducts(products.map(item => item.id === p.id ? p : item))}
          onDelete={(id) => saveProducts(products.filter(item => item.id !== id))}
        />
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0 md:p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
          <div className="relative bg-white h-full md:h-auto md:max-h-[85vh] w-full max-w-md md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h3 className="text-2xl font-serif font-bold">Your Bag</h3>
              <button onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl">
                  <div>
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-[10px] text-stone-400 uppercase">{item.category}</div>
                  </div>
                  <div className="font-bold">₹{item.price.toLocaleString('en-IN')}</div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center text-stone-400">Empty bag</p>}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-stone-100">
                <button onClick={handleCheckout} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all">
                  Confirm & Sync (Total: ₹{cart.reduce((sum, i) => sum + (i.price * i.cartQuantity), 0).toLocaleString('en-IN')})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
