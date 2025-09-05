'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  status: 'ativo' | 'inativo';
  dataCadastro: string;
  ultimaCompra?: string;
  totalCompras: number;
  valorTotalCompras: number;
}

export interface AdminState {
  orders: Order[];
  products: Product[];
  clients: Cliente[];
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
  rastreamento?: string;
}

export interface Product {
  id: string;
  titulo: string;
  autor: string;
  descricao?: string;
  preco: number;
  estoque: number;
  status: 'ativo' | 'inativo';
  categoria: string;
  dataCriacao: string;
  vendas: number;
  isbn?: string;
  paginas?: number;
  editora?: string;
  anoPublicacao?: number;
  idioma?: string;
  formato?: string;
  peso?: number;
  dimensoes?: string;
  destaque: boolean;
  novidade: boolean;
  promocao: boolean;
  imagemFront?: string;
  imagemBack?: string;
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
  vendas: {
    hoje: number;
    ontem: number;
    semana: number;
    mes: number;
    crescimento: number;
  };
  pedidos: {
    hoje: number;
    ontem: number;
    semana: number;
    mes: number;
    pendentes: number;
  };
  clientes: {
    total: number;
    ativos: number;
    novos: number;
    crescimento: number;
  };
  produtos: {
    total: number;
    estoqueBaixo: number;
    semEstoque: number;
    maisVendidos: Array<{
      titulo: string;
      vendas: number;
    }>;
  };
  vendasPorDia: Array<{
    dia: string;
    valor: number;
  }>;
  vendasPorCategoria: Array<{
    categoria: string;
    valor: number;
  }>;
}

// Actions
type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CLIENTS'; payload: Cliente[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

// Initial State
const initialState: AdminState = {
  orders: [],
  products: [],
  clients: [],
  notifications: [],
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    conversionRate: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    conversionChange: 0,
    vendas: {
      hoje: 0,
      ontem: 0,
      semana: 0,
      mes: 0,
      crescimento: 0
    },
    pedidos: {
      hoje: 0,
      ontem: 0,
      semana: 0,
      mes: 0,
      pendentes: 0
    },
    clientes: {
      total: 0,
      ativos: 0,
      novos: 0,
      crescimento: 0
    },
    produtos: {
      total: 0,
      estoqueBaixo: 0,
      semEstoque: 0,
      maisVendidos: []
    },
    vendasPorDia: [],
    vendasPorCategoria: []
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
    
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    
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
    
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
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
    fetchOrders: (filters?: any) => Promise<void>;
    fetchProducts: (filters?: any) => Promise<void>;
    fetchClients: (filters?: any) => Promise<void>;
    fetchNotifications: () => Promise<void>;
    fetchStats: (periodo?: string) => Promise<void>;
    updateOrderStatus: (id: string, status: Order['status'], rastreamento?: string, observacoes?: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;
    createProduct: (productData: Partial<Product>) => Promise<void>;
    updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
    createClient: (clientData: Partial<Cliente>) => Promise<void>;
    updateClient: (id: string, clientData: Partial<Cliente>) => Promise<void>;
    uploadImage: (file: File, tipo: 'front' | 'back') => Promise<{ url: string; fileName: string }>;
    deleteImage: (fileName: string) => Promise<void>;
  };
} | undefined>(undefined);

