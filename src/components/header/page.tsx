import { FaYoutube } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

import Logo from '../../global/LogobgNone.png'
import NomeLogo from '../../global/NomeLogoT.png'


export default function Header() {

    return (
        <>
            <div className="w-full flex flex-col justify-between h-60 bg-gray-100 text-white">
                <div className="bg-red-800 h-8 flex items-center justify-center">
                    <div className="w-[60%] inline-flex justify-between">
                        <div className="">
                            <h1 className="font-semibold">Seja Bem Vindo À Livraria Movase!</h1>
                        </div>
                        <div className="inline-flex items-center space-x-4 text-2xl">
                            <FaYoutube className="hover:text-red-200 cursor-pointer" />
                            <AiFillInstagram className="hover:text-red-200 cursor-pointer" />

                        </div>
                    </div>

                </div>

                <div className="inline-flex justify-between mx-auto w-[60%]">
                    <div className="flex items-center">
                        <img src={Logo.src} alt="Logo Movase"
                            className="w-20" />
                        <img src={NomeLogo.src} alt="Nome da Livraria"
                            className="w-50 h-15 mt-3" />
                    </div>
                    <div className="inline-flex items-center gap-2">
                        <div className="bg-white rounded-xl text-black">
                            <input type="text" placeholder="Pesquisar Livro" className="px-4 py-1 text-lg border rounded-xl border-red-700"/>
                        </div>
                        <div className="bg-red-700 font-semibold text-xl w-10 h-10 rounded-full flex items-center justify-center">
                            <button><IoSearch /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-red-700 font-semibold">
                        <div className="inline-flex items-center hover:bg-gray-200 hover:text-red-600 rounded-lg p-2 transition-all cursor-pointer">
                            <IoPerson />
                            <button>Login</button>
                        </div>
                        <div className="inline-flex items-center hover:bg-gray-200 hover:text-red-600 rounded-lg p-2 transition-all cursor-pointer">
                            <FaShoppingCart />
                            <button>Carrinho</button>
                        </div>
                    </div>
                    
                </div>

                <div className="bg-red-800 h-8">
                    a
                </div>


            </div>
        </>
    )
}