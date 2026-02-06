
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  const media = [
    { type: 'image', url: product.imageUrl },
    ...(product.additionalImages?.map(img => ({ type: 'image', url: img })) || []),
    ...(product.videoUrl ? [{ type: 'video', url: product.videoUrl }] : [])
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-600 bg-green-50';
      case 'Limited': return 'text-amber-600 bg-amber-50';
      case 'Out of Stock': return 'text-red-600 bg-red-50';
      default: return 'text-stone-600 bg-stone-50';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-stone-900 md:text-white transition-all shadow-lg"
        >
          ✕
        </button>

        {/* Media Gallery Section */}
        <div className="flex-1 bg-stone-100 flex flex-col md:flex-row relative group/gallery">
          {/* Thumbnails Sidebar (Left/Bottom) */}
          <div className="order-2 md:order-1 flex md:flex-col gap-3 p-4 bg-white/30 backdrop-blur md:h-full overflow-x-auto md:overflow-y-auto no-scrollbar">
            {media.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeIndex === idx ? 'border-amber-600 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center text-white">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Main Media View */}
          <div className="flex-1 order-1 md:order-2 relative bg-stone-200">
            {media[activeIndex].type === 'image' ? (
              <img 
                src={media[activeIndex].url} 
                alt={product.name} 
                className="w-full h-full object-contain p-4 md:p-8 animate-in fade-in duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black p-4">
                <iframe 
                  src={media[activeIndex].url} 
                  className="w-full h-full rounded-2xl"
                  title="Product Video"
                  allowFullScreen
                />
              </div>
            )}
            
            {/* Arrow Navigation */}
            <button 
              onClick={() => setActiveIndex(prev => (prev > 0 ? prev - 1 : media.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-stone-900 opacity-0 group-hover/gallery:opacity-100 transition-all shadow-xl"
            >
              ←
            </button>
            <button 
              onClick={() => setActiveIndex(prev => (prev < media.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-stone-900 opacity-0 group-hover/gallery:opacity-100 transition-all shadow-xl"
            >
              →
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-[400px] lg:w-[450px] p-8 md:p-12 overflow-y-auto space-y-8 bg-white">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                {product.category}
              </span>
              <span className="text-stone-400 font-mono text-[10px] uppercase">{product.sku}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">
              {product.name}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-stone-100">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">About this piece</h4>
            <p className="text-stone-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="text-[9px] text-stone-400 uppercase font-bold mb-1">Stock Availability</div>
                <div className="text-sm font-bold text-stone-800">{product.quantity} Units</div>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="text-[9px] text-stone-400 uppercase font-bold mb-1">Authenticity</div>
                <div className="text-sm font-bold text-stone-800">Certified</div>
              </div>
            </div>

            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              disabled={product.status === 'Out of Stock'}
              className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-2xl active:scale-95 disabled:bg-stone-200 disabled:text-stone-400"
            >
              Add to Bag
            </button>
            
            <p className="text-center text-[10px] text-stone-400 uppercase tracking-widest italic">
              Complimentary Boutique Packaging Included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
