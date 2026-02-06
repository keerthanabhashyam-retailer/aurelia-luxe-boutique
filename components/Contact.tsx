
import React, { useState } from 'react';

interface ContactProps {
  onSync: (data: any) => void;
}

const Contact: React.FC<ContactProps> = ({ onSync }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSync({ ...form, timestamp: Date.now() });
    alert("Message sent. Our concierge will reach out to you within 24 hours.");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-[10px]">Private Concierge</span>
            <h2 className="text-5xl font-serif font-bold text-stone-800 mt-2">Connect with us</h2>
          </div>
          <p className="text-stone-500 leading-relaxed">Whether you require assistance with an existing order or wish to schedule a private viewing at our Diamond District atelier, our concierge team is at your disposal.</p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">☏</div>
              <div>
                <h4 className="font-bold text-stone-800 text-sm">International Line</h4>
                <p className="text-stone-400 text-xs">+1 (555) 987-6543</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">✉</div>
              <div>
                <h4 className="font-bold text-stone-800 text-sm">Email Inquiry</h4>
                <p className="text-stone-400 text-xs">concierge@aurajewelry.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">⚲</div>
              <div>
                <h4 className="font-bold text-stone-800 text-sm">Main Atelier</h4>
                <p className="text-stone-400 text-xs">123 Luxury Avenue, Diamond District, NY</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Full Name</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email Address</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Message</label>
            <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl h-32" />
          </div>
          <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-xl">Send Inquiry</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
