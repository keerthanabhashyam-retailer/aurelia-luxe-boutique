
import React, { useState } from 'react';
import { Icons } from '../constants';

interface CommunityProps {
  onSync: (data: any) => void;
}

const Community: React.FC<CommunityProps> = ({ onSync }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', story: '', category: 'Rings' });

  const MOCK_STORIES = [
    { id: 1, name: "Arjun S.", category: "Rings", text: "The Eternal Band was the perfect anniversary surprise. The craftsmanship is unmatched.", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Priya K.", category: "Necklace", text: "Found my wedding jewelry at Aura. It felt like every piece had a soul of its own.", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Sarah L.", category: "Earrings", text: "Minimalist but striking. These studs are now my daily signature.", img: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSync({ ...form, timestamp: Date.now() });
    alert("Thank you for sharing your Aura moment! It has been synced to our community board.");
    setShowForm(false);
    setForm({ name: '', story: '', category: 'Rings' });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-stone-800">Trove of Inspiration</h2>
        <p className="text-stone-500 text-sm leading-relaxed">A gathering place for those who appreciate the finer things. Explore stories from our community or share your own journey with Aura.</p>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-600 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-900 transition-all shadow-lg"
        >
          {showForm ? 'Close Form' : 'Share Your Story'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-[2rem] border border-stone-200 shadow-xl space-y-6 animate-in slide-in-from-top-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Your Name</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl" placeholder="Alex Rivers" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Jewelry Piece</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl">
              <option>Rings</option><option>Necklace</option><option>Earrings</option><option>Bangles</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Your Experience</label>
            <textarea required value={form.story} onChange={e => setForm({...form, story: e.target.value})} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl h-32" placeholder="Tell us how you style your Aura jewelry..." />
          </div>
          <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold">Publish to Trove</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_STORIES.map(story => (
          <div key={story.id} className="bg-white rounded-3xl overflow-hidden border border-stone-100 group shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={story.img} alt={story.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em]">{story.category}</span>
                <span className="text-stone-300 text-[10px]">#AuraStyle</span>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed italic">"{story.text}"</p>
              <div className="pt-4 border-t border-stone-50 text-xs font-bold text-stone-400">— {story.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
