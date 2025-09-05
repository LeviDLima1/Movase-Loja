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

// GET - Listar todas as vendas (com paginação e filtros)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const dataInicio = searchParams.get('dataInicio') || '';
    const dataFim = searchParams.get('dataFim') || '';

    // Criar chave do cache
    const cacheKey = `vendas:${page}:${limit}:${search}:${status}:${dataInicio}:${dataFim}`;

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
      ...(status && { status }),
      ...(dataInicio && { dataInicio }),
      ...(dataFim && { dataFim })
    });

    const response = await fetch(`${BACKEND_API}/purchases?${params}`, {
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
    console.error('Erro ao buscar vendas:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar vendas',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar status da venda
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id || !body.status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID e status da venda são obrigatórios'
        },
        { status: 400 }
      );
    }

    // Validar status
    const statusValidos = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    if (!statusValidos.includes(body.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Status inválido',
          message: 'Status deve ser: pendente, confirmado, enviado, entregue ou cancelado'
        },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: body.status
    };

    // Adicionar data específica baseada no status
    const now = new Date().toISOString();
    switch (body.status) {
      case 'confirmado':
        updateData.dataPagamento = now;
        break;
      case 'enviado':
        updateData.dataEnvio = now;
        updateData.rastreamento = body.rastreamento || '';
        break;
      case 'entregue':
        updateData.dataEntrega = now;
        break;
    }

    // Adicionar observações se fornecidas
    if (body.observacoes) {
      updateData.observacoes = body.observacoes;
    }

    const response = await fetch(`${BACKEND_API}/purchases/${body.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a vendas
    for (const [key] of cache.entries()) {
      if (key.startsWith('vendas:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar venda:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar venda',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// POST - Criar nova venda (manual)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.cliente || !body.produtos || body.produtos.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados obrigatórios não fornecidos',
          message: 'Cliente e produtos são obrigatórios'
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_API}/purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: body.userId,
        cliente: body.cliente,
        produtos: body.produtos,
        total: body.total,
        frete: body.frete || 0,
        status: body.status || 'pendente',
        formaPagamento: body.formaPagamento || 'Pendente',
        observacoes: body.observacoes || ''
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a vendas
    for (const [key] of cache.entries()) {
      if (key.startsWith('vendas:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar venda',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
