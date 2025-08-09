'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface AdminState {
  orders: Order[];
  products: Product[];
  notifications: Notification[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

export interface Order {
  id: string;
  numero: string;
  cliente: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
  };
  produtos: Array<{
    id: string;
    titulo: string;
    quantidade: number;
    preco: number;
  }>;
  total: number;
  status: 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';
  dataPedido: string;
  dataPagamento?: string;
  dataEnvio?: string;
  formaPagamento: string;
  frete: number;
  observacoes?: string;
}

export interface Product {
  id: string;
  titulo: string;
  autor: string;
  preco: number;
  estoque: number;
  status: 'ativo' | 'inativo';
  categoria: string;
  dataCriacao: string;
  vendas: number;
}

export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  message: string;
  time: string;
  read: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  conversionChange: number;
}

// Actions
type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

// Initial State
const initialState: AdminState = {
  orders: [],
  products: [],
  notifications: [],
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    conversionRate: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    conversionChange: 0
  },
  loading: false,
  error: null
};

// Reducer
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders]
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
    
    default:
      return state;
  }
}

// Context
const AdminContext = createContext<{
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
  actions: {
    fetchOrders: () => Promise<void>;
    fetchProducts: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
    fetchStats: () => Promise<void>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;
  };
} | undefined>(undefined);

// Provider
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Mock API functions (replace with real API calls)
  const mockAPI = {
    async fetchOrders(): Promise<Order[]> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: '1',
          numero: 'PED-001',
          cliente: {
            nome: 'Maria Silva',
            email: 'maria@email.com',
            telefone: '(11) 99999-9999',
            endereco: 'Rua A, 123 - São Paulo, SP'
          },
          produtos: [
            { id: '1', titulo: 'Aventuras Fantásticas', quantidade: 2, preco: 29.90 }
          ],
          total: 59.80,
          status: 'pendente',
          dataPedido: '2024-01-15T10:30:00Z',
          formaPagamento: 'Cartão de Crédito',
          frete: 10.00
        },
        // Add more mock orders...
      ];
    },

    async fetchProducts(): Promise<Product[]> {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        {
          id: '1',
          titulo: 'Aventuras Fantásticas',
          autor: 'João Silva',
          preco: 29.90,
          estoque: 15,
          status: 'ativo',
          categoria: 'Ficção',
          dataCriacao: '2024-01-15',
          vendas: 23
        },
        // Add more mock products...
      ];
    },

    async fetchNotifications(): Promise<Notification[]> {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [
        {
          id: '1',
          type: 'warning',
          message: 'Estoque baixo: "Mistério do Século"',
          time: '5 min atrás',
          read: false
        },
        // Add more notifications...
      ];
    },

    async fetchStats(): Promise<DashboardStats> {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return {
        totalRevenue: 12450.80,
        totalOrders: 1247,
        newCustomers: 89,
        conversionRate: 3.2,
        revenueChange: 12.5,
        ordersChange: 8.2,
        customersChange: 15.3,
        conversionChange: -2.1
      };
    }
  };

  // Actions
  const actions = {
    async fetchOrders() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const orders = await mockAPI.fetchOrders();
        dispatch({ type: 'SET_ORDERS', payload: orders });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar pedidos' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    async fetchProducts() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const products = await mockAPI.fetchProducts();
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar produtos' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    async fetchNotifications() {
      try {
        const notifications = await mockAPI.fetchNotifications();
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar notificações' });
      }
    },

    async fetchStats() {
      try {
        const stats = await mockAPI.fetchStats();
        dispatch({ type: 'SET_STATS', payload: stats });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar estatísticas' });
      }
    },

    async updateOrderStatus(id: string, status: Order['status']) {
      try {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
        // Here you would make the actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar status do pedido' });
      }
    },

    async deleteProduct(id: string) {
      try {
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
        // Here you would make the actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar produto' });
      }
    },

    async markNotificationRead(id: string) {
      try {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
        // Here you would make the actual API call
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao marcar notificação como lida' });
      }
    }
  };

  // Load initial data
  useEffect(() => {
    actions.fetchOrders();
    actions.fetchProducts();
    actions.fetchNotifications();
    actions.fetchStats();
  }, []);

  return (
    <AdminContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
