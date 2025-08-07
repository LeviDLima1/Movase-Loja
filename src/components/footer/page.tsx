import Image from 'next/image'
import Pg1 from '../../global/Pixicon.svg'
import Pg2 from '../../global/Boletoicon.png'
import Pg3 from '../../global/MasterIcon.png'
import Pg4 from '../../global/VisaIcon.png'
import Pg5 from '../../global/AmericanIcon.png'
import Logo from '../../global/LogobgNone.png'

export default function Footer() {

    const Pg = [{
        img: Pg1
    },
    {
        img: Pg2
    },
    {
        img: Pg3
    },
    {
        img: Pg4
    },
    {
        img: Pg5
    }]

    return(
        <>
        <div className="w-full py-20 bg-zinc-100">
            <div className="flex flex-col text-center text-zinc-500 font-semibold bg-white rounded-xl w-[30%] py-3 px-8 mx-auto">
                <h1 className='text-md'>Formas de pagamento</h1>
                <div className='flex justify-between w-full'>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {Pg.map((p, index) => (
                            <Image 
                                key={index} 
                                src={p.img} 
                                alt="Forma de Pagamento" 
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        ))}
                    </div>
                    <div className='bg-zinc-100 rounded-full p-2'>
                        <Image 
                            src={Logo}
                            alt='Logo'
                            width={70}
                            height={70}
                            className="object-contain"
                        />
                    </div>
                </div>
                
            </div>
        </div>
        <div className="w-full text-center py-2 bg-red-800 text-white">
            <p>Livraria Movase | Todos os Direitos Reservados © 2025 | <a href="">Política de privacidade</a> | <a href="">Termos de uso</a></p> 
        </div>
        
        </>
    )
}