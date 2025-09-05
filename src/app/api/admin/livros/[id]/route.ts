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

// GET - Buscar livro por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do livro não fornecido'
        },
        { status: 400 }
      );
    }

    // Criar chave do cache
    const cacheKey = `livro:${id}`;

    // Verificar cache
    if (isCacheValid(cacheKey)) {
      const cached = cache.get(cacheKey);
      return NextResponse.json(cached.data);
    }

    const response = await fetch(`${BACKEND_API}/books/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Livro não encontrado'
          },
          { status: 404 }
        );
      }
      throw new Error(`Backend responded with ${response.status}`);
    }

    const backendData = await response.json();

    // Mapear dados do backend para o formato esperado pelo frontend
    const mappedData = {
      success: true,
      data: {
        id: backendData.data?.id?.toString() || id,
        titulo: backendData.data?.title || backendData.data?.titulo || '',
        autor: backendData.data?.author || backendData.data?.autor || '',
        descricao: backendData.data?.description || backendData.data?.descricao || '',
        preco: parseFloat(backendData.data?.price || backendData.data?.preco || 0),
        estoque: parseInt(backendData.data?.stock || backendData.data?.estoque || 0),
        categoria: backendData.data?.category || backendData.data?.categoria || '',
        isbn: backendData.data?.isbn || '',
        paginas: backendData.data?.pages || backendData.data?.paginas || '',
        editora: backendData.data?.publisher || backendData.data?.editora || '',
        anoPublicacao: backendData.data?.publicationYear || backendData.data?.anoPublicacao || '',
        idioma: backendData.data?.language || backendData.data?.idioma || 'Português',
        formato: backendData.data?.format || backendData.data?.formato || 'Físico',
        peso: backendData.data?.weight || backendData.data?.peso || '',
        dimensoes: backendData.data?.dimensions || backendData.data?.dimensoes || '',
        status: backendData.data?.status === 'active' ? 'ativo' : 'inativo',
        dataCriacao: backendData.data?.createdAt || backendData.data?.dataCriacao || new Date().toISOString(),
        vendas: parseInt(backendData.data?.sales || backendData.data?.vendas || 0),
        destaque: backendData.data?.featured || backendData.data?.destaque || false,
        novidade: backendData.data?.new || backendData.data?.novidade || false,
        promocao: backendData.data?.promotion || backendData.data?.promocao || false,
        imagemFront: backendData.data?.frontImage || backendData.data?.imagemFront || '',
        imagemBack: backendData.data?.backImage || backendData.data?.imagemBack || ''
      }
    };

    // Salvar no cache
    cache.set(cacheKey, {
      data: mappedData,
      timestamp: Date.now()
    });

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar livro',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar livro
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do livro não fornecido'
        },
        { status: 400 }
      );
    }

    // Validação básica
    if (!body.titulo || !body.autor || !body.preco) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados obrigatórios não fornecidos',
          message: 'Título, autor e preço são obrigatórios'
        },
        { status: 400 }
      );
    }

    // Obter token de autenticação do header da requisição
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_API}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify({
        title: body.titulo,
        author: body.autor,
        description: body.descricao,
        price: parseFloat(body.preco),
        stock: parseInt(body.estoque || 0),
        category: body.categoria,
        isbn: body.isbn,
        pages: body.paginas,
        publisher: body.editora,
        publicationYear: body.anoPublicacao,
        language: body.idioma,
        format: body.formato,
        weight: body.peso,
        dimensions: body.dimensoes,
        status: body.status === 'ativo' ? 'active' : 'inactive',
        featured: body.destaque || false,
        new: body.novidade || false,
        promotion: body.promocao || false,
        frontImage: body.imagemFront,
        backImage: body.imagemBack
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a livros
    for (const [key] of cache.entries()) {
      if (key.startsWith('livro:') || key.startsWith('livros:')) {
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do livro não fornecido'
        },
        { status: 400 }
      );
    }

    // Obter token de autenticação do header da requisição
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_API}/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a livros
    for (const [key] of cache.entries()) {
      if (key.startsWith('livro:') || key.startsWith('livros:')) {
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
