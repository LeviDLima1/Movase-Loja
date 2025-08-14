import BookFront1 from '../../../global/Books/CapaLivro1Front.png'
import BookBack1 from '../../../global/Books/CapaLivro1Back.png'
import BookFront2 from '../../../global/Books/CapaLivro2Front.jpg'
import BookBack2 from '../../../global/Books/CapaLivro2Back.jpg'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '../../../components/AddToCartButton'
import { Star, Heart, Share2, BookOpen, Calendar, Hash, Award, Truck, Shield, ArrowLeft } from 'lucide-react'

// Dados dos livros (em um projeto real, isso viria de uma API ou banco de dados)
const Livros = [
    {
        id: 1,
        img1: BookFront1,
        img2: BookBack1,
        titulo: 'FÉ X MEDO - LUCIANO PINHEIRO',
        sinopse: 'Uma obra inspiradora que aborda a constante batalha entre fé e medo na vida cristã. O autor Luciano Pinheiro compartilha insights profundos sobre como superar os medos e fortalecer a fé através de experiências pessoais e ensinamentos bíblicos.',
        descricao: 'Este livro é um guia prático e espiritual que combina teoria bíblica com aplicações práticas para o dia a dia. Através de histórias reais e exemplos inspiradores, o autor mostra como transformar o medo em coragem e a dúvida em fé inabalável.',
        autor: 'Luciano Pinheiro',
        editora: 'Movase',
        price: 35.00,
        precoOriginal: 45.00,
        paginas: 180,
        isbn: '978-85-0000-000-1',
        ano: 2024,
        categoria: 'Religioso',
        subcategoria: 'Cristão',
        avaliacoes: 4.8,
        totalAvaliacoes: 156,
        vendas: 2340,
        estoque: 45,
        destaque: true,
        novidade: false,
        promocao: true,
        tags: ['fé', 'medo', 'cristianismo', 'superação', 'espiritualidade'],
        dimensoes: '14 x 21 cm',
        peso: '280g',
        idioma: 'Português',
        encadernacao: 'Brochura'
    },
    {
        id: 2,
        img1: BookFront2,
        img2: BookBack2,
        titulo: 'UMA GERAÇÃO SE POSICIONA',
        sinopse: 'Este livro apresenta uma visão poderosa sobre como a nova geração pode se posicionar diante dos desafios da vida moderna. Com base em princípios bíblicos e experiências práticas, oferece orientação para jovens que desejam fazer a diferença.',
        descricao: 'Uma obra revolucionária que desafia a nova geração a assumir seu papel na sociedade. Com linguagem acessível e exemplos práticos, o livro oferece ferramentas para que jovens desenvolvam liderança, caráter e propósito.',
        autor: 'Juliana Prado',
        editora: 'Juliana Prado',
        price: 30.00,
        precoOriginal: 30.00,
        paginas: 150,
        isbn: '978-85-0000-000-2',
        ano: 2024,
        categoria: 'Religioso',
        subcategoria: 'Cristão',
        avaliacoes: 4.6,
        totalAvaliacoes: 89,
        vendas: 1234,
        estoque: 32,
        destaque: false,
        novidade: true,
        promocao: false,
        tags: ['geração', 'posicionamento', 'liderança', 'jovens', 'propósito'],
        dimensoes: '14 x 21 cm',
        peso: '250g',
        idioma: 'Português',
        encadernacao: 'Brochura'
    }
]

