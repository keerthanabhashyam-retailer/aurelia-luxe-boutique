import React, { useState } from 'react';
import { Product, Category, Order, UserRole } from '../types';
import { Icons, CATEGORIES } from '../constants';
import { enhanceDescription } from '../services/geminiService';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAdd: (p: Omit<Product, 'id'>) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, onAdd, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'reports' | 'guide'>('inventory');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', category: 'Rings', price: 0, quantity: 1, sku: '', description: '',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600'
  });
  const [aiLoading, setAiLoading] = useState(false);

  const handleEnhance = async () => {
    if (!formData.name) return;
    setAiLoading(true);
    const desc = await enhanceDescription(formData.name, formData.category || 'Jewelry');
    setFormData(prev => ({ ...prev, description: desc }));
    setAiLoading(false);
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(product.id);
    setActiveTab('inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(formData.quantity);
    const productData = {
      ...formData,
      quantity: qty,
      price: Number(formData.price),
      status: qty === 0 ? 'Out of Stock' : qty <= 5 ? 'Limited' : 'In Stock'
    } as Omit<Product, 'id'>;

    if (isEditing) {
      onUpdate({ ...productData, id: isEditing } as Product);
    } else {
      onAdd(productData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'Rings', price: 0, quantity: 1, sku: '', description: '', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600' });
    setIsEditing(null);
  };

  // Analytics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const categorySales = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      acc[item.category] = (acc[item.category] || 0) + (item.price * item.cartQuantity);
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Tab Navigation */}
      <div className="flex bg-white p-2 rounded-2xl border border-stone-200 w-fit overflow-x-auto shadow-sm sticky top-24 z-30">
        <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Inventory</button>
        <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Orders</button>
        <button onClick={() => setActiveTab('reports')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Analytics</button>
        <button onClick={() => setActiveTab('guide')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'guide' ? 'bg-amber-600 text-white shadow-lg' : 'text-amber-600'}`}>Manual Setup Guide</button>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-12">
          {/* Add/Edit Form */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-200 shadow-xl relative overflow-hidden">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8">{isEditing ? 'Refine Treasure' : 'Add New Treasure'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <input required placeholder="Product Name" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-6">
                  <select className="p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input required placeholder="SKU" className="p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <input type="number" required placeholder="Price" className="p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                  <input type="number" required placeholder="Quantity" className="p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <textarea rows={4} placeholder="Description" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  <button type="button" onClick={handleEnhance} className="absolute right-3 bottom-3 text-amber-600 font-bold text-[10px] uppercase">{aiLoading ? 'Generating...' : '✨ AI Enhance'}</button>
                </div>
                <input required placeholder="Image URL" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none text-xs" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                <div className="flex gap-4">
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="flex-1 bg-stone-100 text-stone-600 py-5 rounded-2xl font-bold hover:bg-stone-200 transition-all">Cancel</button>
                  )}
                  <button type="submit" className="flex-[2] bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all">{isEditing ? 'Update Entry' : 'Add to Catalog'}</button>
                </div>
              </div>
            </form>
          </div>

          {/* Inventory List */}
          <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold">Catalog Management</h3>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{products.length} Items Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  <tr>
                    <th className="px-8 py-4">Item</th>
                    <th className="px-8 py-4">SKU</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Stock</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                          <div>
                            <div className="font-bold text-stone-800">{p.name}</div>
                            <div className="text-[10px] text-stone-400 uppercase">{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-mono text-xs">{p.sku}</td>
                      <td className="px-8 py-4 font-bold text-stone-900">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.quantity === 0 ? 'bg-red-50 text-red-600' : p.quantity <= 5 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {p.quantity} Units
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(p)} className="p-2 text-stone-400 hover:text-amber-600 transition-colors"><Icons.Edit /></button>
                          <button onClick={() => onDelete(p.id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors"><Icons.Trash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-200 shadow-xl">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8">Recent Transactions</h2>
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-20 text-stone-400 italic">No sales recorded yet.</div>
              ) : (
                orders.sort((a,b) => b.timestamp - a.timestamp).map(order => (
                  <div key={order.id} className="bg-stone-50 rounded-3xl p-6 border border-stone-100 hover:border-amber-200 transition-all">
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                      <div>
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-1">Order {order.id}</div>
                        <div className="text-sm font-bold text-stone-800">{order.userEmail}</div>
                        <div className="text-xs text-stone-400">{new Date(order.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-serif font-bold text-stone-900">₹{order.total.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] font-bold text-green-600 uppercase">Paid & Synced</div>
                      </div>
                    </div>
                    <div className="border-t border-stone-200/50 pt-4 flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-white px-3 py-1.5 rounded-xl border border-stone-100 text-[10px] font-medium text-stone-600">
                          {item.cartQuantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-xl">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Total Revenue</div>
              <div className="text-4xl font-serif font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-amber-600 text-white p-8 rounded-[2.5rem] shadow-xl">
              <div className="text-[10px] font-bold text-amber-200 uppercase tracking-widest mb-2">Order Volume</div>
              <div className="text-4xl font-serif font-bold">{orders.length} <span className="text-lg">Sales</span></div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Average Ticket</div>
              <div className="text-4xl font-serif font-bold text-stone-900">₹{avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-200 shadow-xl">
            <h3 className="text-xl font-serif font-bold mb-8">Sales by Collection</h3>
            <div className="space-y-6">
              {Object.entries(categorySales).length === 0 ? (
                <div className="text-center py-10 text-stone-400 italic">No category data available.</div>
              ) : (
                Object.entries(categorySales)
                  .sort((a,b) => b[1] - a[1])
                  .map(([cat, val]) => (
                    <div key={cat} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-stone-800">{cat}</span>
                        <span className="text-amber-600">₹{val.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${(val / totalRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-amber-200 shadow-xl max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">Manual Deployment Guide</h2>
            <p className="text-stone-500 text-sm">Follow these steps to bypass the GitHub sync loop and go live on Vercel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
              <h3 className="font-bold text-amber-800 text-sm uppercase tracking-widest">Step 0: Get your API Key</h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                You need a Google Gemini API Key to power the AI features. Get it for free at:
              </p>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white border border-amber-200 px-4 py-2 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-100 transition-all"
              >
                Get Gemini API Key ↗
              </a>
            </div>

            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
              <h3 className="font-bold text-stone-800 text-sm uppercase tracking-widest">Step 1: Download Project</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Click the <strong>Download icon</strong> (Cloud with down arrow) in the top-right toolbar of the AI Studio window. Unzip this on your computer.
              </p>
            </div>

            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
              <h3 className="font-bold text-stone-800 text-sm uppercase tracking-widest">Step 2: Upload to GitHub</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Create a new repository on GitHub. Use the "uploading an existing file" link to drag and drop all your unzipped files.
              </p>
            </div>

            <div className="p-8 bg-stone-900 rounded-3xl space-y-4 text-white">
              <h3 className="font-bold text-amber-500 text-sm uppercase tracking-widest">Step 3: Deploy to Vercel</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Connect your GitHub to Vercel. When importing the project, add <code>API_KEY</code> as an Environment Variable and paste your key.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;