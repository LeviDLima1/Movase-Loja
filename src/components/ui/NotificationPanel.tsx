'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FaBell, 
  FaTimes, 
  FaCheck, 
  FaTrash, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaShoppingCart,
  FaFileAlt
} from 'react-icons/fa';
import { useNotifications, Notification, NotificationType } from '@/contexts/NotificationContext';
import { formatRelativeTime, cn } from '@/lib/utils';

const getNotificationIcon = (type: NotificationType, category?: string) => {
  if (category === 'estoque') return FaBox;
  if (category === 'vendas') return FaShoppingCart;
  if (category === 'pedidos') return FaFileAlt;
  
  switch (type) {
    case 'success':
      return FaCheckCircle;
    case 'error':
      return FaTimesCircle;
    case 'warning':
      return FaExclamationTriangle;
    case 'info':
      return FaInfoCircle;
    default:
      return FaInfoCircle;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export default function NotificationPanel() {
  const { state, markAsRead, markAllAsRead, removeNotification, clearAll, togglePanel, closePanel } = useNotifications();
  const { notifications, unreadCount, isOpen } = state;
  const panelRef = useRef<HTMLDivElement>(null);

  // Fechar painel ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        closePanel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closePanel]);

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closePanel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closePanel]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      closePanel();
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={togglePanel}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        <FaBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-[60]">
          <div ref={panelRef}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <button
                  onClick={closePanel}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <FaBell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma notificação</p>
                </div>
              ) : (
                <div>
                  {/* Notificações não lidas */}
                  {unreadNotifications.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700">
                          Não lidas ({unreadNotifications.length})
                        </h4>
                      </div>
                      {unreadNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onClick={() => handleNotificationClick(notification)}
                          onMarkAsRead={() => markAsRead(notification.id)}
                          onRemove={() => removeNotification(notification.id)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Notificações lidas */}
                  {readNotifications.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700">
                          Lidas ({readNotifications.length})
                        </h4>
                      </div>
                      {readNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onClick={() => handleNotificationClick(notification)}
                          onMarkAsRead={() => markAsRead(notification.id)}
                          onRemove={() => removeNotification(notification.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {notifications.length} notificação{notifications.length !== 1 ? 'es' : ''}
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                  >
                    Limpar todas
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  onMarkAsRead: () => void;
  onRemove: () => void;
}

function NotificationItem({ notification, onClick, onMarkAsRead, onRemove }: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type, notification.category);

  return (
    <div
      className={cn(
        'p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
        !notification.read && 'bg-blue-50'
      )}
    >
      <div className="flex items-start space-x-3">
        {/* Ícone */}
        <div className="flex-shrink-0">
          <div className={cn(
            'p-2 rounded-full',
            getNotificationColor(notification.type)
          )}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h4>
                {!notification.read && (
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    getPriorityColor(notification.priority)
                  )} />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {notification.message}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(notification.timestamp)}
                </span>
                {notification.actionUrl && (
                  <Link
                    href={notification.actionUrl}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {notification.actionText || 'Ver detalhes'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex-shrink-0 flex items-center space-x-1">
          {!notification.read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors cursor-pointer"
              title="Marcar como lida"
            >
              <FaCheck className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            title="Remover"
          >
            <FaTrash className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
