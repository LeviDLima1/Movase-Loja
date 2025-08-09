import { FaYoutube } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";

import Logo from '../../global/LogobgNone.png'
import NomeLogo from '../../global/NomeLogoT.png'
import CartIcon from '../CartIcon';

export default function Header() {

    return (
        <>
            <div className="w-full flex flex-col justify-between h-60 bg-gray-100 text-white">
                <div className="bg-red-800 h-8 flex items-center justify-center">
                    <div className="w-[60%] max-md:w-[80%] inline-flex justify-between">
                        <div className="flex items-center justify-center">
                            <h1 className="max-md:text-xs font-semibold">Seja Bem Vindo À Livraria Movase!</h1>
                        </div>
                        <div className="inline-flex items-center space-x-4 text-2xl">
                            <FaYoutube className="hover:text-red-200 cursor-pointer" />
                            <AiFillInstagram className="hover:text-red-200 cursor-pointer" />

                        </div>
                    </div>

                </div>

                <div className="flex max-sm:flex-col justify-between mx-auto w-[60%] max-md:w-[80%] max-md:gap-6">
                    <div className="flex items-center max-md:justify-center">
                        <img src={Logo.src} alt="Logo Movase"
                            className="sm:w-20 max-sm:w-16" />
                        <img src={NomeLogo.src} alt="Nome da Livraria"
                            className="sm:w-50 sm:h-15 max-sm:h-12 mt-3" />
                    </div>
                    <div className="inline-flex items-center justify-center gap-2">
                        <div className="bg-white rounded-xl text-black">
                            <input type="text" placeholder="Pesquisar Livro" className="px-4 py-1 text-lg border rounded-xl border-red-700"/>
                        </div>        
                        <div className="bg-red-700 font-semibold text-xl w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
                            <button className="cursor-pointer"><IoSearch /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-red-700 font-semibold max-lg:hidden">
                        <div className="inline-flex items-center hover:bg-gray-200 hover:text-red-600 rounded-lg p-3 transition-all cursor-pointer">
                            <IoPerson className="cursor-pointer"/>
                            <button className="cursor-pointer">Login</button>
                        </div>
                        <div className="inline-flex items-center hover:bg-gray-200 hover:text-red-600 rounded-lg transition-all cursor-pointer">
                            <CartIcon />
                        </div>
                    </div>
                    
                </div>

                <div className="bg-white h-8"></div>

            </div>
        </>
    )
}