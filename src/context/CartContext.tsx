"use client"

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { CartItem, CartContextType } from '../types/cart';
import { cartService, Cart as BackendCart } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

// LocalStorage key (para fallback quando não autenticado)
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
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  backendCart: BackendCart | null;
}

// Estado inicial
const initialState: CartState = {
  items: [],
  isOpen: false,
  loading: false,
  error: null,
  backendCart: null,
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
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
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
  const { user, isAuthenticated } = useAuth();

  // Carregar carrinho do backend quando autenticado, ou localStorage quando não
  useEffect(() => {
    // Verificar se estamos no cliente (não SSR)
    if (typeof window === 'undefined') {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    const loadCart = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        if (isAuthenticated && user) {
          // Usar backend
          const response = await cartService.getCart();
          if (response.success && response.data) {
            // Converter dados do backend para formato do frontend
            const cartItems = response.data.items || [];
            const frontendItems: CartItem[] = cartItems.map((item: any) => ({
              id: item.bookId,
              titulo: item.titulo,
              autor: item.autor,
              price: item.preco,
              img1: item.imagemFront || '',
              quantity: item.quantity
            }));
            
            dispatch({ type: 'LOAD_CART', payload: frontendItems });
          } else {
            console.warn('Erro ao carregar carrinho do backend:', response.error);
            // Fallback para localStorage
            loadFromLocalStorage();
          }
        } else {
          // Usar localStorage quando não autenticado
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar carrinho' });
        // Fallback para localStorage
        loadFromLocalStorage();
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const loadFromLocalStorage = () => {
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
    };

    // Pequeno delay para garantir que localStorage está disponível
    const timer = setTimeout(() => {
      loadCart();
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  // Função debounced para salvar no localStorage (apenas quando não autenticado)
  const saveToLocalStorage = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (items: CartItem[]) => {
        // Verificar se estamos no cliente e não autenticado
        if (typeof window !== 'undefined' && !isAuthenticated) {
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
        }
      };
    })(),
    [isAuthenticated]
  );

  // Salvar carrinho no localStorage com debounce (apenas quando não autenticado)
  useEffect(() => {
    saveToLocalStorage(state.items);
  }, [state.items, saveToLocalStorage]);

  // Funções do carrinho
  const addToCart = async (livro: Omit<CartItem, 'quantity'>) => {
    if (isAuthenticated && user) {
      // Usar backend
      try {
        const response = await cartService.addItem({
          bookId: livro.id,
          quantity: 1
        });
        
        if (response.success && response.data) {
          // Converter dados do backend para formato do frontend
          const frontendItems: CartItem[] = response.data.items.map(item => ({
            id: item.bookId,
            titulo: item.titulo,
            autor: item.autor,
            price: item.preco,
            img1: item.imagemFront || '',
            quantity: item.quantity
          }));
          
          dispatch({ type: 'LOAD_CART', payload: frontendItems });
        } else {
          console.error('Erro ao adicionar item ao carrinho:', response.error);
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao adicionar item' });
        }
      } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao adicionar item ao carrinho' });
      }
    } else {
      // Usar localStorage quando não autenticado
      dispatch({ type: 'ADD_ITEM', payload: livro });
    }
  };

  const removeFromCart = async (id: number) => {
    if (isAuthenticated && user) {
      // Usar backend
      try {
        const response = await cartService.removeItem(id);
        
        if (response.success && response.data) {
          // Converter dados do backend para formato do frontend
          const frontendItems: CartItem[] = response.data.items.map(item => ({
            id: item.bookId,
            titulo: item.titulo,
            autor: item.autor,
            price: item.preco,
            img1: item.imagemFront || '',
            quantity: item.quantity
          }));
          
          dispatch({ type: 'LOAD_CART', payload: frontendItems });
        } else {
          console.error('Erro ao remover item do carrinho:', response.error);
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao remover item' });
        }
      } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao remover item do carrinho' });
      }
    } else {
      // Usar localStorage quando não autenticado
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (isAuthenticated && user) {
      // Usar backend
      try {
        const response = await cartService.updateQuantity({
          bookId: id,
          quantity
        });
        
        if (response.success && response.data) {
          // Converter dados do backend para formato do frontend
          const frontendItems: CartItem[] = response.data.items.map(item => ({
            id: item.bookId,
            titulo: item.titulo,
            autor: item.autor,
            price: item.preco,
            img1: item.imagemFront || '',
            quantity: item.quantity
          }));
          
          dispatch({ type: 'LOAD_CART', payload: frontendItems });
        } else {
          console.error('Erro ao atualizar quantidade:', response.error);
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao atualizar quantidade' });
        }
      } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar quantidade' });
      }
    } else {
      // Usar localStorage quando não autenticado
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user) {
      // Usar backend
      try {
        const response = await cartService.clearCart();
        
        if (response.success && response.data) {
          dispatch({ type: 'LOAD_CART', payload: [] });
        } else {
          console.error('Erro ao limpar carrinho:', response.error);
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao limpar carrinho' });
        }
      } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao limpar carrinho' });
      }
    } else {
      // Usar localStorage quando não autenticado
      dispatch({ type: 'CLEAR_CART' });
    }
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
    loading: state.loading,
    error: state.error,
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
