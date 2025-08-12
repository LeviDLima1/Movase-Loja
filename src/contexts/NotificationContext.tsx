'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Tipos de notificação
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: 'estoque' | 'vendas' | 'sistema' | 'pedidos';
  actionUrl?: string;
  actionText?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'CLOSE_PANEL' };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isOpen: false
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false
      };
      
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 50), // Limitar a 50 notificações
        unreadCount: state.unreadCount + 1
      };

    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0
      };

    case 'REMOVE_NOTIFICATION':
      const notification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: notification && !notification.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };

    case 'TOGGLE_PANEL':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'CLOSE_PANEL':
      return {
        ...state,
        isOpen: false
      };

    default:
      return state;
  }
}

interface NotificationContextType {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  togglePanel: () => void;
  closePanel: () => void;
  // Helpers para tipos específicos
  addSuccessNotification: (title: string, message: string) => void;
  addErrorNotification: (title: string, message: string) => void;
  addWarningNotification: (title: string, message: string) => void;
  addInfoNotification: (title: string, message: string) => void;
  // Notificações específicas do sistema
  addEstoqueNotification: (message: string, actionUrl?: string) => void;
  addVendaNotification: (message: string, actionUrl?: string) => void;
  addPedidoNotification: (message: string, actionUrl?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const togglePanel = () => {
    dispatch({ type: 'TOGGLE_PANEL' });
  };

  const closePanel = () => {
    dispatch({ type: 'CLOSE_PANEL' });
  };

  // Helpers para tipos específicos
  const addSuccessNotification = (title: string, message: string) => {
    addNotification({
      type: 'success',
      title,
      message,
      priority: 'low'
    });
  };

  const addErrorNotification = (title: string, message: string) => {
    addNotification({
      type: 'error',
      title,
      message,
      priority: 'high'
    });
  };

  const addWarningNotification = (title: string, message: string) => {
    addNotification({
      type: 'warning',
      title,
      message,
      priority: 'medium'
    });
  };

  const addInfoNotification = (title: string, message: string) => {
    addNotification({
      type: 'info',
      title,
      message,
      priority: 'low'
    });
  };

  // Notificações específicas do sistema
  const addEstoqueNotification = (message: string, actionUrl?: string) => {
    addNotification({
      type: 'warning',
      title: 'Alerta de Estoque',
      message,
      priority: 'medium',
      category: 'estoque',
      actionUrl,
      actionText: 'Ver Produtos'
    });
  };

  const addVendaNotification = (message: string, actionUrl?: string) => {
    addNotification({
      type: 'success',
      title: 'Nova Venda',
      message,
      priority: 'low',
      category: 'vendas',
      actionUrl,
      actionText: 'Ver Venda'
    });
  };

  const addPedidoNotification = (message: string, actionUrl?: string) => {
    addNotification({
      type: 'info',
      title: 'Novo Pedido',
      message,
      priority: 'medium',
      category: 'pedidos',
      actionUrl,
      actionText: 'Ver Pedido'
    });
  };

  // Simular notificações automáticas (em produção, isso viria de webhooks ou polling)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular alertas de estoque baixo
      if (Math.random() < 0.1) { // 10% de chance
        addEstoqueNotification(
          'Produto "Aventuras Fantásticas" está com estoque baixo (3 unidades)',
          '/admin/livros'
        );
      }

      // Simular novas vendas
      if (Math.random() < 0.15) { // 15% de chance
        addVendaNotification(
          'Nova venda realizada: R$ 89,90 - João Silva',
          '/admin/vendas'
        );
      }

      // Simular novos pedidos
      if (Math.random() < 0.08) { // 8% de chance
        addPedidoNotification(
          'Novo pedido recebido: #PED-001 - Maria Santos',
          '/admin/vendas'
        );
      }
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    state,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    togglePanel,
    closePanel,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
    addEstoqueNotification,
    addVendaNotification,
    addPedidoNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
