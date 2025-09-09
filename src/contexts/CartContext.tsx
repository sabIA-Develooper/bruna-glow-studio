import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
}

interface CartItem extends Course {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('studio-bruna-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('studio-bruna-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (course: Course) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === course.id);
      
      if (existingItem) {
        toast.info('Item já está no carrinho');
        return currentItems;
      }
      
      toast.success('Item adicionado ao carrinho!');
      return [...currentItems, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId: string) => {
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.id !== courseId);
      toast.success('Item removido do carrinho');
      return newItems;
    });
  };

  const updateQuantity = (courseId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(courseId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === courseId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Carrinho limpo');
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}