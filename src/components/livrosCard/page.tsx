"use client"

import BookFront1 from '../../global/Books/CapaLivro1Front.png'
import BookBack1 from '../../global/Books/CapaLivro1Back.png'
import BookFront2 from '../../global/Books/CapaLivro2Front.jpg'
import BookBack2 from '../../global/Books/CapaLivro2Back.jpg'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AddToCartButton from '../AddToCartButton'


export default function LivroCard() {
    const router = useRouter();

    const handleLivroClick = (livroId: number) => {
        router.push(`/livros/${livroId}`);
    };

    const Livros = [
        {
            id: 1,
            img1: BookFront1,
            img2: BookBack1,
            titulo: 'FÉ X MEDO - LUCIANO PINHEIRO',
            sinopse: 'Sinopse do livro 1',
            autor: 'Luciano Pinheiro',
            editora: 'Movase',
            price: '35.00'
        },
        {
            id: 2,
            img1: BookFront2,
            img2: BookBack2,
            titulo: 'UMA GERAÇÃO SE POSICIONA',
            sinopse: 'Sinopse do livro 2',
            autor: 'Autor 2',
            editora: 'Juliana Prado',
            price: '30.00'
        },
        // {
        //     id: 3,
        //     img: 'img 3',
        //     titulo: 'Livro 3',
        //     sinopse: 'Sinopse do livro 3',
        //     autor: 'Autor 3',
        //     editora: 'Editora burugudu 3',
        //     price: '3conto'
        // },
        // {
        //     id: 4,
        //     img: 'img 4',
        //     titulo: 'Livro 4',
        //     sinopse: 'Sinopse do livro 4',
        //     autor: 'Autor 4',
        //     editora: 'Editora burugudu 4',
        //     price: '4conto'
        // },
        // {
        //     id: 5,
        //     img: 'img 5',
        //     titulo: 'Livro 5',
        //     sinopse: 'Sinopse do livro 5',
        //     autor: 'Autor 5',
        //     editora: 'Editora burugudu 5',
        //     price: '3conto'
        // },{
        //     id: 6,
        //     img: 'img 6',
        //     titulo: 'Livro 6',
        //     sinopse: 'Sinopse do livro 6',
        //     autor: 'Autor 6',
        //     editora: 'Editora burugudu 6',
        //     price: '3conto'
        // },

    ]

    return (
        <>
            <div className="grid grid-cols-4 max-sm:grid-cols-1 space-y-8">
                {Livros.map((livro) => (
                    <div
                        key={livro.id}
                        className="group flex flex-col cursor-pointer bg-white items-center justify-center mx-auto shadow-[0px_0px_4px_1px_#8a1616] rounded-xl w-64 h-120"
                    >
                        <div className='px-4 py-6 h-full flex-col justify-between'
                            onClick={() => handleLivroClick(livro.id)}>
                            <div className='h-[60%] relative overflow-hidden'>
                                <div className='relative w-full h-full'>
                                    <Image
                                        src={livro.img1}
                                        alt={livro.titulo}
                                        className='w-full transition-opacity duration-500 ease-in-out group-hover:opacity-0'
                                    />
                                    {livro.img2 && (
                                        <Image
                                            src={livro.img2}
                                            alt={livro.titulo}
                                            className='absolute top-0 left-0 w-full opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100'
                                        />
                                    )}
                                </div>
                            </div>

                            <div className='h-[40%] flex flex-col items-center justify-center'>
                                <div className='text-center flex flex-col justify-between h-20 mb-12 gap-2'>
                                    <div>
                                        <h1 className="font-montserrat font-semibold text-md">{livro.titulo}</h1>
                                    </div>
                                    <div>
                                        <h1 className="font-montserrat font-bold text-xl text-red-700">R$ {livro.price}</h1>
                                    </div>
                                    <div className='flex justify-center items-center'>
                                        <AddToCartButton
                                            livro={{
                                                id: livro.id,
                                                titulo: livro.titulo,
                                                autor: livro.autor,
                                                price: parseFloat(livro.price),
                                                img1: livro.img1.src
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}