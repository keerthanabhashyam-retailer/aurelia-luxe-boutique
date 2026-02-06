
import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- RINGS ---
  {
    id: 'r1',
    sku: 'RNG-001',
    name: 'Eternal Diamond Band',
    category: 'Rings',
    description: 'A stunning 18k white gold band encrusted with brilliant-cut diamonds. Perfect for anniversaries.',
    price: 95000,
    quantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1603561591411-071c4f713932?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1598560912005-597659b7524b?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample placeholder
    status: 'In Stock'
  },
  {
    id: 'r2',
    sku: 'RNG-002',
    name: 'Solitaire Engagement Ring',
    category: 'Rings',
    description: 'A classic 1-carat round diamond set in a minimalist four-prong platinum band.',
    price: 150000,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'In Stock'
  },
  {
    id: 'r3',
    sku: 'RNG-003',
    name: 'Vintage Ruby Halo',
    category: 'Rings',
    description: 'Oval-cut pigeon blood ruby surrounded by a vintage-style diamond halo in yellow gold.',
    price: 72000,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1598560912005-597659b7524b?auto=format&fit=crop&q=80&w=800',
    status: 'Limited'
  },
  {
    id: 'e1',
    sku: 'EAR-001',
    name: 'Sapphire Drop Earrings',
    category: 'Earrings',
    description: 'Deep blue sapphires suspended from elegant gold teardrops. A regal choice for evening wear.',
    price: 65000,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'In Stock'
  },
  {
    id: 'n1',
    sku: 'NEC-001',
    name: 'Pearl Infinity Necklace',
    category: 'Necklace',
    description: 'Lustrous freshwater pearls on a delicate silver chain. Timeless elegance for any occasion.',
    price: 32000,
    quantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    status: 'In Stock'
  },
  {
    id: 'b1',
    sku: 'BNG-001',
    name: 'Heritage Gold Bangle',
    category: 'Bangles',
    description: 'Handcrafted traditional gold bangle with intricate filigree work. A legacy piece.',
    price: 135000,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1520a?auto=format&fit=crop&q=80&w=800',
    status: 'Limited'
  }
];
