'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  ShoppingCart, 
  Users, 
  Settings, 
  FileText,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Home
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Livros', href: '/admin/livros', icon: BookOpen },
  { name: 'Vendas', href: '/admin/vendas', icon: ShoppingCart },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Postagens', href: '/admin/postagens', icon: FileText },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { state } = useNotifications();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para mobile */}
              <div className={`fixed inset-0 z-[70] lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Logout no mobile */}
          <div className="border-t border-gray-200 px-2 py-4">
            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="group flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors w-full"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Botão menu mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:block">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <div>
                      <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                        Admin
                      </Link>
                    </div>
                  </li>
                  {pathname !== '/admin' && (
                    <li>
                      <div className="flex items-center">
                        <span className="text-gray-400 mx-2">/</span>
                        <span className="text-gray-900 font-medium">
                          {navigation.find(item => item.href === pathname)?.name || 'Página'}
                        </span>
                      </div>
                    </li>
                  )}
                </ol>
              </nav>
            </div>

            {/* Ações do header */}
            <div className="flex items-center space-x-4">
              {/* Perfil do usuário */}
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.nome || 'Administrador'}
                  </span>
                </button>
              </div>

              {/* Botão logout */}
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
