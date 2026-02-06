
import React, { useState, useEffect } from 'react';
import { Product, Category, Order, UserRole } from '../types';
import { Icons, CATEGORIES } from '../constants';
import { enhanceDescription } from '../services/geminiService';
import { syncToSheets, getAllUsers, getAllRequests } from '../services/googleSheetsService';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAdd: (p: Omit<Product, 'id'>) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, onAdd, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'requests' | 'users' | 'guide'>('inventory');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', category: 'Rings', price: 0, quantity: 1, sku: '', description: '',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600'
  });
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'requests') fetchRequests();
  }, [activeTab]);

  const fetchUsers = async () => {
    setIsSyncing(true);
    const data = await getAllUsers();
    setUsers(data);
    setIsSyncing(false);
  };

  const fetchRequests = async () => {
    setIsSyncing(true);
    const data = await getAllRequests();
    setRequests(data);
    setIsSyncing(false);
  };

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
 * GOOGLE APPS SCRIPT: AURA BACKEND v3.0
 * Features: Sheets DB, Drive Image Storage, User Management
 */

var DRIVE_FOLDER_ID = "YOUR_DRIVE_FOLDER_ID"; // Replace this

function doGet(e) {
  var action = e.parameter.action;
  var email = e.parameter.email;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "getProducts") {
    return respond(getDataAsJson(ss, "Products"));
  }
  if (action === "getUsers") {
    return respond(getDataAsJson(ss, "Users"));
  }
  if (action === "getRequests") {
    return respond(getDataAsJson(ss, "SpecialRequests"));
  }
  if (action === "getRole" && email) {
    var sheet = ss.getSheetByName("Users");
    if (!sheet) return respond({ role: "USER" });
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === email) return respond({ role: data[i][1] });
    }
    return respond({ role: "USER" });
  }
}

function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var action = params.action;
  var data = params.data;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Image Upload to Drive
  if (action === "uploadImage") {
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var blob = Utilities.newBlob(Utilities.base64Decode(data.base64), data.mimeType, data.name);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return respond({ url: file.getDownloadUrl(), id: file.getId() });
  }

  // Sheets Logging
  var sheetName = action === "user" ? "Users" : 
                  action === "product" ? "Products" : 
                  action === "order" ? "Orders" : 
                  action === "special_request" ? "SpecialRequests" : "Logs";
  
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  if (action === "user") {
    logUser(sheet, data);
  } else if (action === "product") {
    updateInventory(sheet, data);
  } else {
    sheet.appendRow([new Date(), JSON.stringify(data)]);
  }
  return respond({ success: true });
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getDataAsJson(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var data = [];
  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) { obj[headers[j]] = rows[i][j]; }
    data.push(obj);
  }
  return data;
}

function logUser(sheet, data) {
  var rows = sheet.getDataRange().getValues();
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][0] === data.email) {
      sheet.getRange(i + 1, 2).setValue(data.role);
      return;
    }
  }
  sheet.appendRow([data.email, data.role, new Date()]);
}

function updateInventory(sheet, data) {
  sheet.clear();
  sheet.appendRow(["id", "sku", "name", "category", "price", "quantity", "status", "imageUrl", "description"]);
  data.forEach(function(p) {
    sheet.appendRow([p.id, p.sku, p.name, p.category, p.price, p.quantity, p.status, p.imageUrl, p.description]);
  });
}
`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex bg-white p-2 rounded-2xl border border-stone-200 w-fit overflow-x-auto shadow-sm">
        <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Catalog</button>
        <button onClick={() => setActiveTab('requests')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Bespoke</button>
        <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Orders</button>
        <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Registry</button>
        <button onClick={() => setActiveTab('guide')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'guide' ? 'bg-amber-600 text-white shadow-lg' : 'text-amber-600'}`}>Backend</button>
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
                <input required placeholder="Image URL (Drive Link)" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none text-xs" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all">{isEditing ? 'Update Entry' : 'Commit to Catalog'}</button>
              </div>
            </form>
          </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white p-12 rounded-[2.5rem] border border-stone-200 shadow-xl space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-serif font-bold text-stone-800">User Views: Bespoke Requests</h2>
            <button onClick={fetchRequests} className="text-xs font-bold text-amber-600 uppercase tracking-widest">{isSyncing ? 'Loading...' : '↻ Refresh'}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req, idx) => (
                <div key={idx} className="p-6 bg-stone-50 rounded-3xl border border-stone-100 flex gap-6">
                    <div className="w-24 h-24 bg-stone-200 rounded-2xl overflow-hidden shrink-0">
                        {req.image && <img src={req.image} className="w-full h-full object-cover" alt="Request" />}
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{req.view} Request</div>
                        <p className="text-sm font-medium text-stone-800 line-clamp-2">{req.description}</p>
                        <div className="flex justify-between text-[10px] text-stone-400">
                            <span>Qty: {req.quantity}</span>
                            <span>Due: {req.dueDate}</span>
                        </div>
                    </div>
                </div>
            ))}
            {requests.length === 0 && <p className="text-stone-400 italic text-sm">No bespoke requests found in Sheets/Drive. Configure your Backend to sync real user data.</p>}
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-stone-200 shadow-xl max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col gap-4">
            <div className="bg-red-50 border border-red-200 p-6 rounded-3xl">
              <h3 className="text-red-800 font-bold mb-2">🔴 Setup Required to Fix 'Failed to Fetch'</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                The current <b>SCRIPT_URL</b> is a placeholder. To enable the live cloud backend:
                <br /><br />
                1. Deploy the code below as a <b>Google Apps Script</b> Web App.
                <br />
                2. Set access to <b>"Anyone"</b>.
                <br />
                3. Update <code>services/googleSheetsService.ts</code> with your new URL.
              </p>
            </div>
            <div className="flex justify-between items-start">
              <div>
                  <h2 className="text-3xl font-serif font-bold text-stone-800">Enterprise Backend v3.0</h2>
                  <p className="text-stone-400 text-sm mt-1">Full support for Sheets Data + Google Drive Image Storage.</p>
              </div>
              <span className="bg-green-50 text-green-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">Live Sync Ready</span>
            </div>
          </div>
          <div className="p-6 bg-stone-900 rounded-2xl shadow-inner font-mono text-[11px] overflow-x-auto text-amber-50/80 leading-relaxed">
            <pre className="whitespace-pre-wrap">{appsScriptCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
