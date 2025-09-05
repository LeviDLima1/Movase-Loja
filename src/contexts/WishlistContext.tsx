'use client';

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { WishlistItem, WishlistContextType } from '../types/wishlist';
import { wishlistService, WishlistResponse } from '../services/wishlistService';
import { useAuth } from './AuthContext';

// LocalStorage key (para fallback quando não autenticado)
const WISHLIST_STORAGE_KEY = 'movase-wishlist';

// Função para validar estrutura dos dados da wishlist
function validateWishlistData(data: any): data is WishlistItem[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(item => 
    typeof item === 'object' &&
    typeof item.id === 'number' &&
    typeof item.titulo === 'string' &&
    typeof item.autor === 'string' &&
    typeof item.price === 'number' &&
    typeof item.img1 === 'string' &&
    typeof item.categoria === 'string' &&
    typeof item.dataAdicionado === 'string'
  );
}

// Tipos para o reducer
type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Reducer
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Verificar se o item já existe
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return state; // Não adicionar duplicatas
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
      };
    
    case 'LOAD_WISHLIST':
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
    
    default:
      return state;
  }
}

// Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Carregar wishlist do backend quando autenticado, ou localStorage quando não
  useEffect(() => {
    // Verificar se estamos no cliente (não SSR)
    if (typeof window === 'undefined') {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    const loadWishlist = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        if (isAuthenticated && user) {
          // Usar backend
          const response = await wishlistService.getWishlist();
          if (response.success && response.data) {
            const wishlistItems = response.data.items || [];
            dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
          } else {
            console.warn('Erro ao carregar wishlist do backend:', response.error);
            // Fallback para localStorage
            loadFromLocalStorage();
          }
        } else {
          // Usar localStorage quando não autenticado
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Erro ao carregar wishlist:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar wishlist' });
        // Fallback para localStorage
        loadFromLocalStorage();
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          
          // Validação completa dos dados
          if (validateWishlistData(parsedWishlist)) {
            dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
          } else {
            console.warn('Dados da wishlist inválidos ou corrompidos, iniciando wishlist vazia');
            localStorage.removeItem(WISHLIST_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar wishlist do localStorage:', error);
        // Limpar dados corrompidos
        try {
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
        } catch (removeError) {
          console.error('Erro ao limpar localStorage corrompido:', removeError);
        }
      }
    };

    // Pequeno delay para garantir que localStorage está disponível
    const timer = setTimeout(() => {
      loadWishlist();
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  // Função debounced para salvar no localStorage (apenas quando não autenticado)
  const saveToLocalStorage = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (items: WishlistItem[]) => {
        // Verificar se estamos no cliente e não autenticado
        if (typeof window !== 'undefined' && !isAuthenticated) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            try {
              localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
            } catch (error) {
              console.error('Erro ao salvar wishlist no localStorage:', error);
              // Se localStorage estiver cheio, tenta limpar e salvar novamente
              try {
                localStorage.clear();
                localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
              } catch (retryError) {
                console.error('Erro ao tentar salvar wishlist após limpeza:', retryError);
              }
            }
          }, 500); // Debounce de 500ms
        }
      };
    })(),
    [isAuthenticated]
  );

  // Salvar wishlist no localStorage com debounce (apenas quando não autenticado)
  useEffect(() => {
    saveToLocalStorage(state.items);
  }, [state.items, saveToLocalStorage]);

  // Funções da wishlist
  const addToWishlist = async (livro: Omit<WishlistItem, 'dataAdicionado'>) => {
    if (isAuthenticated && user) {
      // Usar backend
      try {
        const response = await wishlistService.addItem(livro);
        
        if (response.success && response.data) {
          const wishlistItems = response.data.items || [];
          dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
        } else {
          console.error('Erro ao adicionar item à wishlist:', response.error);
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao adicionar item' });
        }
      } catch (error) {
        console.error('Erro ao adicionar item à wishlist:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao adicionar item à wishlist' });
      }
    } else {
      // Usar localStorage quando não autenticado
      const wishlistItem: WishlistItem = {
        ...livro,
        dataAdicionado: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
    }
  };

  const removeFromWishlist = async (id: number) => {
    if (isAuthenticated && user) {
      // Usar backend
      try {
        const response = await wishlistService.removeItem(id);
        
        if (response.success && response.data) {
          const wishlistItems = response.data.items || [];
          dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
        } else {
          console.error('Erro ao remover item da wishlist:', response.error);
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao remover item' });
        }
      } catch (error) {
        console.error('Erro ao remover item da wishlist:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao remover item da wishlist' });
      }
    } else {
      // Usar localStorage quando não autenticado
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  };

  const clearWishlist = async () => {
    if (isAuthenticated && user) {
      // Usar backend
      try {
        const response = await wishlistService.clearWishlist();
        
        if (response.success) {
          dispatch({ type: 'LOAD_WISHLIST', payload: [] });
        } else {
          console.error('Erro ao limpar wishlist:', response.error);
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao limpar wishlist' });
        }
      } catch (error) {
        console.error('Erro ao limpar wishlist:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao limpar wishlist' });
      }
    } else {
      // Usar localStorage quando não autenticado
      dispatch({ type: 'CLEAR_WISHLIST' });
    }
  };

  const isInWishlist = useCallback((id: number): boolean => {
    return state.items.some(item => item.id === id);
  }, [state.items]);

  // Cálculos memoizados para performance
  const itemCount = useMemo(() => state.items.length, [state.items]);

  const value: WishlistContextType = {
    items: state.items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    itemCount,
    loading: state.loading,
    error: state.error,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// Hook personalizado
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist deve ser usado dentro de um WishlistProvider');
  }
  return context;
}
