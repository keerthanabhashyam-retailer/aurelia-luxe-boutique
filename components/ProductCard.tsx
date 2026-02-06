
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-600 bg-green-50';
      case 'Limited': return 'text-amber-600 bg-amber-50';
      case 'Out of Stock': return 'text-red-600 bg-red-50';
      default: return 'text-stone-600 bg-stone-50';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-lg font-bold text-stone-800 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
          <span className="font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
        
        <p className="text-xs text-stone-500 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="grid grid-cols-2 gap-y-2 text-[10px] mb-6">
          <div className="text-stone-400 uppercase tracking-tighter">SKU ID</div>
          <div className="text-stone-900 font-mono text-right">{product.sku}</div>
          
          <div className="text-stone-400 uppercase tracking-tighter">Availability</div>
          <div className={`font-bold text-right rounded px-1.5 py-0.5 inline-block ml-auto ${getStatusColor(product.status)}`}>
            {product.status}
          </div>

          <div className="text-stone-400 uppercase tracking-tighter">Qty Available</div>
          <div className="text-stone-900 font-bold text-right">{product.quantity} units</div>
        </div>

        <button 
          onClick={() => onAddToCart(product)}
          disabled={product.status === 'Out of Stock'}
          className="w-full bg-stone-900 text-white py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-all active:scale-95 disabled:bg-stone-200 disabled:text-stone-400 disabled:scale-100"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
