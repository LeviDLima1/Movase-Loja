'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { 
    Search, 
    User, 
    LogOut, 
    Menu, 
    X, 
    ShoppingCart, 
    Heart,
    BookOpen,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    Twitter,
    ChevronDown
} from 'lucide-react';

import Logo from '../../global/LogobgNone.png'
import NomeLogo from '../../global/NomeLogoT.png'
import MiniCart from '../MiniCart';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/livros?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            {/* Barra Superior - Informações de Contato */}
            <div className="bg-gray-900 text-white py-2 hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-red-400" />
                                <span>(11) 99999-9999</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-red-400" />
                                <span>contato@movase.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-red-400" />
                                <span>São Paulo, SP</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300">Horário: Seg-Sex 9h às 18h</span>
                            <div className="flex items-center space-x-3">
                                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                                    <Youtube className="h-4 w-4" />
                                </a>
                                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                                    <Twitter className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Principal */}
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <Image 
                                    src={Logo} 
                                    alt="Logo Movase" 
                                    width={50} 
                                    height={50}
                                    className="object-contain group-hover:scale-105 transition-transform"
                                />
                                <Image 
                                    src={NomeLogo} 
                                    alt="Nome da Livraria" 
                                    width={120} 
                                    height={40}
                                    className="object-contain hidden sm:block"
                                />
                            </Link>
                        </div>

                        {/* Barra de Busca - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar livros, autores, categorias..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Ações do Usuário - Desktop */}
                        <div className="hidden lg:flex items-center space-x-4">
                            
                            {/* Links de Navegação */}
                            <div className="flex items-center space-x-6">
                                <Link href="/livros" className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors">
                                    <BookOpen className="h-5 w-5" />
                                    <span>Livros</span>
                                </Link>
                                <Link href="/favoritos" className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors">
                                    <Heart className="h-5 w-5" />
                                    <span>Favoritos</span>
                                </Link>
                            </div>

                            {/* Autenticação */}
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
                                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {user?.role === 'admin' && (
                                        <Link 
                                            href="/admin" 
                                            className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>Admin</span>
                                        </Link>
                                    )}
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                                        title="Sair"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link 
                                    href="/login" 
                                    className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    <span>Entrar</span>
                                </Link>
                            )}

                            {/* Carrinho */}
                            <div className="relative">
                                <MiniCart />
                            </div>
                        </div>

                        {/* Menu Mobile */}
                        <div className="lg:hidden flex items-center space-x-3">
                            <button
                                onClick={toggleMenu}
                                className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                            
                            {/* Carrinho Mobile */}
                            <div className="relative">
                                <MiniCart />
                            </div>
                        </div>
                    </div>

                    {/* Barra de Busca - Mobile */}
                    <div className="md:hidden pb-4">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar livros..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Menu Mobile Expandido */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200">
                        <div className="px-4 py-6 space-y-4">
                            
                            {/* Links de Navegação Mobile */}
                            <div className="space-y-3">
                                <Link 
                                    href="/livros" 
                                    className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <BookOpen className="h-5 w-5" />
                                    <span>Livros</span>
                                </Link>
                                <Link 
                                    href="/favoritos" 
                                    className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Heart className="h-5 w-5" />
                                    <span>Favoritos</span>
                                </Link>
                            </div>

                            {/* Autenticação Mobile */}
                            {isAuthenticated ? (
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-3">
                                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {user?.role === 'admin' && (
                                        <Link 
                                            href="/admin" 
                                            className="flex items-center space-x-3 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="h-5 w-5" />
                                            <span>Acessar Admin</span>
                                        </Link>
                                    )}
                                    
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors w-full py-2"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-gray-200">
                                    <Link 
                                        href="/login" 
                                        className="flex items-center space-x-3 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Entrar</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}