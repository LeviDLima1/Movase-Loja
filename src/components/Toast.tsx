"use client"

import { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle, 
  X,
  Check,
  Clock
} from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
  title?: string;
}

export default function Toast({ 
  message, 
  type, 
  duration = 4000, 
  onClose, 
  title 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animação de entrada
    const enterTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - (100 / (duration / 50)); // Atualiza a cada 50ms
      });
    }, 50);

    // Auto close
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          progressColor: 'bg-green-500',
          title: title || 'Sucesso!'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          progressColor: 'bg-red-500',
          title: title || 'Erro!'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          progressColor: 'bg-yellow-500',
          title: title || 'Atenção!'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          progressColor: 'bg-blue-500',
          title: title || 'Informação'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          progressColor: 'bg-gray-500',
          title: title || 'Notificação'
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 w-96 max-w-sm
        transform transition-all duration-300 ease-out
        ${isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      {/* Toast Container */}
      <div className={`
        relative overflow-hidden
        ${config.bgColor} ${config.borderColor}
        border rounded-xl shadow-lg
        backdrop-blur-sm
      `}>
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className={`h-full ${config.progressColor} transition-all duration-50 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 p-1.5 rounded-lg ${config.iconColor} bg-white/50`}>
              <IconComponent className="h-5 w-5" />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${config.textColor} mb-1`}>
                    {config.title}
                  </h4>
                  <p className={`text-sm ${config.textColor} leading-relaxed`}>
                    {message}
                  </p>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className={`
                    flex-shrink-0 p-1 rounded-lg
                    ${config.textColor} hover:bg-white/50
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                    focus:ring-current
                  `}
                  aria-label="Fechar notificação"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (opcional) */}
        {type === 'error' && (
          <div className="px-4 pb-3 flex gap-2">
            <button
              onClick={handleClose}
              className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={handleClose}
              className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              Ignorar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
