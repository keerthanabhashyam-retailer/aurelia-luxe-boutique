
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard';
import SpecialRequest from './components/SpecialRequest';
import Community from './components/Community';
import Contact from './components/Contact';
import { Product, UserRole, CartItem, Order } from './types';
import { INITIAL_PRODUCTS } from './services/mockData';
import { syncToSheets, getUserRole, getProducts } from './services/googleSheetsService';

// Rule: Admins should use a key that is difficult to guess.
// Default key for development: AURA2024
const STAFF_ACCESS_KEY = (process.env as any).STAFF_KEY || 'AURA2024';

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

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      setIsSyncing(true);
      try {
        const liveProducts = await getProducts();
        if (liveProducts && Array.isArray(liveProducts)) {
          // Sanitize incoming data to remove empty/invalid rows from Sheets
          const validProducts = liveProducts.filter(p => p && p.id && p.name);
          if (validProducts.length > 0) {
            setProducts(validProducts);
          }
        } else {
          const savedProducts = localStorage.getItem('aura_products');
          if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProducts(parsed);
            }
          }
        }

        const savedCart = localStorage.getItem('aura_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
        
        const savedOrders = localStorage.getItem('aura_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      } catch (err) {
        console.warn("Persistence error:", err);
      } finally {
        setTimeout(() => setIsSyncing(false), 500);
      }
    };
    loadData();
  }, []);

  const handleAuth = async () => {
    if (!userEmail) return alert("Please enter your email.");
    
    setIsSyncing(true);
    try {
      if (authMode === 'login') {
        const remoteRole = await getUserRole(userEmail);
        if (remoteRole) {
          setRole(remoteRole as UserRole);
        } else {
          // Fallback logic for demo/offline
          const detectedRole = userEmail.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER;
          setRole(detectedRole);
        }
      } else {
        // Validation for Admin Signup
        if (signupRole === UserRole.ADMIN) {
            if (!adminKey) {
                setIsSyncing(false);
                return alert("Staff Access Key is required for Administrator accounts.");
            }
            if (adminKey !== STAFF_ACCESS_KEY) {
                setIsSyncing(false);
                return alert("Unauthorized: The Staff Access Key provided is incorrect. Please contact the Store Owner.");
            }
        }
        
        await syncToSheets('user', { email: userEmail, role: signupRole, timestamp: Date.now() });
        setRole(signupRole);
      }
    } catch (err) {
      console.error("Auth sync failed:", err);
      setRole(userEmail.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER);
    } finally {
      setIsSyncing(false);
    }
  };

  const saveProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('aura_products', JSON.stringify(newProducts));
    setIsSyncing(true);
    try {
      await syncToSheets('product', newProducts);
    } finally {
      setIsSyncing(false);
    }
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
    try {
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      localStorage.setItem('aura_orders', JSON.stringify(updatedOrders));
      await syncToSheets('order', newOrder);
      setCart([]);
      localStorage.removeItem('aura_cart');
      setIsCartOpen(false);
      alert(`Order ${newOrder.id} placed successfully.`);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // DEFENSIVE CHECK: Skip malformed products from Sheets
      if (!p || typeof p.name !== 'string' || typeof p.sku !== 'string') return false;
      
      const search = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(search) || 
                            p.sku.toLowerCase().includes(search);
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
            <p className="text-stone-400 text-sm italic">Luxury defined by you.</p>
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
                    <button onClick={() => setSignupRole(UserRole.ADMIN)} className={`py-2 text-[10px] font-bold uppercase border rounded-xl transition-all ${signupRole === UserRole.ADMIN ? 'bg-amber-50 border-amber-600 text-amber-700' : 'bg-white border-stone-200 text-stone-400'}`}>Staff Member</button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email Address</label>
                <input value={userEmail} onChange={e => setUserEmail(e.target.value)} type="email" placeholder="concierge@aura.com" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" />
              </div>
              {authMode === 'signup' && signupRole === UserRole.ADMIN && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Master Access Key</label>
                  <input 
                    type="password" 
                    value={adminKey} 
                    onChange={e => setAdminKey(e.target.value)} 
                    placeholder="Requires Store Authorization" 
                    className="w-full p-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-amber-900 font-mono tracking-widest" 
                  />
                  <p className="text-[9px] text-amber-600 leading-tight italic px-1">This key is generated by the store owner to prevent unauthorized administrative access.</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Security Password</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
            <button 
              onClick={handleAuth} 
              disabled={isSyncing} 
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
            >
              {isSyncing && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {isSyncing ? 'Synchronizing...' : authMode === 'login' ? 'Enter Boutique' : 'Authorize Account'}
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
          Synchronizing Registry...
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
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center text-stone-400 italic">No matches found in this category.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'request' && <SpecialRequest onSync={async (data) => { setIsSyncing(true); try { await syncToSheets('special_request', { ...data, userEmail }); } finally { setIsSyncing(false); } }} />}
      {view === 'community' && <Community onSync={async (data) => { setIsSyncing(true); try { await syncToSheets('community_post', { ...data, userEmail }); } finally { setIsSyncing(false); } }} />}
      {view === 'contact' && <Contact onSync={async (data) => { setIsSyncing(true); try { await syncToSheets('message', { ...data, userEmail }); } finally { setIsSyncing(false); } }} />}

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
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-sm line-clamp-1">{item.name}</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest">{item.category}</div>
                    </div>
                  </div>
                  <div className="font-bold text-stone-900">₹{item.price.toLocaleString('en-IN')}</div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-stone-400 italic">Your bag is empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-amber-600 font-bold text-xs uppercase mt-4 underline">Continue Shopping</button>
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-stone-100 bg-stone-50/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-serif font-bold text-stone-900">₹{cart.reduce((sum, i) => sum + (i.price * i.cartQuantity), 0).toLocaleString('en-IN')}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-xl">
                  Finalize Purchase
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
