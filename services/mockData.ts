
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
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
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
    imageUrl: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&q=80&w=600',
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
    imageUrl: 'https://images.unsplash.com/photo-1598560912005-597659b7524b?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'r4',
    sku: 'RNG-004',
    name: 'Sapphire Promise Ring',
    category: 'Rings',
    description: 'Delicate blue sapphire heart set in sterling silver with side accents.',
    price: 12500,
    quantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-071c4f713932?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'r5',
    sku: 'RNG-005',
    name: 'Emerald Eternity Band',
    category: 'Rings',
    description: 'Continuous circle of laboratory-grown emeralds set in 14k yellow gold.',
    price: 45000,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1617038220319-276d3cfab60e?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'r6',
    sku: 'RNG-006',
    name: 'Rose Gold Love Knot',
    category: 'Rings',
    description: 'Intricately woven rose gold strands forming a symbolic knot of eternal love.',
    price: 18000,
    quantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'r7',
    sku: 'RNG-007',
    name: 'Opal Teardrop Ring',
    category: 'Rings',
    description: 'Ethereal Australian opal with blue-green fire, cut in a graceful teardrop shape.',
    price: 28000,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1627225924765-552d44cfec2b?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'r8',
    sku: 'RNG-008',
    name: 'Men\'s Brushed Tungsten',
    category: 'Rings',
    description: 'Masculine 8mm tungsten carbide band with a brushed matte finish and rose gold interior.',
    price: 8500,
    quantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-537ef5278533?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'r9',
    sku: 'RNG-009',
    name: 'Celtic Silver Knot',
    category: 'Rings',
    description: 'Solid sterling silver ring featuring traditional Celtic Trinity knots.',
    price: 4500,
    quantity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'r10',
    sku: 'RNG-010',
    name: 'Floral Gold Band',
    category: 'Rings',
    description: 'Hand-carved floral motifs on a wide 22k yellow gold wedding band.',
    price: 52000,
    quantity: 0,
    imageUrl: 'https://images.unsplash.com/photo-1622398476015-51834280f64b?auto=format&fit=crop&q=80&w=600',
    status: 'Out of Stock'
  },

  // --- EARRINGS ---
  {
    id: 'e1',
    sku: 'EAR-001',
    name: 'Sapphire Drop Earrings',
    category: 'Earrings',
    description: 'Deep blue sapphires suspended from elegant gold teardrops. A regal choice for evening wear.',
    price: 65000,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'e2',
    sku: 'EAR-002',
    name: 'Classic Diamond Studs',
    category: 'Earrings',
    description: 'Matching pair of 0.5ct brilliant diamonds in white gold basket settings.',
    price: 110000,
    quantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'e3',
    sku: 'EAR-003',
    name: 'Hammered Gold Hoops',
    category: 'Earrings',
    description: 'Large, lightweight 14k gold hoops with a unique hammered texture for organic shine.',
    price: 15000,
    quantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1630019051930-47382db9550b?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'e4',
    sku: 'EAR-004',
    name: 'Emerald Chandelier Drops',
    category: 'Earrings',
    description: 'Statement chandelier earrings featuring cascading green emeralds and diamond accents.',
    price: 88000,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'e5',
    sku: 'EAR-005',
    name: 'Pearl Ear Climbers',
    category: 'Earrings',
    description: 'Gradient of tiny freshwater pearls that curve gracefully up the ear lobe.',
    price: 9500,
    quantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1588444839138-042230490422?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'e6',
    sku: 'EAR-006',
    name: 'Traditional Ruby Jhumkas',
    category: 'Earrings',
    description: 'Classic Indian temple style Jhumkas with intricate gold work and ruby droplets.',
    price: 48000,
    quantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1630019051930-47382db9550b?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'e7',
    sku: 'EAR-007',
    name: 'Silver Filigree Studs',
    category: 'Earrings',
    description: 'Handmade sterling silver earrings with delicate lace-like filigree patterns.',
    price: 3200,
    quantity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'e8',
    sku: 'EAR-008',
    name: 'Amethyst Geometric Drops',
    category: 'Earrings',
    description: 'Square-cut purple amethysts suspended from hexagonal gold frames.',
    price: 18500,
    quantity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'e9',
    sku: 'EAR-009',
    name: 'Tanzanite Night Stars',
    category: 'Earrings',
    description: 'Rare tanzanite gemstones set in starburst diamond settings. Truly cosmic.',
    price: 75000,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'e10',
    sku: 'EAR-010',
    name: 'Kundan Bridal Earrings',
    category: 'Earrings',
    description: 'Grand bridal earrings with high-quality Kundan stones and green bead hangings.',
    price: 35000,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1626084300762-53974492740d?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },

  // --- NECKLACES ---
  {
    id: 'n1',
    sku: 'NEC-001',
    name: 'Pearl Infinity Necklace',
    category: 'Necklace',
    description: 'Lustrous freshwater pearls on a delicate silver chain. Timeless elegance for any occasion.',
    price: 32000,
    quantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'n2',
    sku: 'NEC-002',
    name: '22k Gold Choker',
    category: 'Necklace',
    description: 'Modern gold choker with geometric cutouts, perfect for contemporary bridal looks.',
    price: 125000,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'n3',
    sku: 'NEC-003',
    name: 'Diamond Solitaire Necklace',
    category: 'Necklace',
    description: 'A single 0.75ct diamond on an invisible-look white gold chain.',
    price: 98000,
    quantity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1596944221747-28512135ee71?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'n4',
    sku: 'NEC-004',
    name: 'Emerald Collar Piece',
    category: 'Necklace',
    description: 'Luxurious collar necklace set with graduated emeralds and baguette diamonds.',
    price: 210000,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a308c021?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'n5',
    sku: 'NEC-005',
    name: 'Ruby Ratan Mal',
    category: 'Necklace',
    description: 'Long traditional mala with semi-precious rubies and gold-plated silver beads.',
    price: 18000,
    quantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'n6',
    sku: 'NEC-006',
    name: 'Silver Locket Chain',
    category: 'Necklace',
    description: 'Vintage-inspired silver locket that opens to hold two photos.',
    price: 5500,
    quantity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1602752250015-52934bc45613?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'n7',
    sku: 'NEC-007',
    name: 'Rose Gold Bar Necklace',
    category: 'Necklace',
    description: 'Minimalist horizontal bar pendant on a rose gold chain, can be engraved.',
    price: 12000,
    quantity: 22,
    imageUrl: 'https://images.unsplash.com/photo-1599643477077-7c9f237f703c?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'n8',
    sku: 'NEC-008',
    name: 'Kundan Bridal Haar',
    category: 'Necklace',
    description: 'Magnificent long haar with emerald drops and exquisite Kundan work.',
    price: 85000,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'n9',
    sku: 'NEC-009',
    name: 'Antique Temple Necklace',
    category: 'Necklace',
    description: 'Deeply embossed gold necklace featuring divine figures in temple architecture style.',
    price: 155000,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1626084300762-53974492740d?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'n10',
    sku: 'NEC-010',
    name: 'Layered Boho Chain',
    category: 'Necklace',
    description: 'Triple layered silver chains with turquoise stone accents for a bohemian look.',
    price: 3800,
    quantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1596944221747-28512135ee71?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },

  // --- BANGLES ---
  {
    id: 'b1',
    sku: 'BNG-001',
    name: 'Heritage Gold Bangle',
    category: 'Bangles',
    description: 'Handcrafted traditional gold bangle with intricate filigree work. A legacy piece.',
    price: 135000,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1520a?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'b2',
    sku: 'BNG-002',
    name: 'Royal Diamond Kada',
    category: 'Bangles',
    description: 'Thick gold kada set with uncut diamonds (Polki) and enamel work on the inner rim.',
    price: 245000,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },
  {
    id: 'b3',
    sku: 'BNG-003',
    name: 'Oxidized Silver Bangle Set',
    category: 'Bangles',
    description: 'Set of 12 stackable silver bangles with traditional tribal engravings.',
    price: 4500,
    quantity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'b4',
    sku: 'BNG-004',
    name: 'Rose Gold Slim Cuff',
    category: 'Bangles',
    description: 'Understated rose gold bangle with a single diamond spark at the center.',
    price: 22000,
    quantity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'b5',
    sku: 'BNG-005',
    name: 'Designer Glass Bangles',
    category: 'Bangles',
    description: 'Hand-painted decorative glass bangles with gold foil embellishments.',
    price: 1200,
    quantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1620932464016-830219c629a8?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'b6',
    sku: 'BNG-006',
    name: 'Antique Copper Kada',
    category: 'Bangles',
    description: 'Solid copper kada with lion-head terminals, inspired by ancient Indian designs.',
    price: 5800,
    quantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1520a?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'b7',
    sku: 'BNG-007',
    name: 'Polki Enamel Bangle',
    category: 'Bangles',
    description: 'Meenakari enamel work paired with radiant polki diamonds for a festive look.',
    price: 78000,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'b8',
    sku: 'BNG-008',
    name: 'Minimalist Gold Wire',
    category: 'Bangles',
    description: 'Extremely thin and flexible 18k gold wire bangle for everyday chic.',
    price: 18000,
    quantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'b9',
    sku: 'BNG-009',
    name: 'Floral Enamel Kada',
    category: 'Bangles',
    description: 'Bright red and green enamel flowers on a sturdy gold-plated silver bangle.',
    price: 9500,
    quantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1520a?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'b10',
    sku: 'BNG-010',
    name: 'Temple Gold Vanki',
    category: 'Bangles',
    description: 'Traditional arm-band style bangle with goddess Lakshmi central motif.',
    price: 62000,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1626084300762-53974492740d?auto=format&fit=crop&q=80&w=600',
    status: 'Limited'
  },

  // --- BRACELETS ---
  {
    id: 'br1',
    sku: 'BRC-001',
    name: 'Rose Quartz Bracelet',
    category: 'Bracelets',
    description: 'Smooth rose quartz beads with a sterling silver charm. Subtle and charming.',
    price: 8500,
    quantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br2',
    sku: 'BRC-002',
    name: 'Diamond Tennis Bracelet',
    category: 'Bracelets',
    description: 'A row of 50 perfectly matched diamonds set in a flexible white gold track.',
    price: 285000,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br3',
    sku: 'BRC-003',
    name: 'Gold Curb Link Bracelet',
    category: 'Bracelets',
    description: 'Solid gold curb links with a secure lobster clasp. High polish finish.',
    price: 55000,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br4',
    sku: 'BRC-004',
    name: 'Silver Charm Bracelet',
    category: 'Bracelets',
    description: 'Sterling silver chain featuring five starter charms: heart, star, moon, key, and clover.',
    price: 11000,
    quantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br5',
    sku: 'BRC-005',
    name: 'Multi-strand Leather Wrap',
    category: 'Bracelets',
    description: 'Cognac leather strands with silver tube beads and a magnetic clasp.',
    price: 3500,
    quantity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br6',
    sku: 'BRC-006',
    name: 'Amethyst Open Cuff',
    category: 'Bracelets',
    description: 'Rose gold cuff with two raw amethyst crystals at the opening.',
    price: 16500,
    quantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br7',
    sku: 'BRC-007',
    name: 'Protective Evil Eye Bracelet',
    category: 'Bracelets',
    description: 'Enamel evil eye charm on a slim gold chain with sapphire "pupil".',
    price: 14000,
    quantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br8',
    sku: 'BRC-008',
    name: 'Baroque Pearl Toggle',
    category: 'Bracelets',
    description: 'Irregularly shaped large baroque pearls with a decorative gold toggle clasp.',
    price: 24000,
    quantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br9',
    sku: 'BRC-009',
    name: 'Men\'s Stainless Steel Cuff',
    category: 'Bracelets',
    description: 'Industrial style heavy-duty stainless steel cuff with black carbon fiber inlay.',
    price: 5200,
    quantity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'br10',
    sku: 'BRC-010',
    name: 'Infinity Symbol Bracelet',
    category: 'Bracelets',
    description: 'Double strand silver chain with a diamond-cut infinity symbol.',
    price: 7800,
    quantity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },

  // --- PENDANTS ---
  {
    id: 'p1',
    sku: 'PEN-001',
    name: 'Celestial Moon Pendant',
    category: 'Pendants',
    description: 'A crescent moon crafted from sterling silver with a single diamond accent.',
    price: 22000,
    quantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p2',
    sku: 'PEN-002',
    name: 'Sacred Heart Locket',
    category: 'Pendants',
    description: 'Antique gold locket with hand-engraved scrollwork and space for a keepsake.',
    price: 14500,
    quantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p3',
    sku: 'PEN-003',
    name: 'Initial "A" Gold Pendant',
    category: 'Pendants',
    description: 'Polished 18k yellow gold letter A with a tiny sapphire dot.',
    price: 8500,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-537ef5278533?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p4',
    sku: 'PEN-004',
    name: 'Serene Jade Buddha',
    category: 'Pendants',
    description: 'Carved natural green jade Buddha figure in a gold bamboo frame.',
    price: 32000,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a308c021?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p5',
    sku: 'PEN-005',
    name: 'Garnet Teardrop Pendant',
    category: 'Pendants',
    description: 'Vibrant red garnet in a faceted teardrop cut, set in blackened silver.',
    price: 11000,
    quantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p6',
    sku: 'PEN-006',
    name: 'Shooting Star Silver',
    category: 'Pendants',
    description: 'Whimsical shooting star design with a trail of sparkling zirconias.',
    price: 4500,
    quantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p7',
    sku: 'PEN-007',
    name: 'Classic Gold Cross',
    category: 'Pendants',
    description: 'Solid gold plain cross with beveled edges. A timeless devotional piece.',
    price: 15000,
    quantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-537ef5278533?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p8',
    sku: 'PEN-008',
    name: 'Divine OM Pendant',
    category: 'Pendants',
    description: 'Spiritually significant OM symbol in high-relief gold with textured background.',
    price: 12500,
    quantity: 22,
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p9',
    sku: 'PEN-009',
    name: 'Golden Butterfly Pendant',
    category: 'Pendants',
    description: 'Delicate butterfly with filigree wings and diamond-tipped antennae.',
    price: 19000,
    quantity: 7,
    imageUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  },
  {
    id: 'p10',
    sku: 'PEN-010',
    name: 'Raw Amethyst Crystal',
    category: 'Pendants',
    description: 'Natural unpolished purple amethyst point wrapped in silver wire.',
    price: 6500,
    quantity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=600',
    status: 'In Stock'
  }
];
