'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, RegisterData, LoginData } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (data: { senhaAtual: string; novaSenha: string; confirmarSenha: string }) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há uma sessão salva no localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      // Aguardar a hidratação do Next.js
      if (typeof window === 'undefined') {
        console.log('🔍 Aguardando hidratação...');
        return;
      }
      
      console.log('🔍 Inicializando autenticação...');
      await checkAuth();
    };
    
    // Executar imediatamente se já estamos no browser
    if (typeof window !== 'undefined') {
      initializeAuth();
    } else {
      // Aguardar hidratação
      const timer = setTimeout(initializeAuth, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Verificar se estamos no browser
      if (typeof window === 'undefined') {
        console.log('🔍 SSR detectado, aguardando hidratação...');
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      // Aguardar um pouco para garantir que o localStorage está disponível
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Primeiro, verificar se há dados no localStorage
      const userData = authService.getCurrentUser();
      const token = localStorage.getItem('auth_token');
      
      console.log('🔍 Verificando autenticação:', {
        hasUserData: !!userData,
        hasToken: !!token,
        userData: userData ? `${userData.nome} (${userData.email})` : 'null',
        token: token ? 'EXISTE' : 'NÃO EXISTE'
      });
      
      if (userData && token) {
        // Se há dados locais, definir usuário temporariamente
        setUser(userData);
        console.log('✅ Usuário definido temporariamente:', userData.nome);
        
        // Tentar verificar com o backend
        try {
          const response = await authService.checkAuth();
          
          if (response.success && response.data) {
            // Backend confirmou autenticação
            setUser(response.data);
            console.log('✅ Backend confirmou autenticação:', response.data.nome);
          } else {
            // Backend rejeitou, limpar dados
            console.log('❌ Backend rejeitou autenticação, limpando dados');
            setUser(null);
            localStorage.removeItem('user_data');
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          console.error('❌ Erro ao verificar com backend:', error);
          // Se der erro na verificação, manter dados locais por enquanto
          console.log('⚠️ Mantendo dados locais devido a erro de conexão');
        }
      } else {
        // Não há dados locais, verificar com backend
        console.log('📡 Verificando autenticação com backend...');
        try {
          const response = await authService.checkAuth();
          
          if (response.success && response.data) {
            setUser(response.data);
            console.log('✅ Backend retornou usuário:', response.data.nome);
          } else {
            setUser(null);
            console.log('❌ Nenhuma autenticação válida encontrada');
          }
        } catch (error) {
          console.error('❌ Erro ao verificar autenticação:', error);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('❌ Erro geral ao verificar autenticação:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authService.login({ email, senha: password });
      
      if (response.success && response.data) {
        // Definir usuário imediatamente
        setUser(response.data.user);
        
        // Verificar se os dados foram salvos corretamente
        const savedToken = localStorage.getItem('auth_token');
        
        console.log('Login bem-sucedido:', {
          user: response.data.user,
          hasToken: !!savedToken
        });
        
        return {
          success: true,
          message: response.data.message || 'Login realizado com sucesso!'
        };
      } else {
        return {
          success: false,
          message: response.error || 'Email ou senha incorretos'
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro interno. Tente novamente.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return {
          success: true,
          message: response.data.message || 'Cadastro realizado com sucesso!'
        };
      } else {
        return {
          success: false,
          message: response.error || 'Erro ao realizar cadastro'
        };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        message: 'Erro interno. Tente novamente.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setUser(null);
      // Limpar dados do localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authService.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data);
        return {
          success: true,
          message: 'Perfil atualizado com sucesso!'
        };
      } else {
        return {
          success: false,
          message: response.error || 'Erro ao atualizar perfil'
        };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        success: false,
        message: 'Erro interno. Tente novamente.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: { senhaAtual: string; novaSenha: string; confirmarSenha: string }): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authService.changePassword(data);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Senha alterada com sucesso!'
        };
      } else {
        return {
          success: false,
          message: response.error || 'Erro ao alterar senha'
        };
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return {
        success: false,
        message: 'Erro interno. Tente novamente.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
