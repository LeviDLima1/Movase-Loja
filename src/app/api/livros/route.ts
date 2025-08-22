import { NextRequest, NextResponse } from 'next/server';

// Conectar com o backend real
const BACKEND_API = 'http://localhost:3001/api';

// Interface para resposta do backend
interface BackendResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Interface para resposta paginada do backend
interface PaginatedBackendResponse<T> {
  success: boolean;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  error?: string;
}

// Função para fazer requisição ao backend
async function fetchFromBackend<T>(endpoint: string): Promise<BackendResponse<T> | PaginatedBackendResponse<T>> {
  try {
    const response = await fetch(`${BACKEND_API}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao conectar com backend:', error);
    return {
      success: false,
      error: 'Erro de conexão com o servidor'
    };
  }
}

// Função para buscar imagens do livro no banco
async function getBookImages(bookId: number): Promise<{ front?: string; back?: string }> {
  // Temporariamente usar URLs hardcoded para testar
  if (bookId === 1) {
    return {
      front: `${BACKEND_API}/images/1`,
      back: `${BACKEND_API}/images/2`
    };
  } else if (bookId === 2) {
    return {
      front: `${BACKEND_API}/images/3`,
      back: `${BACKEND_API}/images/4`
    };
  }
  
  return {};
}

// Interface para livro (compatível com frontend e backend)
interface Livro {
  id: number;
  titulo: string;
  autor: string;
  editora?: string;
  preco: number;
  precoOriginal?: number;
  categoria?: string;
  subcategoria?: string;
  isbn?: string;
  paginas?: number;
  ano?: number;
  sinopse?: string;
  descricao?: string;
  estoque: number;
  status: string;
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

// Função para mapear status do backend para frontend
function mapStatusToFrontend(status: string): string {
  switch (status) {
    case 'ativo':
      return 'disponivel';
    case 'inativo':
      return 'indisponivel';
    default:
      return status;
  }
}

// Interface para parâmetros de busca
interface SearchParams {
  q?: string; // termo de busca
  categoria?: string;
  subcategoria?: string;
  precoMin?: string;
  precoMax?: string;
  status?: string;
  ordenar?: string; // 'preco_asc', 'preco_desc', 'titulo_asc', 'titulo_desc', 'avaliacoes', 'vendas', 'novidade'
  destaque?: string;
  novidade?: string;
  promocao?: string;
  limit?: string;
  page?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Construir query string para o backend
    const backendParams = new URLSearchParams();
    
    // Mapear parâmetros do frontend para backend
    const frontendToBackend: { [key: string]: string } = {
      'q': 'search',
      'ordenar': 'sortBy'
    };
    
    // Adicionar parâmetros
    for (const [key, value] of searchParams.entries()) {
      if (value) {
        const backendKey = frontendToBackend[key] || key;
        backendParams.append(backendKey, value);
      }
    }
    
    // Construir endpoint
    const queryString = backendParams.toString();
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    
    console.log(`🔍 Fazendo requisição para: ${BACKEND_API}${endpoint}`);
    
    // Fazer requisição para o backend
    const backendResponse = await fetchFromBackend<Livro[]>(endpoint) as PaginatedBackendResponse<Livro>;
    
    if (!backendResponse.success) {
      console.error('❌ Erro do backend:', backendResponse.error);
      
      // Retornar erro mas com estrutura compatível
      return NextResponse.json({
        success: false,
        error: backendResponse.error || 'Erro ao buscar livros no servidor'
      }, { status: 500 });
    }
    
    // Mapear dados do backend para o formato esperado pelo frontend
    const livrosBackend = backendResponse.data || [];
    const livrosMapeados = await Promise.all(livrosBackend.map(async (livro: any) => {
      // Buscar imagens do livro no banco
      const bookImages = await getBookImages(livro.id);
      
      return {
        id: livro.id,
        titulo: livro.titulo,
        autor: livro.autor,
        editora: livro.editora,
        preco: parseFloat(livro.preco),
        precoOriginal: livro.precoOriginal ? parseFloat(livro.precoOriginal) : undefined,
        categoria: livro.categoria,
        subcategoria: livro.subcategoria,
        isbn: livro.isbn,
        paginas: livro.paginas,
        ano: livro.ano,
        sinopse: livro.sinopse,
        descricao: livro.descricao,
        estoque: livro.estoque,
        status: mapStatusToFrontend(livro.status),
        destaque: livro.destaque,
        novidade: livro.novidade,
        promocao: livro.promocao,
        // Usar imagens do banco de dados
        imagemFront: bookImages.front,
        imagemBack: bookImages.back,
        tags: livro.tags || [],
        avaliacoes: livro.avaliacoes ? parseFloat(livro.avaliacoes) : 0,
        totalAvaliacoes: livro.totalAvaliacoes || 0,
        vendas: livro.vendas || 0,
        createdAt: livro.createdAt,
        updatedAt: livro.updatedAt
      };
    }));
    
    // Usar dados de paginação do backend se disponível
    const paginacao = backendResponse.pagination || {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      total: livrosMapeados.length,
      totalPages: Math.ceil(livrosMapeados.length / parseInt(searchParams.get('limit') || '12')),
      hasNext: false,
      hasPrev: false
    };
    
    // Gerar estatísticas para filtros
    const categorias = [...new Set(livrosMapeados.map(livro => livro.categoria).filter(Boolean))];
    const subcategorias = [...new Set(livrosMapeados.map(livro => livro.subcategoria).filter(Boolean))];
    const precos = livrosMapeados.map(livro => livro.preco).filter(preco => preco > 0);
    const precoMin = precos.length > 0 ? Math.min(...precos) : 0;
    const precoMax = precos.length > 0 ? Math.max(...precos) : 0;
    
    console.log(`✅ Retornando ${livrosMapeados.length} livros do backend`);
    
    return NextResponse.json({
      success: true,
      data: {
        livros: livrosMapeados,
        paginacao: {
          page: paginacao.page,
          limit: paginacao.limit,
          totalLivros: paginacao.total,
          totalPages: paginacao.totalPages,
          hasNext: paginacao.hasNext,
          hasPrev: paginacao.hasPrev
        },
        filtros: {
          categorias,
          subcategorias,
          precoMin,
          precoMax,
          totalEncontrados: paginacao.total
        }
      }
    });

  } catch (error) {
    console.error('❌ Erro na API de livros:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

// POST para criar novo livro (futuro)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Aqui você implementaria a lógica para salvar no banco
    // Por enquanto, apenas retorna sucesso
    return NextResponse.json({
      success: true,
      message: 'Livro criado com sucesso',
      data: { id: Date.now(), ...body }
    });

  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar livro' 
      },
      { status: 500 }
    );
  }
}
