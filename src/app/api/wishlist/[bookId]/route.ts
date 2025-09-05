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

// DELETE - Remover item específico da wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    // Verificar se o usuário está autenticado
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token de autenticação não fornecido',
          message: 'É necessário estar logado para remover da wishlist'
        },
        { status: 401 }
      );
    }
    
    // Validação básica
    if (!bookId || isNaN(Number(bookId))) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do livro inválido',
          message: 'É necessário fornecer um ID válido do livro'
        },
        { status: 400 }
      );
    }

    // Remover item da wishlist no backend
    const response = await fetch(`${BACKEND_API}/wishlist/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Item não encontrado na wishlist',
            message: 'O item não está na sua wishlist'
          },
          { status: 404 }
        );
      }
      
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
    console.error('Erro ao remover item da wishlist:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao remover item da wishlist',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
