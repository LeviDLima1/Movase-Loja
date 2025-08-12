'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaBell, 
  FaSave, 
  FaToggleOn, 
  FaToggleOff,
  FaEnvelope,
  FaMobile,
  FaDesktop,
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationSettings {
  email: {
    enabled: boolean;
    newOrders: boolean;
    lowStock: boolean;
    salesReports: boolean;
    systemAlerts: boolean;
  };
  push: {
    enabled: boolean;
    newOrders: boolean;
    lowStock: boolean;
    salesReports: boolean;
    systemAlerts: boolean;
  };
  desktop: {
    enabled: boolean;
    newOrders: boolean;
    lowStock: boolean;
    salesReports: boolean;
    systemAlerts: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const defaultSettings: NotificationSettings = {
  email: {
    enabled: true,
    newOrders: true,
    lowStock: true,
    salesReports: false,
    systemAlerts: true,
  },
  push: {
    enabled: true,
    newOrders: true,
    lowStock: true,
    salesReports: false,
    systemAlerts: true,
  },
  desktop: {
    enabled: true,
    newOrders: true,
    lowStock: true,
    salesReports: false,
    systemAlerts: true,
  },
  frequency: 'immediate',
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

export default function ConfiguracoesNotificacoes() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { addSuccessNotification, addErrorNotification } = useNotifications();

  const handleToggle = (category: keyof NotificationSettings, setting: string) => {
    setSettings(prev => {
      const categorySettings = prev[category] as any;
      return {
        ...prev,
        [category]: {
          ...categorySettings,
          [setting]: !categorySettings[setting]
        }
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage (em produção, seria no backend)
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
      
      addSuccessNotification(
        'Configurações Salvas', 
        'Suas configurações de notificação foram salvas com sucesso'
      );
    } catch (error) {
      addErrorNotification(
        'Erro ao Salvar', 
        'Erro ao salvar as configurações. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const NotificationTypeCard = ({ 
    title, 
    icon: Icon, 
    description, 
    category, 
    settings: categorySettings 
  }: {
    title: string;
    icon: any;
    description: string;
    category: keyof NotificationSettings;
    settings: any;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-blue-100 rounded-full mr-4">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => handleToggle(category, 'enabled')}
            className={`p-2 rounded-full transition-colors ${
              categorySettings.enabled 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {categorySettings.enabled ? (
              <FaToggleOn className="h-5 w-5" />
            ) : (
              <FaToggleOff className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {categorySettings.enabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Novos Pedidos</span>
            <button
              onClick={() => handleToggle(category, 'newOrders')}
              className={`p-1 rounded transition-colors ${
                categorySettings.newOrders 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {categorySettings.newOrders ? (
                <FaToggleOn className="h-4 w-4" />
              ) : (
                <FaToggleOff className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Estoque Baixo</span>
            <button
              onClick={() => handleToggle(category, 'lowStock')}
              className={`p-1 rounded transition-colors ${
                categorySettings.lowStock 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {categorySettings.lowStock ? (
                <FaToggleOn className="h-4 w-4" />
              ) : (
                <FaToggleOff className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Relatórios de Vendas</span>
            <button
              onClick={() => handleToggle(category, 'salesReports')}
              className={`p-1 rounded transition-colors ${
                categorySettings.salesReports 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {categorySettings.salesReports ? (
                <FaToggleOn className="h-4 w-4" />
              ) : (
                <FaToggleOff className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Alertas do Sistema</span>
            <button
              onClick={() => handleToggle(category, 'systemAlerts')}
              className={`p-1 rounded transition-colors ${
                categorySettings.systemAlerts 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {categorySettings.systemAlerts ? (
                <FaToggleOn className="h-4 w-4" />
              ) : (
                <FaToggleOff className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin" 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Configurações de Notificações</h1>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Tipos de Notificação */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FaBell className="h-5 w-5 text-blue-600 mr-3" />
              Tipos de Notificação
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <NotificationTypeCard
                title="Notificações por Email"
                icon={FaEnvelope}
                description="Receba notificações por email"
                category="email"
                settings={settings.email}
              />
              
              <NotificationTypeCard
                title="Notificações Push"
                icon={FaMobile}
                description="Notificações no navegador"
                category="push"
                settings={settings.push}
              />
              
              <NotificationTypeCard
                title="Notificações Desktop"
                icon={FaDesktop}
                description="Notificações na área de trabalho"
                category="desktop"
                settings={settings.desktop}
              />
            </div>
          </div>

          {/* Configurações Gerais */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FaCog className="h-5 w-5 text-blue-600 mr-3" />
              Configurações Gerais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frequência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência de Notificações
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="immediate">Imediata</option>
                  <option value="hourly">A cada hora</option>
                  <option value="daily">Diária</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>

              {/* Horário Silencioso */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Horário Silencioso
                  </label>
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled } 
                    }))}
                    className={`p-1 rounded transition-colors ${
                      settings.quietHours.enabled 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {settings.quietHours.enabled ? (
                      <FaToggleOn className="h-4 w-4" />
                    ) : (
                      <FaToggleOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {settings.quietHours.enabled && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, start: e.target.value } 
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-500">até</span>
                    <input
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, end: e.target.value } 
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview de Notificações */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FaBell className="h-5 w-5 text-blue-600 mr-3" />
              Preview de Notificações
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <FaCheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Novo Pedido Recebido</h4>
                  <p className="text-sm text-green-700">Pedido #1234 de R$ 89,90 foi realizado</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Estoque Baixo</h4>
                  <p className="text-sm text-yellow-700">Produto "Aventuras Fantásticas" com apenas 3 unidades</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <FaInfoCircle className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Relatório Diário</h4>
                  <p className="text-sm text-blue-700">Vendas de hoje: R$ 1.250,00 (15 pedidos)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
