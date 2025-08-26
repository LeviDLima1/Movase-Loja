'use client';

import { useState } from 'react';
import { 
    User, 
    Settings, 
    Heart, 
    LogOut, 
    X, 
    ChevronRight,
    BookOpen,
    CreditCard,
    MapPin,
    Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserModal({ isOpen, onClose }: UserModalProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'wishlist' | 'orders'>('main');

    const handleLogout = () => {
        logout();
        onClose();
        router.push('/');
    };

    const handleNavigate = (path: string) => {
        router.push(path);
        onClose();
    };

    if (!isOpen) return null;

    const renderMainMenu = () => (
        <div className="space-y-4">
            {/* Header do usuário */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{user?.nome}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                </div>
            </div>

            {/* Menu de opções */}
            <div className="space-y-2">
                <button
                    onClick={() => setActiveSection('profile')}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">Configurações da Conta</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button
                    onClick={() => setActiveSection('wishlist')}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">Lista de Desejos</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button
                    onClick={() => setActiveSection('orders')}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">Meus Pedidos</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button
                    onClick={() => handleNavigate('/favoritos')}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">Favoritos</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                {user?.role === 'admin' && (
                    <button
                        onClick={() => handleNavigate('/admin')}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <Settings className="h-5 w-5 text-gray-600" />
                            <span className="font-medium">Painel Administrativo</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                )}

                <div className="border-t pt-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setActiveSection('main')}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <h3 className="font-semibold text-lg">Configurações da Conta</h3>
            </div>

            <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Informações Pessoais</h4>
                    <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nome:</span> {user?.nome}</p>
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                        <p><span className="font-medium">Telefone:</span> {user?.telefone || 'Não informado'}</p>
                        <p><span className="font-medium">CPF:</span> {user?.cpf || 'Não informado'}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-gray-600" />
                            <span>Editar Perfil</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                            <span>Alterar Senha</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-gray-600" />
                            <span>Endereços</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span>Notificações</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderWishlist = () => (
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setActiveSection('main')}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <h3 className="font-semibold text-lg">Lista de Desejos</h3>
            </div>

            <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Sua lista de desejos está vazia</p>
                <button
                    onClick={() => handleNavigate('/livros')}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Explorar Livros
                </button>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setActiveSection('main')}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <h3 className="font-semibold text-lg">Meus Pedidos</h3>
            </div>

            <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Você ainda não fez nenhum pedido</p>
                <button
                    onClick={() => handleNavigate('/livros')}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Fazer Primeira Compra
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-lg">Minha Conta</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                    {activeSection === 'main' && renderMainMenu()}
                    {activeSection === 'profile' && renderProfile()}
                    {activeSection === 'wishlist' && renderWishlist()}
                    {activeSection === 'orders' && renderOrders()}
                </div>
            </div>
        </div>
    );
}
