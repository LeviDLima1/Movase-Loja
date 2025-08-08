"use client"

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { CartItem, CartContextType } from '../types/cart';

// LocalStorage key
const CART_STORAGE_KEY = 'movase-cart';

// Função para validar estrutura dos dados do carrinho
function validateCartData(data: any): data is CartItem[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(item => 
    typeof item === 'object' &&
    typeof item.id === 'number' &&
    typeof item.titulo === 'string' &&
    typeof item.autor === 'string' &&
    typeof item.price === 'number' &&
    typeof item.img1 === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    item.price >= 0
  );
}

// Tipos para o reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Estado inicial
const initialState: CartState = {
  items: [],
  isOpen: false,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    
    default:
      return state;
  }
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validação completa dos dados
        if (validateCartData(parsedCart)) {
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        } else {
          console.warn('Dados do carrinho inválidos ou corrompidos, iniciando carrinho vazio');
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
      // Limpar dados corrompidos
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch (removeError) {
        console.error('Erro ao limpar localStorage corrompido:', removeError);
      }
    }
  }, []);

  // Função debounced para salvar no localStorage
  const saveToLocalStorage = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (items: CartItem[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
          } catch (error) {
            console.error('Erro ao salvar carrinho no localStorage:', error);
            // Se localStorage estiver cheio, tenta limpar e salvar novamente
            try {
              localStorage.clear();
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            } catch (retryError) {
              console.error('Erro ao tentar salvar carrinho após limpeza:', retryError);
            }
          }
        }, 500); // Debounce de 500ms
      };
    })(),
    []
  );

  // Salvar carrinho no localStorage com debounce
  useEffect(() => {
    saveToLocalStorage(state.items);
  }, [state.items, saveToLocalStorage]);

  // Funções do carrinho
  const addToCart = (livro: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: livro });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  // Cálculos memoizados para performance
  const total = useMemo(() => 
    state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
    [state.items]
  );
  
  const itemCount = useMemo(() => 
    state.items.reduce((sum, item) => sum + item.quantity, 0), 
    [state.items]
  );

  const value: CartContextType = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isOpen: state.isOpen,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
