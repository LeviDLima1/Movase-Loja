// ===== SERVIÇO DE AUTENTICAÇÃO - Conexão com Backend =====

import { api, ApiResponse } from './api';

// Tipos de usuário
export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  role: 'admin' | 'user';
  avatar?: string;
  emailVerificado?: boolean;
  telefoneVerificado?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para registro
export interface RegisterData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  aceiteNewsletter?: boolean;
}

// Tipos para login
export interface LoginData {
  email: string;
  senha: string;
}

// Tipos para resposta de autenticação
export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Tipos para mudança de senha
export interface ChangePasswordData {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

// Tipos para recuperação de senha
export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  novaSenha: string;
  confirmarSenha: string;
}

// Classe de serviço de autenticação
class AuthService {
  // Login
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<any>('/auth/login', {
        email: data.email,
        senha: data.senha
      });

      if (response.success && response.data && response.data.data) {
        const { user, token } = response.data.data;
        
        // Salvar token
        api.setToken(token);
        
        // Salvar dados do usuário
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(user));
        }
        
        return {
          success: true,
          data: { user, token, message: response.data.message }
        };
      }

      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: 'Erro interno no login'
      };
    }
  }

  // Registro
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<any>('/auth/register', data);

      if (response.success && response.data && response.data.data) {
        const { user, token } = response.data.data;
        
        // Salvar token
        api.setToken(token);
        
        // Salvar dados do usuário
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(user));
        }
        
        return {
          success: true,
          data: { user, token, message: response.data.message }
        };
      }

      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        error: 'Erro interno no registro'
      };
    }
  }

  // Logout
  async logout(): Promise<ApiResponse> {
    try {
      // Tentar chamar endpoint de logout no backend (opcional)
      try {
        await api.get('/auth/logout');
      } catch (error) {
        // Se falhar, não é crítico - o importante é limpar dados locais
        console.log('Logout do backend falhou, mas continuando...');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais (sempre fazer isso)
      api.removeToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
      }
    }

    return { success: true, message: 'Logout realizado com sucesso' };
  }

  // Verificar autenticação atual
  async checkAuth(): Promise<ApiResponse<User>> {
    try {
      if (!api.isAuthenticated()) {
        return {
          success: false,
          error: 'Não autenticado'
        };
      }

      const response = await api.get<any>('/auth/me');
      
      // Ajustar estrutura da resposta do backend
      if (response.success && response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data // O usuário está em response.data.data
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Se der erro, limpar dados inválidos
      api.removeToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
      }
      
      return {
        success: false,
        error: 'Sessão expirada'
      };
    }
  }

  // Obter usuário atual do localStorage
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData && userData !== 'null' && userData !== 'undefined') {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
          // Limpar dados corrompidos
          localStorage.removeItem('user_data');
          return null;
        }
      }
    }
    return null;
  }

  // Atualizar perfil
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<any>('/auth/profile', data);
      
      // Ajustar estrutura da resposta do backend
      if (response.success && response.data && response.data.data) {
        const userData = response.data.data;
        // Atualizar dados no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(userData));
        }
        
        return {
          success: true,
          data: userData
        };
      }

      return response;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        success: false,
        error: 'Erro ao atualizar perfil'
      };
    }
  }

  // Mudar senha
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/change-password', data);
      return response;
    } catch (error) {
      console.error('Erro ao mudar senha:', error);
      return {
        success: false,
        error: 'Erro ao mudar senha'
      };
    }
  }

  // Esqueci minha senha
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return {
        success: false,
        error: 'Erro ao solicitar recuperação de senha'
      };
    }
  }

  // Redefinir senha
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return {
        success: false,
        error: 'Erro ao redefinir senha'
      };
    }
  }

  // Verificar se email existe
  async checkEmail(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    try {
      const response = await api.get<{ exists: boolean }>(`/auth/check-email/${email}`);
      return response;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return {
        success: false,
        error: 'Erro ao verificar email'
      };
    }
  }

  // Verificar se telefone existe
  async checkPhone(telefone: string): Promise<ApiResponse<{ exists: boolean }>> {
    try {
      const response = await api.get<{ exists: boolean }>(`/auth/check-phone/${telefone}`);
      return response;
    } catch (error) {
      console.error('Erro ao verificar telefone:', error);
      return {
        success: false,
        error: 'Erro ao verificar telefone'
      };
    }
  }

  // Verificar se CPF existe
  async checkCPF(cpf: string): Promise<ApiResponse<{ exists: boolean }>> {
    try {
      const response = await api.get<{ exists: boolean }>(`/auth/check-cpf/${cpf}`);
      return response;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      return {
        success: false,
        error: 'Erro ao verificar CPF'
      };
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return api.isAuthenticated();
  }
}

// Instância global do serviço de autenticação
export const authService = new AuthService();

export default authService;
