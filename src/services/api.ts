// ===== SERVIÇO DE API - Conexão com Backend =====

import { getEnvironmentConfig } from '@/config/environment';

// Configuração da API - Centralizada para migração fácil
const config = getEnvironmentConfig();
const API_BASE = config.api.backendUrl;
const API_TIMEOUT = config.api.timeout;

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  status?: number;
}

// Classe para gerenciar requisições HTTP
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Método genérico para fazer requisições
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      // Configurações padrão
      const defaultOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      // Adicionar token de autenticação se existir
      const token = this.getAuthToken();
      if (token) {
        defaultOptions.headers = {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        };
      }

      // Fazer requisição
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      // Processar resposta
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `Erro ${response.status}`,
          status: response.status,
        };
      }

      return {
        success: true,
        data,
        status: response.status,
      };

    } catch (error) {
      console.error('Erro na requisição API:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor',
        status: 0,
      };
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Gerenciamento de token
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Instância global do serviço de API
export const apiService = new ApiService(API_BASE);

// Exportar métodos diretos para facilitar uso
export const api = {
  get: apiService.get.bind(apiService),
  post: apiService.post.bind(apiService),
  put: apiService.put.bind(apiService),
  delete: apiService.delete.bind(apiService),
  patch: apiService.patch.bind(apiService),
  setToken: apiService.setAuthToken.bind(apiService),
  setAuthToken: apiService.setAuthToken.bind(apiService),
  removeToken: apiService.removeAuthToken.bind(apiService),
  isAuthenticated: apiService.isAuthenticated.bind(apiService),
};

export default apiService;
