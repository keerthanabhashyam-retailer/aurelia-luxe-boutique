
import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, Order, UserRole } from '../types';
import { Icons, CATEGORIES } from '../constants';
import { enhanceDescription } from '../services/geminiService';
import { getAllUsers, getAllRequests } from '../services/googleSheetsService';

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
  const formRef = useRef<HTMLDivElement>(null);

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

  const handleEditInit = (p: Product) => {
    setIsEditing(p.id);
    setFormData({ ...p });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
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
 * GOOGLE APPS SCRIPT: AURA BACKEND v3.1
 * Fixed: 'postData' undefined error and added mandatory returns.
 */

var DRIVE_FOLDER_ID = "YOUR_DRIVE_FOLDER_ID"; 

function doGet(e) {
  if (!e) return respond({ error: "No parameters provided" });
  
  var action = e.parameter.action;
  var email = e.parameter.email;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    if (action === "getProducts") return respond({ products: getDataAsJson(ss, "Products") });
    if (action === "getUsers") return respond({ users: getDataAsJson(ss, "Users") });
    if (action === "getRequests") return respond({ requests: getDataAsJson(ss, "SpecialRequests") });
    if (action === "getRole" && email) {
      var sheet = ss.getSheetByName("Users");
      if (!sheet) return respond({ role: "USER" });
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === email) return respond({ role: data[i][1] });
      }
      return respond({ role: "USER" });
    }
    return respond({ message: "Action not found" });
  } catch (err) {
    return respond({ error: err.toString() });
  }
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return respond({ error: "This function must be called via an HTTP POST request from the app." });
  }

  var params = JSON.parse(e.postData.contents);
  var action = params.action;
  var data = params.data;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === "uploadImage") {
      var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      var blob = Utilities.newBlob(Utilities.base64Decode(data.base64), data.mimeType, data.name);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return respond({ url: file.getDownloadUrl(), id: file.getId() });
    }

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
  } catch (err) {
    return respond({ success: false, error: err.toString() });
  }
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDataAsJson(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 1) return [];
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
  if (Array.isArray(data)) {
    data.forEach(function(p) {
      sheet.appendRow([p.id, p.sku, p.name, p.category, p.price, p.quantity, p.status, p.imageUrl, p.description]);
    });
  }
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
        <div className="space-y-12">
          {/* Add/Edit Form */}
          <div ref={formRef} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-stone-800">
                  {isEditing ? 'Refine Selection' : 'Add New Treasure'}
                </h2>
                {isEditing && (
                  <button onClick={resetForm} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Cancel Edit</button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Name</label>
                    <input required placeholder="Product Name" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Category</label>
                      <select className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">SKU</label>
                      <input required placeholder="SKU-001" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Price (₹)</label>
                      <input type="number" required placeholder="0" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Quantity</label>
                      <input type="number" required placeholder="1" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Description</label>
                    <div className="relative">
                      <textarea rows={4} placeholder="Story behind the piece..." className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      <button type="button" onClick={handleEnhance} className="absolute right-3 bottom-3 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-amber-100 text-amber-600 font-bold text-[10px] uppercase shadow-sm hover:bg-amber-50 transition-colors">
                        {aiLoading ? '✨ Crafting...' : '✨ AI Stylist'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Image Source (Drive/Unsplash)</label>
                    <input required placeholder="https://..." className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none text-xs focus:ring-2 focus:ring-amber-500 transition-all" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-xl active:scale-95">
                    {isEditing ? 'Update Entry' : 'Commit to Catalog'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Product List Section */}
          <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/30">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-800">Current Collection</h3>
                <p className="text-stone-400 text-xs mt-1">{products.length} items in local store</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Item</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">SKU</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Stock</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="font-medium text-stone-800 text-sm">{p.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-stone-400">{p.sku}</td>
                      <td className="px-6 py-4">
                        <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{p.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-stone-800">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${p.quantity > 5 ? 'bg-green-500' : p.quantity > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                          <span className="text-xs text-stone-500">{p.quantity} units</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditInit(p)} className="p-2 text-stone-400 hover:text-amber-600 transition-colors">
                            <Icons.Edit />
                          </button>
                          <button onClick={() => onDelete(p.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                            <Icons.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-stone-400 italic text-sm">
                        No treasures found. Begin your legacy by adding the first item.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden animate-in fade-in">
          <div className="p-8 border-b border-stone-100 bg-stone-50/30">
            <h3 className="text-2xl font-serif font-bold text-stone-800">Order Manifest</h3>
            <p className="text-stone-400 text-xs mt-1">Review and manage recent customer transactions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Items</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-amber-600 font-bold">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-stone-800">{order.userEmail}</td>
                    <td className="px-6 py-4 text-xs text-stone-500">
                      {order.items.map(i => `${i.cartQuantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-stone-800">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-xs text-stone-400">{new Date(order.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-stone-400 italic text-sm">
                      No orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden animate-in fade-in">
          <div className="p-8 border-b border-stone-100 bg-stone-50/30 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-800">Registry</h3>
              <p className="text-stone-400 text-xs mt-1">Authorized personnel and customer directory</p>
            </div>
            <button onClick={fetchUsers} className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Refresh Registry</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Access Granted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((user, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-stone-800 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-400">
                      {user.timestamp ? new Date(user.timestamp).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !isSyncing && (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-stone-400 italic text-sm">
                      The registry is currently empty. Connect to Sheets to view real-time user data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white p-12 rounded-[2.5rem] border border-stone-200 shadow-xl space-y-8 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-serif font-bold text-stone-800">Bespoke Design Requests</h2>
            <button onClick={fetchRequests} className="text-xs font-bold text-amber-600 uppercase tracking-widest">{isSyncing ? 'Loading...' : '↻ Refresh'}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req, idx) => (
                <div key={idx} className="p-6 bg-stone-50 rounded-3xl border border-stone-100 flex gap-6 hover:shadow-md transition-all">
                    <div className="w-24 h-24 bg-stone-200 rounded-2xl overflow-hidden shrink-0">
                        {req.image ? <img src={req.image} className="w-full h-full object-cover" alt="Request" /> : <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>}
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{req.view || 'Custom'} Style</div>
                        <p className="text-sm font-medium text-stone-800 line-clamp-2">{req.description}</p>
                        <div className="flex justify-between text-[10px] text-stone-400 pt-2 border-t border-stone-200">
                            <span>Quantity: {req.quantity}</span>
                            <span>Due: {req.dueDate}</span>
                        </div>
                    </div>
                </div>
            ))}
            {requests.length === 0 && (
              <div className="col-span-full py-20 text-center text-stone-400 italic text-sm border-2 border-dashed border-stone-100 rounded-3xl">
                No bespoke requests found in your archives.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-stone-200 shadow-xl max-w-4xl mx-auto space-y-12 animate-in fade-in">
          <div className="flex flex-col gap-4">
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl">
              <h3 className="text-amber-800 font-bold mb-2">⚙️ Backend Configuration Guide</h3>
              <p className="text-stone-700 text-sm leading-relaxed">
                To fix the <b>"Failed to Fetch"</b> and <b>"postData"</b> errors, follow these steps:
                <br /><br />
                1. <b>DO NOT</b> click "Run" for <code>doPost</code> in the Apps Script editor. It will always fail there.
                <br />
                2. Click <b>"Deploy"</b> &gt; <b>"New Deployment"</b>.
                <br />
                3. Select <b>"Web App"</b>, set Access to <b>"Anyone"</b>.
                <br />
                4. Copy the <b>Web App URL</b> and paste it into <code>services/googleSheetsService.ts</code>.
              </p>
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
