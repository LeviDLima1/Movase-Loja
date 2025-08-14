'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authConfig } from '@/config/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  fallback = null 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se a proteção está desabilitada, permitir acesso
    if (authConfig.disableRouteProtection) {
      return;
    }

    // Aguardar carregamento da autenticação
    if (isLoading) {
      return;
    }

    // Se não está autenticado, redirecionar para login
    if (!isAuthenticated) {
      router.push(authConfig.redirects.login);
      return;
    }

    // Se precisa de role específico e usuário não tem
    if (requiredRole === 'admin' && user?.role !== 'admin') {
      router.push(authConfig.redirects.home);
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  // Se a proteção está desabilitada, mostrar conteúdo
  if (authConfig.disableRouteProtection) {
    return <>{children}</>;
  }

  // Se está carregando, mostrar fallback ou loading
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Se não está autenticado, mostrar fallback
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  // Se precisa de role admin e usuário não é admin
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa ser administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }

  // Se passou por todas as verificações, mostrar conteúdo
  return <>{children}</>;
}
