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

// Interface para cliente
interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  status: 'ativo' | 'inativo';
  dataCadastro: string;
  ultimaCompra?: string;
  totalCompras: number;
  valorTotalCompras: number;
  createdAt?: string;
  updatedAt?: string;
}

// GET - Listar todos os clientes (com paginação e filtros)
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
    const cacheKey = `clientes:${page}:${limit}:${search}:${status}:${dataInicio}:${dataFim}`;

    // Verificar cache
    if (isCacheValid(cacheKey)) {
      const cached = cache.get(cacheKey);
      return NextResponse.json(cached.data);
    }

    // Construir query params
    const params = new URLSearchParams({
      page,
      limit,
      include: 'addresses,purchases', // Incluir relacionamentos
      ...(search && { search }),
      ...(status && { status }),
      ...(dataInicio && { dataInicio }),
      ...(dataFim && { dataFim })
    });

    // Obter token de autenticação do header da requisição
    const authHeader = request.headers.get('authorization');
    
    // Para teste, vamos usar um token temporário ou pular autenticação
    // TODO: Implementar autenticação adequada
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Se tiver token, usar; senão, pular autenticação para teste
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Fazer requisição para o backend (rota pública temporária)
    const response = await fetch(`${BACKEND_API}/admin/users?${params}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const backendData = await response.json();

    // Mapear dados do backend para o formato esperado pelo frontend
    const mappedData = {
      success: true,
      data: backendData.data?.map((user: any) => ({
        id: user.id.toString(),
        nome: user.name || user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        cpf: user.CPF || user.cpf || '',
        dataNascimento: user.dataNascimento || user.birthDate || null,
        endereco: {
          cep: user.addresses?.[0]?.cep || '',
          logradouro: user.addresses?.[0]?.logradouro || '',
          numero: user.addresses?.[0]?.numero || '',
          complemento: user.addresses?.[0]?.complemento || '',
          bairro: user.addresses?.[0]?.bairro || '',
          cidade: user.addresses?.[0]?.cidade || '',
          estado: user.addresses?.[0]?.uf || user.addresses?.[0]?.estado || ''
        },
        status: user.status === 'active' ? 'ativo' : 'inativo',
        dataCadastro: user.createdAt || user.dataCadastro || new Date().toISOString(),
        ultimaCompra: user.purchases?.[0]?.createdAt || null,
        totalCompras: user.purchases?.length || 0,
        valorTotalCompras: user.purchases?.reduce((sum: number, purchase: any) => sum + (purchase.total || 0), 0) || 0
      })) || [],
      pagination: backendData.pagination || {
        page: parseInt(page),
        limit: parseInt(limit),
        total: backendData.total || 0,
        totalPages: Math.ceil((backendData.total || 0) / parseInt(limit))
      }
    };

    // Salvar no cache
    cache.set(cacheKey, {
      data: mappedData,
      timestamp: Date.now()
    });

    // Limpar cache antigo periodicamente
    if (Math.random() < 0.1) { // 10% de chance de limpar
      cleanCache();
    }

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar clientes',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// POST - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.nome || !body.email || !body.telefone || !body.cpf) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados obrigatórios não fornecidos',
          message: 'Nome, email, telefone e CPF são obrigatórios'
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email inválido'
        },
        { status: 400 }
      );
    }

    // Validar CPF (formato básico)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(body.cpf)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'CPF inválido. Use o formato: 000.000.000-00'
        },
        { status: 400 }
      );
    }

    // Obter token de autenticação do header da requisição
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_API}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify({
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        cpf: body.cpf,
        dataNascimento: body.dataNascimento || null,
        endereco: {
          cep: body.endereco?.cep || '',
          logradouro: body.endereco?.logradouro || '',
          numero: body.endereco?.numero || '',
          complemento: body.endereco?.complemento || '',
          bairro: body.endereco?.bairro || '',
          cidade: body.endereco?.cidade || '',
          estado: body.endereco?.estado || ''
        },
        status: body.status || 'ativo'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a clientes
    for (const [key] of cache.entries()) {
      if (key.startsWith('clientes:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar cliente',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar cliente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do cliente não fornecido'
        },
        { status: 400 }
      );
    }

    // Validar formato de email se fornecido
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Email inválido'
          },
          { status: 400 }
        );
      }
    }

    // Validar CPF se fornecido
    if (body.cpf) {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(body.cpf)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'CPF inválido. Use o formato: 000.000.000-00'
          },
          { status: 400 }
        );
      }
    }

    // Obter token de autenticação do header da requisição
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_API}/users/${body.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify({
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        cpf: body.cpf,
        dataNascimento: body.dataNascimento,
        endereco: body.endereco,
        status: body.status
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend responded with ${response.status}`);
    }

    const data = await response.json();

    // Limpar cache relacionado a clientes
    for (const [key] of cache.entries()) {
      if (key.startsWith('clientes:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar cliente',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// DELETE - Excluir cliente
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do cliente não fornecido'
        },
        { status: 400 }
      );
    }

    // Obter token de autenticação do header da requisição
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_API}/users/${id}`, {
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

    // Limpar cache relacionado a clientes
    for (const [key] of cache.entries()) {
      if (key.startsWith('clientes:')) {
        cache.delete(key);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao excluir cliente',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
