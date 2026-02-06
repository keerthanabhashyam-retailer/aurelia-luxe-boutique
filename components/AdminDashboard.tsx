
import React, { useState } from 'react';
import { Product, Category, Order, UserRole } from '../types';
import { Icons, CATEGORIES } from '../constants';
import { enhanceDescription } from '../services/geminiService';
import { syncToSheets } from '../services/googleSheetsService';

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

  const appsScriptCode = `
/**
 * GOOGLE APPS SCRIPT FOR AURA JEWELRY MART
 * Supports Role Verification (GET) and Data Logging (POST)
 */

function doGet(e) {
  var action = e.parameter.action;
  var email = e.parameter.email;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  
  // Handshake to test connection
  if (action === "ping") {
    return ContentService.createTextOutput(JSON.stringify({ status: "connected" })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "getRole" && email) {
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ role: "USER" })).setMimeType(ContentService.MimeType.JSON);
    
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === email) {
        return ContentService.createTextOutput(JSON.stringify({ role: data[i][1] })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ role: "USER" })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var action = params.action;
  var data = params.data;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheetName = action === "user" ? "Users" : 
                  action === "product" ? "Products" : 
                  action === "order" ? "Orders" : "Logs";
                  
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  if (action === "user") {
    var userRows = sheet.getDataRange().getValues();
    var found = false;
    for(var j=0; j<userRows.length; j++) {
       if(userRows[j][0] === data.email) {
          sheet.getRange(j+1, 2).setValue(data.role);
          found = true;
          break;
       }
    }
    if(!found) sheet.appendRow([data.email, data.role, new Date(data.timestamp)]);
  } else if (action === "order") {
    sheet.appendRow([data.id, data.userEmail, data.total, JSON.stringify(data.items), new Date(data.timestamp)]);
  } else if (action === "product") {
    sheet.clear();
    sheet.appendRow(["ID", "SKU", "Name", "Category", "Price", "Quantity", "Status"]);
    data.forEach(function(p) {
      sheet.appendRow([p.id, p.sku, p.name, p.category, p.price, p.quantity, p.status]);
    });
  }
}
`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex bg-white p-2 rounded-2xl border border-stone-200 w-fit overflow-x-auto shadow-sm">
        <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Inventory</button>
        <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Orders</button>
        <button onClick={() => setActiveTab('reports')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Analytics</button>
        <button onClick={() => setActiveTab('guide')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'guide' ? 'bg-amber-600 text-white shadow-lg' : 'text-amber-600'}`}>Setup & Deploy</button>
      </div>

      {activeTab === 'inventory' && (
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-200 shadow-xl relative overflow-hidden">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8">{isEditing ? 'Refine Selection' : 'Add New Treasure'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <input required placeholder="Product Name" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
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
                  <button type="button" onClick={handleEnhance} className="absolute right-3 bottom-3 text-amber-600 font-bold text-[10px] uppercase">{aiLoading ? '...' : '✨ AI Stylist'}</button>
                </div>
                <input required placeholder="Image URL" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none text-xs" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all">{isEditing ? 'Update Entry' : 'Commit to Catalog'}</button>
              </div>
            </form>
          </div>
      )}

      {activeTab === 'guide' && (
        <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-stone-200 shadow-xl max-w-4xl mx-auto space-y-12">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Cloud Configuration</h2>
              <p className="text-stone-400 text-sm">Follow these steps to enable live Role & Inventory sync.</p>
            </div>
            <div className="bg-stone-50 px-4 py-2 rounded-full border border-stone-200 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Handshake: <span className="text-amber-600">Pending Setup</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-stone-800">1. Deploy the Backend</h3>
            <div className="p-6 bg-stone-900 rounded-2xl shadow-inner font-mono text-[11px] overflow-x-auto text-amber-50/80 leading-relaxed">
              <pre className="whitespace-pre-wrap">{appsScriptCode}</pre>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-3">
              <p className="text-xs text-amber-800 font-bold uppercase">Critical Action Items:</p>
              <ul className="text-xs text-amber-700 space-y-2 list-decimal list-inside">
                <li>Copy the code above.</li>
                <li>Go to your Google Spreadsheet > <b>Extensions > Apps Script</b>.</li>
                <li>Paste the code and click <b>Deploy > New Deployment</b>.</li>
                <li>Set Access to <b>"Anyone"</b> (Mandatory).</li>
                <li>Copy the <b>Web App URL</b> and paste it into <code>services/googleSheetsService.ts</code>.</li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-stone-100">
             <h3 className="text-lg font-serif font-bold text-stone-800 mb-4">2. Finalize & Sync</h3>
             <p className="text-sm text-stone-600 mb-6">Once you have updated the code and pushed to GitHub, your app will automatically fetch the latest roles from your Spreadsheet every time a user logs in.</p>
             <button 
               onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
               className="bg-stone-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-600 transition-all text-sm"
             >
               Verify Build on Vercel
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
