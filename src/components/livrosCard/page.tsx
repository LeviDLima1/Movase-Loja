import BookFront1 from '../../global/Books/CapaLivro1Front.png'
import BookBack1 from '../../global/Books/CapaLivro1Back.png'
import BookFront2 from '../../global/Books/CapaLivro2Front.jpg'
import BookBack2 from '../../global/Books/CapaLivro2Back.png'
import Image from 'next/image'


export default function LivroCard() {

    const Livros = [
        {
            id: 1,
            img: BookFront1,
            titulo: 'Livro 1',
            sinopse: 'Sinopse do livro 1',
            autor: 'Autor 1',
            editora: 'Editora burugudu',
            price: '2conto'
        },
        {
            id: 2,
            img: BookFront2,
            titulo: 'Livro 2',
            sinopse: 'Sinopse do livro 2',
            autor: 'Autor 2',
            editora: 'Editora burugudu 2',
            price: '3conto'
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

    return(
        <>
        <div className="grid grid-cols-4 max-sm:grid-cols-1 space-y-8">
            
        
            {Livros.map((livro) => (
                <div key={livro.id} className="flex flex-col items-center justify-center mx-auto bg-gray-200 w-64 h-78">
                    <div>
                        <Image 
                            src={livro.img}
                            alt={livro.titulo}
                            width={32}
                            height={32}
                        />
                    </div>

                    <div>
                        <div>
                            <h1>{livro.titulo}</h1>
                        </div>
                        <div>
                            <h1>{livro.sinopse}</h1>
                        </div>
                    </div>
                    
                </div>
            ))}
        </div>
        </>
    )
}