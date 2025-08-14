"use client"

import { useEffect, useRef } from 'react';
import { X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  type = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Gerenciamento de foco e teclas
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (!modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTab);
      document.body.style.overflow = 'hidden';
      
      // Foca no modal quando abre
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-lg';
    }
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          icon: null,
          iconColor: '',
          bgColor: '',
          borderColor: ''
        };
    }
  };

  const typeConfig = getTypeConfig();
  const IconComponent = typeConfig.icon;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          className={`
            bg-white rounded-2xl shadow-2xl w-full
            transform transition-all duration-300 ease-out
            animate-in slide-in-from-bottom-4 zoom-in-95
            ${getSizeClasses()} ${className}
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={`
              flex items-center justify-between p-6 border-b border-gray-200
              ${typeConfig.bgColor} ${typeConfig.borderColor}
            `}>
              <div className="flex items-center gap-3">
                {IconComponent && (
                  <div className={`p-2 rounded-lg ${typeConfig.iconColor} bg-white/50`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                )}
                {title && (
                  <h2 
                    id="modal-title"
                    className="text-xl font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="
                    p-2 rounded-lg text-gray-400 hover:text-gray-600 
                    hover:bg-gray-100 transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                  "
                  aria-label="Fechar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

// Componente de confirmação rápida
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-gray-700 bg-gray-100 rounded-lg
              hover:bg-gray-200 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            "
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`
              px-4 py-2 text-white rounded-lg font-medium
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${type === 'error' 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : type === 'success'
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                : type === 'warning'
                ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                : type === 'info'
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
