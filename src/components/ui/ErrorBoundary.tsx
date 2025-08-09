'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FaExclamationTriangle, FaRefresh, FaHome } from 'react-icons/fa';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Here you could log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Algo deu errado
            </h1>
            
            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex space-x-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center"
              >
                <FaRefresh className="w-4 h-4 mr-2" />
                Tentar Novamente
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer flex items-center justify-center"
              >
                <FaHome className="w-4 h-4 mr-2" />
                Ir para Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar em componentes funcionais
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}

// Componente de erro para formulários
export function FormError({ error, className = '' }: { error?: string; className?: string }) {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center">
        <FaExclamationTriangle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
        <p className="text-sm text-red-800">{error}</p>
      </div>
    </div>
  );
}

// Componente de erro para listas vazias
export function EmptyState({ 
  title, 
  description, 
  action, 
  icon: Icon,
  className = '' 
}: { 
  title: string; 
  description: string; 
  action?: ReactNode; 
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400" />}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
