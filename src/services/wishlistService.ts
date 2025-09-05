import { WishlistItem, WishlistResponse } from '../types/wishlist';

// Usar as rotas locais da API em vez do backend externo
const API_BASE = '';

export class WishlistService {
  private static async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WishlistResponse> {
    try {
      // Obter token de autenticação do localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      
      const response = await fetch(`${API_BASE}/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `Erro ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Erro na requisição da wishlist:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // Obter wishlist do usuário
  static async getWishlist(): Promise<WishlistResponse> {
    return this.makeRequest('/wishlist');
  }

  // Adicionar item à wishlist
  static async addItem(item: Omit<WishlistItem, 'dataAdicionado'>): Promise<WishlistResponse> {
    return this.makeRequest('/wishlist', {
      method: 'POST',
      body: JSON.stringify({
        bookId: item.id,
        titulo: item.titulo,
        autor: item.autor,
        preco: item.price,
        imagemFront: item.img1,
        categoria: item.categoria,
        isbn: item.isbn,
        editora: item.editora,
        anoPublicacao: item.anoPublicacao,
        promocao: item.promocao,
        novidade: item.novidade,
        destaque: item.destaque,
      }),
    });
  }

  // Remover item da wishlist
  static async removeItem(bookId: number): Promise<WishlistResponse> {
    return this.makeRequest(`/wishlist/${bookId}`, {
      method: 'DELETE',
    });
  }

  // Limpar wishlist
  static async clearWishlist(): Promise<WishlistResponse> {
    return this.makeRequest('/wishlist', {
      method: 'DELETE',
    });
  }

  // Verificar se item está na wishlist
  static async isInWishlist(bookId: number): Promise<boolean> {
    try {
      const response = await this.getWishlist();
      if (response.success && response.data?.items) {
        return response.data.items.some(item => item.id === bookId);
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar wishlist:', error);
      return false;
    }
  }
}

export const wishlistService = new WishlistService();
