'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  aceiteNewsletter: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de usuários para demonstração
const mockUsers = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@movase.com',
    password: 'admin123',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999',
    endereco: {
      cep: '01001-000',
      logradouro: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP'
    },
    role: 'admin' as const,
    avatar: '/api/placeholder/40/40',
    aceiteNewsletter: true
  },
  {
    id: '2',
    name: 'Usuário Teste',
    email: 'user@movase.com',
    password: 'user123',
    cpf: '987.654.321-00',
    telefone: '(11) 88888-8888',
    endereco: {
      cep: '20001-000',
      logradouro: 'Avenida Rio Branco',
      numero: '456',
      complemento: '',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      uf: 'RJ'
    },
    role: 'user' as const,
    avatar: '/api/placeholder/40/40',
    aceiteNewsletter: false
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há uma sessão salva no localStorage
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Verificar se há token no localStorage
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        // Em produção, você validaria o token no servidor
        const user = JSON.parse(userData);
        setUser(user);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Limpar dados inválidos
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuário no mock
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return {
          success: false,
          message: 'Email ou senha incorretos'
        };
      }

      // Criar token mock (em produção seria JWT)
      const token = `mock_token_${foundUser.id}_${Date.now()}`;
      
      // Salvar dados no localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar
      }));

      // Atualizar estado
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar
      });

      return {
        success: true,
        message: 'Login realizado com sucesso!'
      };
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
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se email já existe
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Este email já está cadastrado'
        };
      }

      // Verificar se CPF já existe
      const existingCPF = mockUsers.find(u => u.cpf === userData.cpf);
      if (existingCPF) {
        return {
          success: false,
          message: 'Este CPF já está cadastrado'
        };
      }

      // Em produção, você salvaria no banco de dados
      // Por enquanto, vamos simular o cadastro
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        name: userData.nome,
        email: userData.email,
        password: userData.senha,
        cpf: userData.cpf,
        telefone: userData.telefone,
        endereco: userData.endereco,
        role: 'user' as const,
        avatar: '/api/placeholder/40/40',
        aceiteNewsletter: userData.aceiteNewsletter
      };

      // Adicionar ao mock (em produção seria no banco)
      mockUsers.push(newUser);

      return {
        success: true,
        message: 'Conta criada com sucesso!'
      };
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

  const logout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Limpar estado
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth
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
