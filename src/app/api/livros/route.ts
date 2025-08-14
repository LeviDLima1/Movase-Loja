import { NextRequest, NextResponse } from 'next/server';

// Mock de dados dos livros (substitua por conexão com banco)
const mockLivros = [
  {
    id: 1,
    titulo: 'FÉ X MEDO - LUCIANO PINHEIRO',
    autor: 'Luciano Pinheiro',
    editora: 'Movase',
    preco: 35.00,
    precoOriginal: 45.00,
    categoria: 'Religioso',
    subcategoria: 'Cristão',
    isbn: '978-85-1234-567-8',
    paginas: 180,
    ano: 2023,
    sinopse: 'Um livro que aborda a luta entre fé e medo na vida cristã moderna.',
    descricao: 'Descrição completa do livro sobre fé e medo...',
    estoque: 15,
    status: 'disponivel', // disponivel, indisponivel, esgotado
    destaque: true,
    novidade: false,
    promocao: true,
    imagemFront: '/images/livros/CapaLivro1Front.png',
    imagemBack: '/images/livros/CapaLivro1Back.png',
    tags: ['fé', 'medo', 'cristianismo', 'superação'],
    avaliacoes: 4.5,
    totalAvaliacoes: 23,
    vendas: 156,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-12-01T14:30:00Z'
  },
  {
    id: 2,
    titulo: 'UMA GERAÇÃO SE POSICIONA',
    autor: 'Juliana Prado',
    editora: 'Movase',
    preco: 30.00,
    precoOriginal: 30.00,
    categoria: 'Religioso',
    subcategoria: 'Cristão',
    isbn: '978-85-1234-567-9',
    paginas: 220,
    ano: 2023,
    sinopse: 'Um chamado para a nova geração se posicionar em fé.',
    descricao: 'Descrição completa sobre posicionamento da geração...',
    estoque: 8,
    status: 'disponivel',
    destaque: false,
    novidade: true,
    promocao: false,
    imagemFront: '/images/livros/CapaLivro2Front.jpg',
    imagemBack: '/images/livros/CapaLivro2Back.jpg',
    tags: ['geração', 'posicionamento', 'fé', 'jovens'],
    avaliacoes: 4.8,
    totalAvaliacoes: 45,
    vendas: 89,
    createdAt: '2023-06-20T09:00:00Z',
    updatedAt: '2023-11-15T16:45:00Z'
  },
  {
    id: 3,
    titulo: 'O PODER DA ORAÇÃO',
    autor: 'Maria Santos',
    editora: 'Movase',
    preco: 28.00,
    precoOriginal: 35.00,
    categoria: 'Religioso',
    subcategoria: 'Oração',
    isbn: '978-85-1234-567-0',
    paginas: 160,
    ano: 2022,
    sinopse: 'Descubra o poder transformador da oração em sua vida.',
    descricao: 'Guia completo sobre oração e vida espiritual...',
    estoque: 0,
    status: 'esgotado',
    destaque: false,
    novidade: false,
    promocao: true,
    imagemFront: '/images/livros/CapaLivro1Front.png',
    imagemBack: '/images/livros/CapaLivro1Back.png',
    tags: ['oração', 'poder', 'transformação', 'espiritual'],
    avaliacoes: 4.2,
    totalAvaliacoes: 67,
    vendas: 234,
    createdAt: '2022-08-10T11:00:00Z',
    updatedAt: '2023-10-20T13:20:00Z'
  },
  {
    id: 4,
    titulo: 'LIDERANÇA CRISTÃ',
    autor: 'João Silva',
    editora: 'Movase',
    preco: 42.00,
    precoOriginal: 42.00,
    categoria: 'Religioso',
    subcategoria: 'Liderança',
    isbn: '978-85-1234-567-1',
    paginas: 280,
    ano: 2023,
    sinopse: 'Princípios bíblicos para uma liderança eficaz.',
    descricao: 'Manual completo de liderança baseada em princípios cristãos...',
    estoque: 12,
    status: 'disponivel',
    destaque: true,
    novidade: false,
    promocao: false,
    imagemFront: '/images/livros/CapaLivro2Front.jpg',
    imagemBack: '/images/livros/CapaLivro2Back.jpg',
    tags: ['liderança', 'cristã', 'princípios', 'bíblicos'],
    avaliacoes: 4.6,
    totalAvaliacoes: 34,
    vendas: 78,
    createdAt: '2023-03-05T08:30:00Z',
    updatedAt: '2023-12-05T10:15:00Z'
  },
  {
    id: 5,
    titulo: 'FAMÍLIA EM PRIMEIRO LUGAR',
    autor: 'Ana Costa',
    editora: 'Movase',
    preco: 25.00,
    precoOriginal: 32.00,
    categoria: 'Religioso',
    subcategoria: 'Família',
    isbn: '978-85-1234-567-2',
    paginas: 140,
    ano: 2022,
    sinopse: 'Valores cristãos para fortalecer sua família.',
    descricao: 'Guia prático para construir uma família sólida...',
    estoque: 20,
    status: 'disponivel',
    destaque: false,
    novidade: false,
    promocao: true,
    imagemFront: '/images/livros/CapaLivro1Front.png',
    imagemBack: '/images/livros/CapaLivro1Back.png',
    tags: ['família', 'valores', 'cristãos', 'relacionamento'],
    avaliacoes: 4.7,
    totalAvaliacoes: 89,
    vendas: 312,
    createdAt: '2022-11-12T14:00:00Z',
    updatedAt: '2023-09-18T15:30:00Z'
  }
];

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
    
    // Extrair parâmetros de busca
    const params: SearchParams = {
      q: searchParams.get('q') || undefined,
      categoria: searchParams.get('categoria') || undefined,
      subcategoria: searchParams.get('subcategoria') || undefined,
      precoMin: searchParams.get('precoMin') || undefined,
      precoMax: searchParams.get('precoMax') || undefined,
      status: searchParams.get('status') || undefined,
      ordenar: searchParams.get('ordenar') || undefined,
      destaque: searchParams.get('destaque') || undefined,
      novidade: searchParams.get('novidade') || undefined,
      promocao: searchParams.get('promocao') || undefined,
      limit: searchParams.get('limit') || '12',
      page: searchParams.get('page') || '1'
    };

    // Aplicar filtros
    let livrosFiltrados = [...mockLivros];

    // Busca por texto (título, autor, sinopse)
    if (params.q) {
      const termo = params.q.toLowerCase();
      livrosFiltrados = livrosFiltrados.filter(livro => 
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo) ||
        livro.sinopse.toLowerCase().includes(termo) ||
        livro.tags.some(tag => tag.toLowerCase().includes(termo))
      );
    }

    // Filtro por categoria
    if (params.categoria) {
      livrosFiltrados = livrosFiltrados.filter(livro => 
        livro.categoria.toLowerCase() === params.categoria!.toLowerCase()
      );
    }

    // Filtro por subcategoria
    if (params.subcategoria) {
      livrosFiltrados = livrosFiltrados.filter(livro => 
        livro.subcategoria.toLowerCase() === params.subcategoria!.toLowerCase()
      );
    }

    // Filtro por preço mínimo
    if (params.precoMin) {
      const precoMin = parseFloat(params.precoMin);
      livrosFiltrados = livrosFiltrados.filter(livro => livro.preco >= precoMin);
    }

    // Filtro por preço máximo
    if (params.precoMax) {
      const precoMax = parseFloat(params.precoMax);
      livrosFiltrados = livrosFiltrados.filter(livro => livro.preco <= precoMax);
    }

    // Filtro por status
    if (params.status) {
      livrosFiltrados = livrosFiltrados.filter(livro => 
        livro.status === params.status
      );
    }

    // Filtro por destaque
    if (params.destaque === 'true') {
      livrosFiltrados = livrosFiltrados.filter(livro => livro.destaque);
    }

    // Filtro por novidade
    if (params.novidade === 'true') {
      livrosFiltrados = livrosFiltrados.filter(livro => livro.novidade);
    }

    // Filtro por promoção
    if (params.promocao === 'true') {
      livrosFiltrados = livrosFiltrados.filter(livro => livro.promocao);
    }

    // Ordenação
    if (params.ordenar) {
      switch (params.ordenar) {
        case 'preco_asc':
          livrosFiltrados.sort((a, b) => a.preco - b.preco);
          break;
        case 'preco_desc':
          livrosFiltrados.sort((a, b) => b.preco - a.preco);
          break;
        case 'titulo_asc':
          livrosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
          break;
        case 'titulo_desc':
          livrosFiltrados.sort((a, b) => b.titulo.localeCompare(a.titulo));
          break;
        case 'avaliacoes':
          livrosFiltrados.sort((a, b) => b.avaliacoes - a.avaliacoes);
          break;
        case 'vendas':
          livrosFiltrados.sort((a, b) => b.vendas - a.vendas);
          break;
        case 'novidade':
          livrosFiltrados.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          // Ordenação padrão: destaque primeiro, depois por data de criação
          livrosFiltrados.sort((a, b) => {
            if (a.destaque && !b.destaque) return -1;
            if (!a.destaque && b.destaque) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
      }
    }

    // Paginação
    const limit = parseInt(params.limit) || 12;
    const page = parseInt(params.page) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const livrosPaginados = livrosFiltrados.slice(startIndex, endIndex);
    const totalLivros = livrosFiltrados.length;
    const totalPages = Math.ceil(totalLivros / limit);

    // Estatísticas para filtros
    const categorias = [...new Set(mockLivros.map(livro => livro.categoria))];
    const subcategorias = [...new Set(mockLivros.map(livro => livro.subcategoria))];
    const precoMin = Math.min(...mockLivros.map(livro => livro.preco));
    const precoMax = Math.max(...mockLivros.map(livro => livro.preco));

    return NextResponse.json({
      success: true,
      data: {
        livros: livrosPaginados,
        paginacao: {
          page,
          limit,
          totalLivros,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filtros: {
          categorias,
          subcategorias,
          precoMin,
          precoMax,
          totalEncontrados: totalLivros
        }
      }
    });

  } catch (error) {
    console.error('Erro na API de livros:', error);
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
