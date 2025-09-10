/**
 * CART SERVICE - Novo Serviço do Carrinho (Frontend)
 * 
 * Integração com a nova API de carrinho:
 * - Endpoints padronizados
 * - Tratamento de erros
 * - Tipos TypeScript
 * - Validação de dados
 */

import { apiService } from './api';

// ===== TIPOS =====

export interface CartItem {
  id: number;
  bookId: number;
  quantidade: number;
  preco: number;
  subtotal: number;
  titulo: string;
  autor: string;
  imagemFront: string;
  adicionadoEm: string;
  book?: {
    id: number;
    titulo: string;
    autor: string;
    preco: number;
    estoque: number;
    imagemFront: string;
    imagemBack: string;
  };
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  frete: number;
  desconto: number;
  total: number;
  cupomCodigo?: string;
  cupomDesconto?: number;
  enderecoEntrega?: any;
  freteSelecionado?: any;
  status: string;
  itemCount: number;
  ultimaAtualizacao: string;
  expiraEm: string;
}

export interface AddItemData {
  bookId: number;
  quantity: number;
}

export interface UpdateQuantityData {
  bookId: number;
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ===== SERVIÇO =====

class CartServiceNew {
  private baseUrl = '/cart-new';

  /**
   * Obter carrinho do usuário
   */
  async getCart(): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.get<any>(this.baseUrl);
      
      if (response.success && response.data && response.data.cart) {
        return {
          success: true,
          data: response.data.cart
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      return {
        success: false,
        error: 'Erro ao buscar carrinho'
      };
    }
  }

  /**
   * Adicionar item ao carrinho
   */
  async addItem(data: AddItemData): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.post<any>(`${this.baseUrl}/items`, data);
      
      if (response.success && response.data && response.data.cart) {
        return {
          success: true,
          data: response.data.cart
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      return {
        success: false,
        error: 'Erro ao adicionar item ao carrinho'
      };
    }
  }

  /**
   * Atualizar quantidade de item
   */
  async updateQuantity(data: UpdateQuantityData): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.put<any>(`${this.baseUrl}/items`, data);
      
      if (response.success && response.data && response.data.cart) {
        return {
          success: true,
          data: response.data.cart
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      return {
        success: false,
        error: 'Erro ao atualizar quantidade'
      };
    }
  }

  /**
   * Remover item do carrinho
   */
  async removeItem(bookId: number): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.delete<any>(`${this.baseUrl}/items/${bookId}`);
      
      if (response.success && response.data && response.data.cart) {
        return {
          success: true,
          data: response.data.cart
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao remover item:', error);
      return {
        success: false,
        error: 'Erro ao remover item do carrinho'
      };
    }
  }

  /**
   * Limpar carrinho
   */
  async clearCart(): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.delete<any>(this.baseUrl);
      
      if (response.success && response.data && response.data.cart) {
        return {
          success: true,
          data: response.data.cart
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      return {
        success: false,
        error: 'Erro ao limpar carrinho'
      };
    }
  }

  /**
   * Validar carrinho
   */
  async validateCart(): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.post<any>(`${this.baseUrl}/validate`);
      
      if (response.success && response.data && response.data.validation) {
        return {
          success: true,
          data: response.data.validation
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao validar carrinho:', error);
      return {
        success: false,
        error: 'Erro ao validar carrinho'
      };
    }
  }
}

export const cartServiceNew = new CartServiceNew();
export default cartServiceNew;
