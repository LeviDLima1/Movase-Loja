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

// Interface para estatísticas do dashboard
interface DashboardStats {
  vendas: {
    hoje: number;
    ontem: number;
    semana: number;
    mes: number;
    crescimento: number;
  };
  pedidos: {
    hoje: number;
    ontem: number;
    semana: number;
    mes: number;
    pendentes: number;
  };
  clientes: {
    total: number;
    ativos: number;
    novos: number;
    crescimento: number;
  };
  produtos: {
    total: number;
    estoqueBaixo: number;
    semEstoque: number;
    maisVendidos: Array<{
      titulo: string;
      vendas: number;
    }>;
  };
  vendasPorDia: Array<{
    dia: string;
    valor: number;
  }>;
  vendasPorCategoria: Array<{
    categoria: string;
    valor: number;
  }>;
}

// GET - Buscar estatísticas do dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'hoje';

    // Criar chave do cache
    const cacheKey = `dashboard:${periodo}`;

    // Verificar cache
    if (isCacheValid(cacheKey)) {
      const cached = cache.get(cacheKey);
      return NextResponse.json(cached.data);
    }

    // Buscar dados do backend usando rotas que existem
    const [vendasResponse, pedidosResponse, clientesResponse, produtosResponse] = await Promise.allSettled([
      fetch(`${BACKEND_API}/purchases`),
      fetch(`${BACKEND_API}/purchases`),
      fetch(`${BACKEND_API}/users`),
      fetch(`${BACKEND_API}/books`)
    ]);

    // Processar respostas e extrair dados
    let vendasData = { hoje: 0, ontem: 0, semana: 0, mes: 0, porDia: [], porCategoria: [] };
    let pedidosData = { hoje: 0, ontem: 0, semana: 0, mes: 0, pendentes: 0 };
    let clientesData = { total: 0, ativos: 0, novos: 0, novosAnterior: 0 };
    let produtosData = { total: 0, estoqueBaixo: 0, semEstoque: 0, maisVendidos: [] };

    // Processar vendas
    if (vendasResponse.status === 'fulfilled' && vendasResponse.value.ok) {
      try {
        const vendas = await vendasResponse.value.json();
        const hoje = new Date();
        const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
        const semanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        const mesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);

        vendasData = {
          hoje: vendas.data?.filter((v: any) => new Date(v.createdAt) >= hoje).reduce((sum: number, v: any) => sum + (v.total || 0), 0) || 0,
          ontem: vendas.data?.filter((v: any) => {
            const data = new Date(v.createdAt);
            return data >= ontem && data < hoje;
          }).reduce((sum: number, v: any) => sum + (v.total || 0), 0) || 0,
          semana: vendas.data?.filter((v: any) => new Date(v.createdAt) >= semanaAtras).reduce((sum: number, v: any) => sum + (v.total || 0), 0) || 0,
          mes: vendas.data?.filter((v: any) => new Date(v.createdAt) >= mesAtras).reduce((sum: number, v: any) => sum + (v.total || 0), 0) || 0,
          porDia: [],
          porCategoria: []
        };
      } catch (error) {
        console.error('Erro ao processar dados de vendas:', error);
      }
    }

    // Processar pedidos (mesmos dados das vendas)
    if (pedidosResponse.status === 'fulfilled' && pedidosResponse.value.ok) {
      try {
        const pedidos = await pedidosResponse.value.json();
        const hoje = new Date();
        const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
        const semanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        const mesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);

        pedidosData = {
          hoje: pedidos.data?.filter((p: any) => new Date(p.createdAt) >= hoje).length || 0,
          ontem: pedidos.data?.filter((p: any) => {
            const data = new Date(p.createdAt);
            return data >= ontem && data < hoje;
          }).length || 0,
          semana: pedidos.data?.filter((p: any) => new Date(p.createdAt) >= semanaAtras).length || 0,
          mes: pedidos.data?.filter((p: any) => new Date(p.createdAt) >= mesAtras).length || 0,
          pendentes: pedidos.data?.filter((p: any) => p.status === 'pendente').length || 0
        };
      } catch (error) {
        console.error('Erro ao processar dados de pedidos:', error);
      }
    }

    // Processar clientes
    if (clientesResponse.status === 'fulfilled' && clientesResponse.value.ok) {
      try {
        const clientes = await clientesResponse.value.json();
        const hoje = new Date();
        const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);

        clientesData = {
          total: clientes.data?.length || 0,
          ativos: clientes.data?.filter((c: any) => c.status === 'ativo').length || 0,
          novos: clientes.data?.filter((c: any) => new Date(c.createdAt) >= hoje).length || 0,
          novosAnterior: clientes.data?.filter((c: any) => {
            const data = new Date(c.createdAt);
            return data >= ontem && data < hoje;
          }).length || 0
        };
      } catch (error) {
        console.error('Erro ao processar dados de clientes:', error);
      }
    }

    // Processar produtos
    if (produtosResponse.status === 'fulfilled' && produtosResponse.value.ok) {
      try {
        const produtos = await produtosResponse.value.json();
        
        produtosData = {
          total: produtos.data?.length || 0,
          estoqueBaixo: produtos.data?.filter((p: any) => p.estoque < 10 && p.estoque > 0).length || 0,
          semEstoque: produtos.data?.filter((p: any) => p.estoque === 0).length || 0,
          maisVendidos: produtos.data?.slice(0, 5).map((p: any) => ({
            titulo: p.titulo,
            vendas: p.vendas || 0
          })) || []
        };
      } catch (error) {
        console.error('Erro ao processar dados de produtos:', error);
      }
    }

    // Calcular crescimento (comparação com período anterior)
    const calcularCrescimento = (atual: number, anterior: number): number => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return ((atual - anterior) / anterior) * 100;
    };

    // Montar estatísticas do dashboard
    const stats: DashboardStats = {
      vendas: {
        hoje: vendasData.hoje,
        ontem: vendasData.ontem,
        semana: vendasData.semana,
        mes: vendasData.mes,
        crescimento: calcularCrescimento(vendasData.hoje, vendasData.ontem)
      },
      pedidos: {
        hoje: pedidosData.hoje,
        ontem: pedidosData.ontem,
        semana: pedidosData.semana,
        mes: pedidosData.mes,
        pendentes: pedidosData.pendentes
      },
      clientes: {
        total: clientesData.total,
        ativos: clientesData.ativos,
        novos: clientesData.novos,
        crescimento: calcularCrescimento(clientesData.novos, clientesData.novosAnterior)
      },
      produtos: {
        total: produtosData.total,
        estoqueBaixo: produtosData.estoqueBaixo,
        semEstoque: produtosData.semEstoque,
        maisVendidos: produtosData.maisVendidos
      },
      vendasPorDia: vendasData.porDia,
      vendasPorCategoria: vendasData.porCategoria
    };

    const responseData = {
      success: true,
      data: stats
    };

    // Salvar no cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    // Limpar cache antigo periodicamente
    if (Math.random() < 0.1) { // 10% de chance de limpar
      cleanCache();
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    
    // Retornar erro em vez de dados mockados
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar dados do backend',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
