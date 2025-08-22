// ===== SERVIÇO DE LIVROS - Conexão com Backend =====

import { api, ApiResponse } from './api';

// Tipos de livro
export interface Book {
  id: string;
  titulo: string;
  autor: string;
  editora: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  subcategoria?: string;
  isbn: string;
  paginas: number;
  ano: number;
  sinopse: string;
  descricao?: string;
  estoque: number;
  status: 'disponivel' | 'indisponivel' | 'esgotado';
  destaque: boolean;
  novidade: boolean;
  promocao: boolean;
  imagemFront?: string;
  imagemBack?: string;
  tags?: string[];
  avaliacoes?: number;
  totalAvaliacoes?: number;
  vendas?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para busca e filtros
export interface BookFilters {
  q?: string;
  categoria?: string;
  subcategoria?: string;
  precoMin?: number;
  precoMax?: number;
  status?: string;
  ordenar?: 'preco_asc' | 'preco_desc' | 'titulo_asc' | 'titulo_desc' | 'avaliacoes' | 'vendas' | 'novidade';
  destaque?: boolean;
  novidade?: boolean;
  promocao?: boolean;
  limit?: number;
  page?: number;
}

// Tipos para resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  paginacao: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filtros?: {
    categorias: string[];
    subcategorias: string[];
    precoMin: number;
    precoMax: number;
    totalEncontrados: number;
  };
}

// Tipos para avaliação
export interface BookRating {
  livroId: string;
  nota: number;
  comentario?: string;
}

// Classe de serviço de livros
class BookService {
  // Buscar todos os livros com filtros
  async getBooks(filters: BookFilters = {}): Promise<ApiResponse<PaginatedResponse<Book>>> {
    try {
      // Construir query string
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      const endpoint = queryString ? `/books?${queryString}` : '/books';
      
      const response = await api.get<PaginatedResponse<Book>>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      return {
        success: false,
        error: 'Erro ao buscar livros'
      };
    }
  }

  // Buscar livro por ID
  async getBookById(id: string): Promise<ApiResponse<Book>> {
    try {
      const response = await api.get<Book>(`/books/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      return {
        success: false,
        error: 'Erro ao buscar livro'
      };
    }
  }

  // Buscar livros por categoria
  async getBooksByCategory(categoria: string, filters: BookFilters = {}): Promise<ApiResponse<PaginatedResponse<Book>>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      const endpoint = queryString 
        ? `/books/category/${categoria}?${queryString}` 
        : `/books/category/${categoria}`;
      
      const response = await api.get<PaginatedResponse<Book>>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livros por categoria:', error);
      return {
        success: false,
        error: 'Erro ao buscar livros por categoria'
      };
    }
  }

  // Buscar livros por autor
  async getBooksByAuthor(autor: string, filters: BookFilters = {}): Promise<ApiResponse<PaginatedResponse<Book>>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      const endpoint = queryString 
        ? `/books/author/${autor}?${queryString}` 
        : `/books/author/${autor}`;
      
      const response = await api.get<PaginatedResponse<Book>>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livros por autor:', error);
      return {
        success: false,
        error: 'Erro ao buscar livros por autor'
      };
    }
  }

  // Buscar livros em destaque
  async getFeaturedBooks(limit: number = 10): Promise<ApiResponse<Book[]>> {
    try {
      const response = await api.get<Book[]>(`/books/featured?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livros em destaque:', error);
      return {
        success: false,
        error: 'Erro ao buscar livros em destaque'
      };
    }
  }

  // Buscar livros novos
  async getNewBooks(limit: number = 10): Promise<ApiResponse<Book[]>> {
    try {
      const response = await api.get<Book[]>(`/books/new?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livros novos:', error);
      return {
        success: false,
        error: 'Erro ao buscar livros novos'
      };
    }
  }

  // Buscar livros em promoção
  async getPromotionalBooks(limit: number = 10): Promise<ApiResponse<Book[]>> {
    try {
      const response = await api.get<Book[]>(`/books/promotional?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livros em promoção:', error);
      return {
        success: false,
        error: 'Erro ao buscar livros em promoção'
      };
    }
  }

  // Buscar livros similares
  async getSimilarBooks(bookId: string, limit: number = 5): Promise<ApiResponse<Book[]>> {
    try {
      const response = await api.get<Book[]>(`/books/similar/${bookId}?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livros similares:', error);
      return {
        success: false,
        error: 'Erro ao buscar livros similares'
      };
    }
  }

  // Buscar tags de livros
  async getBookTags(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get<string[]>('/books/search/tags');
      return response;
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      return {
        success: false,
        error: 'Erro ao buscar tags'
      };
    }
  }

  // Avaliar livro
  async rateBook(rating: BookRating): Promise<ApiResponse> {
    try {
      const response = await api.post(`/books/${rating.livroId}/rating`, {
        nota: rating.nota,
        comentario: rating.comentario
      });
      return response;
    } catch (error) {
      console.error('Erro ao avaliar livro:', error);
      return {
        success: false,
        error: 'Erro ao avaliar livro'
      };
    }
  }

  // Buscar estatísticas de livros
  async getBookStats(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/books/stats');
      return response;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        success: false,
        error: 'Erro ao buscar estatísticas'
      };
    }
  }

  // Buscar livro com associações (para admin)
  async getBookWithAssociations(id: string): Promise<ApiResponse<Book>> {
    try {
      const response = await api.get<Book>(`/books/${id}/with-associations`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livro com associações:', error);
      return {
        success: false,
        error: 'Erro ao buscar livro com associações'
      };
    }
  }

  // Buscar livros por critérios (para admin)
  async findBooksByCriteria(criteria: any): Promise<ApiResponse<PaginatedResponse<Book>>> {
    try {
      const response = await api.post<PaginatedResponse<Book>>('/books/find-by-criteria', criteria);
      return response;
    } catch (error) {
      console.error('Erro ao buscar livros por critérios:', error);
      return {
        success: false,
        error: 'Erro ao buscar livros por critérios'
      };
    }
  }

  // Contar livros
  async countBooks(filters: BookFilters = {}): Promise<ApiResponse<{ count: number }>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      const endpoint = queryString ? `/books/count?${queryString}` : '/books/count';
      
      const response = await api.get<{ count: number }>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao contar livros:', error);
      return {
        success: false,
        error: 'Erro ao contar livros'
      };
    }
  }
}

// Instância global do serviço de livros
export const bookService = new BookService();

export default bookService;
