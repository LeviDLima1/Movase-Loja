'use client';

import { useState, useEffect, useCallback } from 'react';

// Interfaces
export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  editora: string;
  preco: number;
  precoOriginal: number;
  categoria: string;
  subcategoria: string;
  isbn: string;
  paginas: number;
  ano: number;
  sinopse: string;
  descricao: string;
  estoque: number;
  status: 'disponivel' | 'indisponivel' | 'esgotado';
  destaque: boolean;
  novidade: boolean;
  promocao: boolean;
  imagemFront: string;
  imagemBack: string;
  tags: string[];
  avaliacoes: number;
  totalAvaliacoes: number;
  vendas: number;
  createdAt: string;
  updatedAt: string;
}

export interface FiltrosLivros {
  q?: string;
  categoria?: string;
  subcategoria?: string;
  precoMin?: string;
  precoMax?: string;
  status?: string;
  ordenar?: string;
  destaque?: string;
  novidade?: string;
  promocao?: string;
  limit?: string;
  page?: string;
}

export interface Paginacao {
  page: number;
  limit: number;
  totalLivros: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FiltrosDisponiveis {
  categorias: string[];
  subcategorias: string[];
  precoMin: number;
  precoMax: number;
  totalEncontrados: number;
}

export interface ApiResponse {
  success: boolean;
  data: {
    livros: Livro[];
    paginacao: Paginacao;
    filtros: FiltrosDisponiveis;
  };
  error?: string;
}

// Hook principal
export function useLivros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [filtros, setFiltros] = useState<FiltrosLivros>({
    limit: '12',
    page: '1'
  });
  const [paginacao, setPaginacao] = useState<Paginacao | null>(null);
  const [filtrosDisponiveis, setFiltrosDisponiveis] = useState<FiltrosDisponiveis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar livros
  const buscarLivros = useCallback(async (novosFiltros?: Partial<FiltrosLivros>) => {
    try {
      setLoading(true);
      setError(null);

      // Combinar filtros existentes com novos
      const filtrosCombinados = { ...filtros, ...novosFiltros };
      
      // Construir URL com parâmetros
      const params = new URLSearchParams();
      Object.entries(filtrosCombinados).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const url = `/api/livros?${params.toString()}`;
      const response = await fetch(url);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setLivros(data.data.livros);
        setPaginacao(data.data.paginacao);
        setFiltrosDisponiveis(data.data.filtros);
        setFiltros(filtrosCombinados);
      } else {
        setError(data.error || 'Erro ao buscar livros');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Erro ao buscar livros:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Removida a dependência de filtros para evitar loop

  // Função para aplicar filtros
  const aplicarFiltros = useCallback((novosFiltros: Partial<FiltrosLivros>) => {
    const filtrosAtualizados = { ...filtros, ...novosFiltros, page: '1' };
    buscarLivros(filtrosAtualizados);
  }, [filtros, buscarLivros]);

  // Função para limpar filtros
  const limparFiltros = useCallback(() => {
    const filtrosLimpos = { limit: '12', page: '1' };
    buscarLivros(filtrosLimpos);
  }, [buscarLivros]);

  // Função para mudar página
  const mudarPagina = useCallback((novaPagina: number) => {
    buscarLivros({ page: novaPagina.toString() });
  }, [buscarLivros]);

  // Função para buscar por texto
  const buscarPorTexto = useCallback((termo: string) => {
    aplicarFiltros({ q: termo });
  }, [aplicarFiltros]);

  // Função para ordenar
  const ordenarPor = useCallback((ordenacao: string) => {
    aplicarFiltros({ ordenar: ordenacao });
  }, [aplicarFiltros]);

  // Função para filtrar por categoria
  const filtrarPorCategoria = useCallback((categoria: string) => {
    aplicarFiltros({ categoria });
  }, [aplicarFiltros]);

  // Função para filtrar por preço
  const filtrarPorPreco = useCallback((min: string, max: string) => {
    aplicarFiltros({ precoMin: min, precoMax: max });
  }, [aplicarFiltros]);

  // Função para filtrar por status
  const filtrarPorStatus = useCallback((status: string) => {
    aplicarFiltros({ status });
  }, [aplicarFiltros]);

  // Função para filtrar por destaque
  const filtrarPorDestaque = useCallback((destaque: boolean) => {
    aplicarFiltros({ destaque: destaque.toString() });
  }, [aplicarFiltros]);

  // Função para filtrar por novidade
  const filtrarPorNovidade = useCallback((novidade: boolean) => {
    aplicarFiltros({ novidade: novidade.toString() });
  }, [aplicarFiltros]);

  // Função para filtrar por promoção
  const filtrarPorPromocao = useCallback((promocao: boolean) => {
    aplicarFiltros({ promocao: promocao.toString() });
  }, [aplicarFiltros]);

  // Carregar livros na primeira renderização
  useEffect(() => {
    buscarLivros();
  }, []);

  return {
    // Estado
    livros,
    paginacao,
    filtrosDisponiveis,
    filtros,
    loading,
    error,
    
    // Ações
    buscarLivros,
    aplicarFiltros,
    limparFiltros,
    mudarPagina,
    buscarPorTexto,
    ordenarPor,
    filtrarPorCategoria,
    filtrarPorPreco,
    filtrarPorStatus,
    filtrarPorDestaque,
    filtrarPorNovidade,
    filtrarPorPromocao
  };
}
