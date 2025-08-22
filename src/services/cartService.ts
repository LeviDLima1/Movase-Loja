// ===== SERVIÇO DE CARRINHO - Conexão com Backend =====

import { apiService } from './api';

// Interfaces
export interface CartItem {
  bookId: number;
  quantity: number;
  preco: number;
  subtotal: number;
  titulo: string;
  autor: string;
  imagemFront?: string;
  book?: {
    id: number;
    titulo: string;
    autor: string;
    preco: number;
    estoque: number;
    imagemFront?: string;
    imagemBack?: string;
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

class CartService {
  private baseUrl = '/cart';

  /**
   * Obter carrinho do usuário
   */
  async getCart(): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.get<any>(this.baseUrl);
      
      // Ajustar estrutura da resposta do backend
      if (response.success && response.data && response.data.data && response.data.data.cart) {
        return {
          success: true,
          data: response.data.data.cart
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
      
      // Ajustar estrutura da resposta do backend
      if (response.success && response.data && response.data.data && response.data.data.cart) {
        return {
          success: true,
          data: response.data.data.cart
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
      
      // Ajustar estrutura da resposta do backend
      if (response.success && response.data && response.data.data && response.data.data.cart) {
        return {
          success: true,
          data: response.data.data.cart
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
      
      // Ajustar estrutura da resposta do backend
      if (response.success && response.data && response.data.data && response.data.data.cart) {
        return {
          success: true,
          data: response.data.data.cart
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
      
      // Ajustar estrutura da resposta do backend
      if (response.success && response.data && response.data.data && response.data.data.cart) {
        return {
          success: true,
          data: response.data.data.cart
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
   * Formatar preço
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  /**
   * Calcular total de itens
   */
  getItemCount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Verificar se carrinho está vazio
   */
  isEmpty(items: CartItem[]): boolean {
    return items.length === 0;
  }
}

export const cartService = new CartService();
export default cartService;