export default async function LivroDetalhes({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const livroId = parseInt(resolvedParams.id)
    const livro = Livros.find(l => l.id === livroId)

    if (!livro) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-red-500 mb-4">
                        <BookOpen className="h-16 w-16 mx-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Livro não encontrado</h1>
                    <p className="text-gray-600 mb-6">O livro que você está procurando não existe ou foi removido.</p>
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para a lista de livros
                    </Link>
                </div>
            </div>
        )
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const getDiscountPercentage = () => {
        if (livro.precoOriginal > livro.price) {
            const discount = ((livro.precoOriginal - livro.price) / livro.precoOriginal) * 100;
            return Math.round(discount);
        }
        return 0;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header com Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/" 
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Voltar para livros
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Heart className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna da Esquerda - Imagens */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {livro.destaque && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        <Award className="h-3 w-3" />
                                        Destaque
                                    </span>
                                )}
                                {livro.novidade && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        <Calendar className="h-3 w-3" />
                                        Novo
                                    </span>
                                )}
                                {livro.promocao && getDiscountPercentage() > 0 && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <Hash className="h-3 w-3" />
                                        -{getDiscountPercentage()}%
                                    </span>
                                )}
                            </div>

                            {/* Imagem Principal */}
                            <div className="relative group bg-white rounded-xl shadow-lg overflow-hidden">
                                <Image
                                    src={livro.img1}
                                    alt={livro.titulo}
                                    width={400}
                                    height={600}
                                    className="w-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                                />
                                {livro.img2 && (
                                    <Image 
                                        src={livro.img2}
                                        alt={livro.titulo}
                                        width={400}
                                        height={600}
                                        className="absolute top-0 left-0 w-full opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                                    />
                                )}
                                
                                {/* Overlay com instrução */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                                            Passe o mouse para ver o verso
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Miniaturas (futuro) */}
                            <div className="flex justify-center mt-4 space-x-2">
                                <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
                                <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
                                <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Central - Informações */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            {/* Cabeçalho */}
                            <div className="mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{livro.titulo}</h1>
                                        <p className="text-xl text-gray-600 mb-2">por {livro.autor}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{livro.categoria} • {livro.subcategoria}</span>
                                            <span>• {livro.ano}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Avaliações */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < Math.floor(livro.avaliacoes)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {livro.avaliacoes} ({livro.totalAvaliacoes} avaliações)
                                    </span>
                                </div>
                            </div>

                            {/* Preço */}
                            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <span className="text-3xl font-bold text-red-600">
                                            {formatPrice(livro.price)}
                                        </span>
                                        {livro.precoOriginal > livro.price && (
                                            <span className="text-lg text-gray-500 line-through ml-2">
                                                {formatPrice(livro.precoOriginal)}
                                            </span>
                                        )}
                                    </div>
                                    {livro.precoOriginal > livro.price && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            Economia de {formatPrice(livro.precoOriginal - livro.price)}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Status do estoque */}
                                <div className="mt-4 flex items-center gap-2">
                                    {livro.estoque > 0 ? (
                                        <span className="text-green-600 text-sm font-medium">
                                            ✓ Em estoque ({livro.estoque} unidades)
                                        </span>
                                    ) : (
                                        <span className="text-red-600 text-sm font-medium">
                                            ✗ Fora de estoque
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Botão Comprar */}
                            <div className="mb-8">
                                <AddToCartButton 
                                    livro={{
                                        id: livro.id,
                                        titulo: livro.titulo,
                                        autor: livro.autor,
                                        price: livro.price,
                                        img1: livro.img1.src
                                    }}
                                    className="w-full px-8 py-4 text-lg font-semibold"
                                />
                            </div>

                            {/* Sinopse */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sinopse</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">{livro.sinopse}</p>
                                <p className="text-gray-600 leading-relaxed">{livro.descricao}</p>
                            </div>

                            {/* Tags */}
                            {livro.tags && livro.tags.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {livro.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Informações Técnicas */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Técnicas</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Editora</span>
                                        <p className="text-gray-900">{livro.editora}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Páginas</span>
                                        <p className="text-gray-900">{livro.paginas}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">ISBN</span>
                                        <p className="text-gray-900">{livro.isbn}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Ano</span>
                                        <p className="text-gray-900">{livro.ano}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Dimensões</span>
                                        <p className="text-gray-900">{livro.dimensoes}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Peso</span>
                                        <p className="text-gray-900">{livro.peso}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Idioma</span>
                                        <p className="text-gray-900">{livro.idioma}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Encadernação</span>
                                        <p className="text-gray-900">{livro.encadernacao}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Estatísticas */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{livro.vendas}</div>
                                        <div className="text-sm text-gray-600">Vendas</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{livro.avaliacoes}</div>
                                        <div className="text-sm text-gray-600">Avaliação</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{livro.totalAvaliacoes}</div>
                                        <div className="text-sm text-gray-600">Avaliações</div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefícios */}
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefícios da Compra</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-5 w-5 text-green-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">Entrega Rápida</div>
                                            <div className="text-sm text-gray-600">Receba em até 3 dias úteis</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-green-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">Compra Segura</div>
                                            <div className="text-sm text-gray-600">Pagamento 100% seguro</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Award className="h-5 w-5 text-green-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">Qualidade Garantida</div>
                                            <div className="text-sm text-gray-600">Produtos originais</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
