
import React, { useState } from 'react';
import { Product, Category, Order, UserRole } from '../types';
import { Icons, CATEGORIES } from '../constants';
import { enhanceDescription } from '../services/geminiService';
import { generateSalesReport, syncToSheets } from '../services/googleSheetsService';

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
  const [isSyncing, setIsSyncing] = useState(false);
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

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex bg-white p-2 rounded-2xl border border-stone-200 w-fit overflow-x-auto shadow-sm">
        <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Inventory</button>
        <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Orders</button>
        <button onClick={() => setActiveTab('reports')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Analytics</button>
        <button onClick={() => setActiveTab('guide')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'guide' ? 'bg-amber-600 text-white shadow-lg' : 'text-amber-600'}`}>Manual Setup Guide</button>
      </div>

      {activeTab === 'inventory' && (
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-200 shadow-xl relative overflow-hidden">
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8">{isEditing ? 'Refine Selection' : 'Add New Treasure'}</h2>
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
              <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all">{isEditing ? 'Update Entry' : 'Add to Catalog'}</button>
            </div>
          </form>
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
