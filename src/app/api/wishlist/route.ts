import { NextRequest, NextResponse } from 'next/server';
import { getEnvironmentConfig } from '@/config/environment';

// Conectar com o backend real - Configuração centralizada para migração fácil
const config = getEnvironmentConfig();
const BACKEND_API = config.api.backendUrl;

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

// GET - Obter wishlist do usuário
export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token de autenticação não fornecido',
          message: 'É necessário estar logado para acessar a wishlist'
        },
        { status: 401 }
      );
    }

    // Criar chave do cache
    const cacheKey = `wishlist:${authHeader}`;

    // Verificar cache
    if (isCacheValid(cacheKey)) {
      const cached = cache.get(cacheKey);
      return NextResponse.json(cached.data);
    }

    // Buscar wishlist do backend
    const response = await fetch(`${BACKEND_API}/wishlist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Wishlist vazia - retornar array vazio
        return NextResponse.json({
          success: true,
          data: { items: [] }
        });
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
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
    console.error('Erro ao buscar wishlist:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar wishlist',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// POST - Adicionar item à wishlist
export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token de autenticação não fornecido',
          message: 'É necessário estar logado para adicionar à wishlist'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validação básica
    if (!body.bookId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do livro é obrigatório',
          message: 'É necessário fornecer o ID do livro'
        },
        { status: 400 }
      );
    }

    // Adicionar item à wishlist no backend
    const response = await fetch(`${BACKEND_API}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        bookId: body.bookId,
        titulo: body.titulo,
        autor: body.autor,
        preco: body.preco,
        imagemFront: body.imagemFront,
        categoria: body.categoria,
        isbn: body.isbn,
        editora: body.editora,
        anoPublicacao: body.anoPublicacao,
        promocao: body.promocao,
        novidade: body.novidade,
        destaque: body.destaque,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado à wishlist
    for (const [key] of cache.entries()) {
      if (key.startsWith('wishlist:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao adicionar item à wishlist:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao adicionar item à wishlist',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// DELETE - Limpar wishlist
export async function DELETE(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token de autenticação não fornecido',
          message: 'É necessário estar logado para limpar a wishlist'
        },
        { status: 401 }
      );
    }

    // Limpar wishlist no backend
    const response = await fetch(`${BACKEND_API}/wishlist`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado à wishlist
    for (const [key] of cache.entries()) {
      if (key.startsWith('wishlist:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao limpar wishlist:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao limpar wishlist',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
