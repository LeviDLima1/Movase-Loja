"use client"

import Image from 'next/image'
import Link from 'next/link'
import Pg1 from '../../global/Pixicon.svg'
import Pg2 from '../../global/Boletoicon.png'
import Pg3 from '../../global/MasterIcon.png'
import Pg4 from '../../global/VisaIcon.png'
import Pg5 from '../../global/AmericanIcon.png'
import Logo from '../../global/LogobgNone.png'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  Heart,
  Shield,
  Truck,
  CreditCard,
  ArrowUp
} from 'lucide-react'

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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return(
        <>
        {/* Footer Principal */}
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Coluna 1 - Sobre */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Image 
                                src={Logo}
                                alt='Logo Movase'
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <h3 className="text-xl font-bold">Livraria Movase</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Sua livraria cristã de confiança, oferecendo os melhores livros para fortalecer sua fé e transformar sua vida.
                        </p>
                        
                        {/* Redes Sociais */}
                        <div className="flex space-x-4 pt-4">
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2 - Links Rápidos */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Links Rápidos</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Início
                                </Link>
                            </li>
                            <li>
                                <Link href="/livros" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Livros
                                </Link>
                            </li>
                            <li>
                                <Link href="/categorias" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Categorias
                                </Link>
                            </li>
                            <li>
                                <Link href="/sobre" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Sobre Nós
                                </Link>
                            </li>
                            <li>
                                <Link href="/contato" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 3 - Suporte */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Suporte</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/ajuda" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Central de Ajuda
                                </Link>
                            </li>
                            <li>
                                <Link href="/frete" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Informações de Frete
                                </Link>
                            </li>
                            <li>
                                <Link href="/devolucao" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Política de Devolução
                                </Link>
                            </li>
                            <li>
                                <Link href="/garantia" className="text-gray-300 hover:text-red-500 transition-colors">
                                    Garantia
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-red-500 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 4 - Contato */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contato</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-red-500" />
                                <span className="text-gray-300">
                                    Rua das Flores, 123<br />
                                    Centro - São Paulo, SP
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-red-500" />
                                <span className="text-gray-300">(11) 99999-9999</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-red-500" />
                                <span className="text-gray-300">contato@movase.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-red-500" />
                                <span className="text-gray-300">
                                    Seg-Sex: 9h às 18h<br />
                                    Sáb: 9h às 14h
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Benefícios */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-600 rounded-lg">
                                <Truck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Entrega Rápida</h4>
                                <p className="text-sm text-gray-400">Receba em até 3 dias úteis</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-600 rounded-lg">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Compra Segura</h4>
                                <p className="text-sm text-gray-400">Pagamento 100% seguro</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-600 rounded-lg">
                                <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Múltiplas Formas</h4>
                                <p className="text-sm text-gray-400">Pague como preferir</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

        {/* Seção de Pagamentos */}
        <div className="bg-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-4">Formas de Pagamento</h3>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {Pg.map((p, index) => (
                            <div key={index} className="bg-white p-2 rounded-lg">
                                <Image 
                                    src={p.img} 
                                    alt="Forma de Pagamento" 
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Inferior */}
        <div className="bg-red-800 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-white text-sm">
                            © 2025 Livraria Movase. Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="/privacidade" className="text-white hover:text-red-200 transition-colors">
                            Política de Privacidade
                        </Link>
                        <Link href="/termos" className="text-white hover:text-red-200 transition-colors">
                            Termos de Uso
                        </Link>
                        <Link href="/cookies" className="text-white hover:text-red-200 transition-colors">
                            Política de Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Botão Voltar ao Topo */}
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-40 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110"
            aria-label="Voltar ao topo"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
        </>
    )
}