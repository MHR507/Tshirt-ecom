export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'normal' | 'designer';
  designer?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  image: string;
  images?: string[];
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Midnight Essence',
    price: 49,
    category: 'normal',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Charcoal', hex: '#2d2d2d' },
    ],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    description: 'Premium cotton tee with minimalist design. Perfect for everyday wear.',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Urban Edge',
    price: 55,
    originalPrice: 70,
    category: 'normal',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#f5f5f5' },
      { name: 'Grey', hex: '#6b6b6b' },
    ],
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
    description: 'Street-ready style with premium quality fabric.',
    isNew: true,
  },
  {
    id: '3',
    name: 'Neon Dreams',
    price: 120,
    category: 'designer',
    designer: 'Alex Void',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
    ],
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
    description: 'Limited edition designer piece featuring neon accents and unique graphics.',
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Void Walker',
    price: 150,
    category: 'designer',
    designer: 'Maya Chen',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Obsidian', hex: '#1a1a1a' },
      { name: 'Smoke', hex: '#3d3d3d' },
    ],
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
    description: 'Abstract geometric patterns meet luxury streetwear.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Classic Raw',
    price: 45,
    category: 'normal',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Navy', hex: '#1a1a2e' },
      { name: 'Forest', hex: '#1a2e1a' },
    ],
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
    description: 'Timeless design with raw edge details.',
  },
  {
    id: '6',
    name: 'Digital Flux',
    price: 135,
    category: 'designer',
    designer: 'Kai Storm',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
    ],
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=800&fit=crop',
    description: 'Digital art meets fashion in this exclusive designer collaboration.',
  },
  {
    id: '7',
    name: 'Shadow Line',
    price: 52,
    category: 'normal',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Slate', hex: '#4a4a4a' },
      { name: 'Onyx', hex: '#121212' },
    ],
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=800&fit=crop',
    description: 'Subtle shadow print on premium cotton blend.',
  },
  {
    id: '8',
    name: 'Axiom',
    price: 180,
    category: 'designer',
    designer: 'The Collective',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#f0f0f0' },
    ],
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop',
    description: 'Collaborative piece from The Collective featuring hand-finished details.',
    isNew: true,
  },
  {
    id: '9',
    name: 'Essential Noir',
    price: 42,
    category: 'normal',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
    ],
    image: 'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=600&h=800&fit=crop',
    description: 'The essential black tee, perfected.',
    isFeatured: true,
  },
  {
    id: '10',
    name: 'Cipher',
    price: 165,
    category: 'designer',
    designer: 'Alex Void',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Charcoal', hex: '#2a2a2a' },
    ],
    image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=800&fit=crop',
    description: 'Encrypted aesthetics for the modern minimalist.',
  },
  {
    id: '11',
    name: 'Pulse',
    price: 48,
    category: 'normal',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dark Grey', hex: '#333333' },
      { name: 'Black', hex: '#0a0a0a' },
    ],
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=800&fit=crop',
    description: 'Dynamic comfort for an active lifestyle.',
  },
  {
    id: '12',
    name: 'Ethereal',
    price: 195,
    category: 'designer',
    designer: 'Maya Chen',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Phantom', hex: '#1f1f1f' },
    ],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
    description: 'Where dreams meet fabric. A Maya Chen masterpiece.',
    isFeatured: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.isFeatured);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(p => p.isNew);
};

export const getProductsByCategory = (category: 'normal' | 'designer'): Product[] => {
  return products.filter(p => p.category === category);
};
