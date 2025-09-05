import { NextRequest, NextResponse } from 'next/server';

// Conectar com o backend real
const BACKEND_API = 'http://localhost:3001/api';

// Cache simples para reduzir requisições
const cache = new Map();
const CACHE_DURATION = 30000; // 30 segundos

// Função para verificar se o cache é válido
function isCacheValid(key: string): boolean {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
}

// Função para limpar cache antigo
function cleanCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}

// GET - Listar todos os livros (com paginação e filtros)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
    const status = searchParams.get('status') || '';

    // Criar chave do cache
    const cacheKey = `livros:${page}:${limit}:${search}:${categoria}:${status}`;

    // Verificar cache
    if (isCacheValid(cacheKey)) {
      const cached = cache.get(cacheKey);
      return NextResponse.json(cached.data);
    }

    // Construir query params
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(categoria && { categoria }),
      ...(status && { status })
    });

    const response = await fetch(`${BACKEND_API}/books?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Salvar no cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    // Limpar cache antigo periodicamente
    if (Math.random() < 0.1) { // 10% de chance de limpar
      cleanCache();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar livros',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// POST - Criar novo livro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.titulo || !body.autor || !body.preco || !body.categoria) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados obrigatórios não fornecidos',
          message: 'Título, autor, preço e categoria são obrigatórios'
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_API}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: body.titulo,
        autor: body.autor,
        descricao: body.descricao || '',
        preco: parseFloat(body.preco),
        estoque: parseInt(body.estoque) || 0,
        categoria: body.categoria,
        isbn: body.isbn || '',
        paginas: body.paginas ? parseInt(body.paginas) : null,
        editora: body.editora || '',
        anoPublicacao: body.anoPublicacao ? parseInt(body.anoPublicacao) : null,
        idioma: body.idioma || 'Português',
        formato: body.formato || 'Físico',
        peso: body.peso ? parseFloat(body.peso) : null,
        dimensoes: body.dimensoes || '',
        status: body.status || 'ativo',
        destaque: body.destaque || false,
        novidade: body.novidade || false,
        promocao: body.promocao || false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a livros
    for (const [key] of cache.entries()) {
      if (key.startsWith('livros:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar livro',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar livro
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do livro não fornecido'
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_API}/books/${body.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: body.titulo,
        autor: body.autor,
        descricao: body.descricao,
        preco: parseFloat(body.preco),
        estoque: parseInt(body.estoque),
        categoria: body.categoria,
        isbn: body.isbn,
        paginas: body.paginas ? parseInt(body.paginas) : null,
        editora: body.editora,
        anoPublicacao: body.anoPublicacao ? parseInt(body.anoPublicacao) : null,
        idioma: body.idioma,
        formato: body.formato,
        peso: body.peso ? parseFloat(body.peso) : null,
        dimensoes: body.dimensoes,
        status: body.status,
        destaque: body.destaque,
        novidade: body.novidade,
        promocao: body.promocao
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a livros
    for (const [key] of cache.entries()) {
      if (key.startsWith('livros:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar livro',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// DELETE - Excluir livro
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do livro não fornecido'
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_API}/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a livros
    for (const [key] of cache.entries()) {
      if (key.startsWith('livros:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao excluir livro',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
