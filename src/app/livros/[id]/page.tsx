import BookFront1 from '../../../global/Books/CapaLivro1Front.png'
import BookBack1 from '../../../global/Books/CapaLivro1Back.png'
import BookFront2 from '../../../global/Books/CapaLivro2Front.jpg'
import BookBack2 from '../../../global/Books/CapaLivro2Back.jpg'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '../../../components/AddToCartButton'

// Dados dos livros (em um projeto real, isso viria de uma API ou banco de dados)
const Livros = [
    {
        id: 1,
        img1: BookFront1,
        img2: BookBack1,
        titulo: 'FÉ X MEDO - LUCIANO PINHEIRO',
        sinopse: 'Uma obra inspiradora que aborda a constante batalha entre fé e medo na vida cristã. O autor Luciano Pinheiro compartilha insights profundos sobre como superar os medos e fortalecer a fé através de experiências pessoais e ensinamentos bíblicos.',
        autor: 'Luciano Pinheiro',
        editora: 'Movase',
        price: '35.00',
        paginas: '180',
        isbn: '978-85-0000-000-1',
        ano: '2024'
    },
    {
        id: 2,
        img1: BookFront2,
        img2: BookBack2,
        titulo: 'UMA GERAÇÃO SE POSICIONA',
        sinopse: 'Este livro apresenta uma visão poderosa sobre como a nova geração pode se posicionar diante dos desafios da vida moderna. Com base em princípios bíblicos e experiências práticas, oferece orientação para jovens que desejam fazer a diferença.',
        autor: 'Juliana Prado',
        editora: 'Juliana Prado',
        price: '30.00',
        paginas: '150',
        isbn: '978-85-0000-000-2',
        ano: '2024'
    }
]

export default function LivroDetalhes({ params }: { params: { id: string } }) {
    const livroId = parseInt(params.id)
    const livro = Livros.find(l => l.id === livroId)

    if (!livro) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-700 mb-4">Livro não encontrado</h1>
                    <Link href="/" className="text-blue-600 hover:underline">
                        Voltar para a lista de livros
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Botão Voltar */}
                <div className="mb-8">
                    <Link 
                        href="/" 
                        className="inline-flex items-center text-red-700 hover:text-red-800 font-semibold"
                    >
                        ← Voltar para livros
                    </Link>
                </div>

                {/* Conteúdo Principal */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Imagens do Livro */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <Image
                                    src={livro.img1}
                                    alt={livro.titulo}
                                    className="w-full rounded-lg shadow-md transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                                />
                                {livro.img2 && (
                                    <Image 
                                        src={livro.img2}
                                        alt={livro.titulo}
                                        className="absolute top-0 left-0 w-full rounded-lg shadow-md opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                                    />
                                )}
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                                Passe o mouse sobre a imagem para ver o verso
                            </p>
                        </div>

                        {/* Informações do Livro */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{livro.titulo}</h1>
                                <p className="text-xl text-gray-600">por {livro.autor}</p>
                            </div>

                            <div className="text-3xl font-bold text-red-700">
                                R$ {livro.price}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">Sinopse</h2>
                                <p className="text-gray-700 leading-relaxed">{livro.sinopse}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-900">Editora:</span>
                                    <p className="text-gray-700">{livro.editora}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Páginas:</span>
                                    <p className="text-gray-700">{livro.paginas}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">ISBN:</span>
                                    <p className="text-gray-700">{livro.isbn}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Ano:</span>
                                    <p className="text-gray-700">{livro.ano}</p>
                                </div>
                            </div>

                                                         <div className="pt-4">
                                 <AddToCartButton 
                                     livro={{
                                         id: livro.id,
                                         titulo: livro.titulo,
                                         autor: livro.autor,
                                         price: parseFloat(livro.price),
                                         img1: livro.img1.src
                                     }}
                                     className="w-full px-8 py-4"
                                 />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
