import { api, ApiResponse } from './api';
import { CartItem } from '../types/cart';

// Tipos para o checkout
export interface CheckoutData {
  userId: number;
  addressId: number;
  items: {
    bookId: number;
    quantidade: number;
    desconto?: number;
  }[];
  formaPagamento: 'pix' | 'credit_card' | 'boleto';
  parcelas?: number;
  observacoes?: string;
  frete?: number;
}

export interface PurchaseResponse {
  id: number;
  numero: string;
  userId: number;
  addressId: number;
  subtotal: number;
  frete: number;
  total: number;
  formaPagamento: string;
  parcelas: number;
  status: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  address: {
    id: number;
    cep: string;
    logradouro: string;
    numero: string;
    cidade: string;
    uf: string;
  };
  items: {
    id: number;
    purchaseId: number;
    bookId: number;
    quantidade: number;
    precoUnitario: number;
    precoTotal: number;
    desconto: number;
    precoFinal: number;
    book: {
      id: number;
      titulo: string;
      autor: string;
      imagemFront: string;
    };
  }[];
}

class CheckoutService {
  private baseUrl = '/purchases';

  /**
   * Criar nova compra
   */
  async createPurchase(data: CheckoutData): Promise<ApiResponse<PurchaseResponse>> {
    try {
      const response = await api.post<PurchaseResponse>(this.baseUrl, data);
      return response;
    } catch (error) {
      console.error('Erro ao criar compra:', error);
      return {
        success: false,
        message: 'Erro ao processar compra',
        data: {} as PurchaseResponse
      };
    }
  }

  /**
   * Buscar compras do usuário
   */
  async getUserPurchases(page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<PurchaseResponse[]>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await api.get<PurchaseResponse[]>(`${this.baseUrl}/my?${params}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
      return {
        success: false,
        message: 'Erro ao buscar compras',
        data: []
      };
    }
  }

  /**
   * Buscar compra por ID
   */
  async getPurchaseById(id: number): Promise<ApiResponse<PurchaseResponse>> {
    try {
      const response = await api.get<PurchaseResponse>(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar compra:', error);
      return {
        success: false,
        message: 'Erro ao buscar compra',
        data: {} as PurchaseResponse
      };
    }
  }

  /**
   * Converter itens do carrinho para formato do backend
   */
  convertCartItemsToPurchaseItems(cartItems: CartItem[]): CheckoutData['items'] {
    return cartItems.map(item => ({
      bookId: item.id,
      quantidade: item.quantity,
      desconto: 0 // Por enquanto sem desconto
    }));
  }

  /**
   * Calcular totais da compra
   */
  calculateTotals(cartItems: CartItem[], frete: number = 0): {
    subtotal: number;
    frete: number;
    total: number;
  } {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + frete;

    return {
      subtotal,
      frete,
      total
    };
  }
}

export const checkoutService = new CheckoutService();
