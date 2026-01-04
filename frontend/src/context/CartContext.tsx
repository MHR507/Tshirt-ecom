import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  images?: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  designer?: string;
  customDesignId?: number | null; // Optional foreign key to custom design
  [key: string]: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string, customDesignId?: number | null) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number, customDesignId?: number | null) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Helper to check if two cart items match (including customDesignId)
  const itemsMatch = (item: CartItem, productId: string, size: string, color: string, customDesignId?: number | null) => {
    const itemDesignId = item.product.customDesignId;
    const targetDesignId = customDesignId;

    // If both have custom design IDs, they must match
    // If one has and one doesn't, they don't match
    // If neither has, they match based on product/size/color
    const designMatch = itemDesignId === targetDesignId;

    return (
      item.product.id === productId &&
      item.selectedSize === size &&
      item.selectedColor === color &&
      designMatch
    );
  };

  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item =>
        itemsMatch(item, product.id, size, color, product.customDesignId)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color: string, customDesignId?: number | null) => {
    setItems(prev => prev.filter(item =>
      !itemsMatch(item, productId, size, color, customDesignId)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number, customDesignId?: number | null) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color, customDesignId);
      return;
    }

    setItems(prev => prev.map(item => {
      if (itemsMatch(item, productId, size, color, customDesignId)) {
        return { ...item, quantity };
      }
      return item;
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