// Provider
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // API functions
  const api = {
    async fetchOrders(filters: any = {}): Promise<Order[]> {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/admin/vendas?${params}`);
      if (!response.ok) throw new Error('Erro ao buscar pedidos');
      
      const data = await response.json();
      return data.success ? data.data : [];
    },

    async fetchProducts(filters: any = {}): Promise<Product[]> {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/admin/livros?${params}`);
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      
      const data = await response.json();
      return data.success ? data.data : [];
    },

    async fetchStats(periodo: string = 'hoje'): Promise<DashboardStats> {
      const response = await fetch(`/api/admin/dashboard?periodo=${periodo}`);
      if (!response.ok) throw new Error('Erro ao buscar estatísticas');
      
      const data = await response.json();
      return data.data;
    },

    async updateOrderStatus(id: string, status: Order['status'], rastreamento?: string, observacoes?: string): Promise<void> {
      const response = await fetch('/api/admin/vendas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rastreamento, observacoes })
      });

      if (!response.ok) throw new Error('Erro ao atualizar status do pedido');
    },

    async deleteProduct(id: string): Promise<void> {
      const response = await fetch(`/api/admin/livros?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir produto');
    },

    async createProduct(productData: Partial<Product>): Promise<void> {
      const response = await fetch('/api/admin/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) throw new Error('Erro ao criar produto');
    },

    async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
      const response = await fetch('/api/admin/livros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...productData })
      });

      if (!response.ok) throw new Error('Erro ao atualizar produto');
    },

    async fetchClients(filters: any = {}): Promise<Cliente[]> {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/admin/clientes?${params}`);
      if (!response.ok) throw new Error('Erro ao buscar clientes');
      
      const data = await response.json();
      return data.success ? data.data : [];
    },

    async createClient(clientData: Partial<Cliente>): Promise<void> {
      const response = await fetch('/api/admin/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });

      if (!response.ok) throw new Error('Erro ao criar cliente');
    },

    async updateClient(id: string, clientData: Partial<Cliente>): Promise<void> {
      const response = await fetch('/api/admin/clientes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...clientData })
      });

      if (!response.ok) throw new Error('Erro ao atualizar cliente');
    },

    async deleteClient(id: string): Promise<void> {
      const response = await fetch(`/api/admin/clientes?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir cliente');
    },

    async uploadImage(file: File, tipo: 'front' | 'back'): Promise<{ url: string; fileName: string }> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', tipo);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erro ao fazer upload da imagem');
      
      const data = await response.json();
      return data.data;
    },

    async deleteImage(fileName: string): Promise<void> {
      const response = await fetch(`/api/admin/upload?fileName=${fileName}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao remover imagem');
    }
  };

  // Actions
  const actions = {
    async fetchOrders(filters?: any) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const orders = await api.fetchOrders(filters);
        dispatch({ type: 'SET_ORDERS', payload: orders });
      } catch (error) {
        console.error('❌ fetchOrders: Erro -', error);
        // Não disparar erro global, apenas log local
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    async fetchProducts(filters?: any) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const products = await api.fetchProducts(filters);
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      } catch (error) {
        console.error('❌ fetchProducts: Erro -', error);
        // Não disparar erro global, apenas log local
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    async fetchStats(periodo?: string) {
      try {
        const stats = await api.fetchStats(periodo);
        dispatch({ type: 'SET_STATS', payload: stats });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar estatísticas' });
      }
    },

    async updateOrderStatus(id: string, status: Order['status'], rastreamento?: string, observacoes?: string) {
      try {
        await api.updateOrderStatus(id, status, rastreamento, observacoes);
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar status do pedido' });
      }
    },

    async deleteProduct(id: string) {
      try {
        await api.deleteProduct(id);
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar produto' });
      }
    },

    async createProduct(productData: Partial<Product>) {
      try {
        await api.createProduct(productData);
        // Recarregar produtos após criar
        await actions.fetchProducts();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar produto' });
      }
    },

    async updateProduct(id: string, productData: Partial<Product>) {
      try {
        await api.updateProduct(id, productData);
        // Recarregar produtos após atualizar
        await actions.fetchProducts();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar produto' });
      }
    },

    async fetchClients(filters?: any) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const clients = await api.fetchClients(filters);
        dispatch({ type: 'SET_CLIENTS', payload: clients });
      } catch (error) {
        console.error('❌ fetchClients: Erro -', error);
        // Não disparar erro global, apenas log local
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    async createClient(clientData: Partial<Cliente>) {
      try {
        await api.createClient(clientData);
        // Recarregar clientes após criar
        await actions.fetchClients();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar cliente' });
      }
    },

    async updateClient(id: string, clientData: Partial<Cliente>) {
      try {
        await api.updateClient(id, clientData);
        // Recarregar clientes após atualizar
        await actions.fetchClients();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar cliente' });
      }
    },

    async deleteClient(id: string) {
      try {
        await api.deleteClient(id);
        dispatch({ type: 'DELETE_CLIENT', payload: id });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar cliente' });
      }
    },

    async uploadImage(file: File, tipo: 'front' | 'back') {
      try {
        return await api.uploadImage(file, tipo);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao fazer upload da imagem' });
        throw error;
      }
    },

    async deleteImage(fileName: string) {
      try {
        await api.deleteImage(fileName);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao remover imagem' });
      }
    },

    // Funções mockadas que ainda não foram implementadas
    async fetchNotifications() {
      // TODO: Implementar quando tivermos API de notificações
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          message: 'Estoque baixo: "Mistério do Século"',
          time: '5 min atrás',
          read: false
        }
      ];
      dispatch({ type: 'SET_NOTIFICATIONS', payload: mockNotifications });
    },

    async markNotificationRead(id: string) {
      // TODO: Implementar quando tivermos API de notificações
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    }
  };

  // Load initial data
  useEffect(() => {
    console.log('🚀 AdminContext useEffect: Iniciando carregamento de dados...');
    
    // Carregar dados em paralelo, não falhando completamente se algumas APIs falharem
    const loadData = async () => {
      console.log('📥 AdminContext: Iniciando carregamento paralelo...');
      
      try {
        // Carregar dados em paralelo
        const results = await Promise.allSettled([
          actions.fetchOrders(),
          actions.fetchProducts(),
          actions.fetchClients(),
          actions.fetchNotifications(),
          actions.fetchStats()
        ]);
        
        // Log dos resultados
        results.forEach((result, index) => {
          const actionNames = ['fetchOrders', 'fetchProducts', 'fetchClients', 'fetchNotifications', 'fetchStats'];
          if (result.status === 'fulfilled') {
            console.log(`✅ ${actionNames[index]}: Sucesso`);
          } else {
            console.log(`❌ ${actionNames[index]}: Falhou -`, result.reason);
          }
        });
        
        console.log('🏁 AdminContext: Carregamento paralelo finalizado');
      } catch (error) {
        console.error('💥 AdminContext: Erro geral no carregamento:', error);
      }
    };
    
    loadData();
  }, []); // Dependência vazia para executar apenas uma vez

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
