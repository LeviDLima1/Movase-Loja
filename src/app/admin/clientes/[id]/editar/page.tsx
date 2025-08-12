'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatCPF, formatPhone, formatCEP } from '@/lib/utils';

interface ClienteForm {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  observacoes: string;
  status: 'ativo' | 'inativo';
}

interface FormErrors {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
}

// Mock data para cliente específico
const mockCliente = {
  id: '1',
  nome: 'João Silva',
  email: 'joao.silva@email.com',
  cpf: '123.456.789-00',
  telefone: '(11) 98765-4321',
  endereco: {
    cep: '01234-567',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    uf: 'SP'
  },
  dataCadastro: '2024-01-15T10:30:00',
  status: 'ativo',
  observacoes: 'Cliente fiel, sempre compra livros de ficção. Prefere entrega express.',
  totalCompras: 5,
  valorTotal: 1245.80,
  ultimaCompra: '2024-01-15T10:30:00',
  mediaTicket: 249.16,
  categoria: 'Cliente Fiel'
};

export default function EditarCliente({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [clienteId, setClienteId] = useState('');

  const [formData, setFormData] = useState<ClienteForm>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: ''
    },
    observacoes: '',
    status: 'ativo'
  });

  // Resolver params
  useEffect(() => {
    const resolveParams = async () => {
      const paramsData = await params;
      setResolvedParams(paramsData);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    const id = resolvedParams.id;
    setClienteId(id);
    
    // Simular carregamento dos dados do cliente
    const carregarCliente = async () => {
      setLoading(true);
      try {
        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Em produção, aqui você faria uma chamada para a API
        setFormData({
          nome: mockCliente.nome,
          email: mockCliente.email,
          cpf: mockCliente.cpf,
          telefone: mockCliente.telefone,
          endereco: mockCliente.endereco,
          observacoes: mockCliente.observacoes,
          status: mockCliente.status as 'ativo' | 'inativo'
        });
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
        addErrorNotification('Erro ao Carregar', 'Erro ao carregar dados do cliente');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarCliente();
    }
  }, [resolvedParams, addErrorNotification]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleEnderecoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }));

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const buscarCep = async (cep: string) => {
    if (cep.length !== 8) return;

    setBuscandoCep(true);
    try {
      // Simular busca de CEP (aqui você integraria com a API dos Correios)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - em produção, isso viria da API
      const mockEndereco = {
        logradouro: 'Rua das Flores',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      };

      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          logradouro: mockEndereco.logradouro,
          bairro: mockEndereco.bairro,
          cidade: mockEndereco.cidade,
          uf: mockEndereco.uf
        }
      }));

      addSuccessNotification('CEP Encontrado', 'Endereço preenchido automaticamente');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      addErrorNotification('Erro ao Buscar CEP', 'Não foi possível encontrar o CEP informado');
    } finally {
      setBuscandoCep(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação do CPF
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
    }

    // Validação do telefone
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve estar no formato (XX) XXXXX-XXXX';
    }

    // Validação do CEP
    if (!formData.endereco.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!/^\d{5}-\d{3}$/.test(formData.endereco.cep)) {
      newErrors.cep = 'CEP deve estar no formato XXXXX-XXX';
    }

    // Validação do logradouro
    if (!formData.endereco.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }

    // Validação do número
    if (!formData.endereco.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    // Validação do bairro
    if (!formData.endereco.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    // Validação da cidade
    if (!formData.endereco.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    // Validação da UF
    if (!formData.endereco.uf.trim()) {
      newErrors.uf = 'UF é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addErrorNotification('Erro de Validação', 'Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      // Simular atualização do cliente
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addSuccessNotification('Cliente Atualizado', 'Cliente atualizado com sucesso!');
      router.push(`/admin/clientes/${clienteId}`);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      addErrorNotification('Erro ao Atualizar', 'Erro ao atualizar o cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarCPF = (value: string) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (value: string) => {
    const telefone = value.replace(/\D/g, '');
    if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 10) {
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  const formatarCEP = (value: string) => {
    const cep = value.replace(/\D/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  if (loading && !formData.nome) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/admin/clientes/${clienteId}`}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Pessoais */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FaUser className="h-5 w-5 mr-2 text-blue-600" />
              Informações Pessoais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.nome ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Digite o nome completo"
                />
                {errors.nome && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.nome}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', formatarCPF(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cpf ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.cpf}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', formatarTelefone(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.telefone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
                {errors.telefone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.telefone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FaMapMarkerAlt className="h-5 w-5 mr-2 text-green-600" />
              Endereço
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.endereco.cep}
                    onChange={(e) => {
                      const formattedCep = formatarCEP(e.target.value);
                      handleEnderecoChange('cep', formattedCep);
                      if (formattedCep.length === 9) {
                        buscarCep(formattedCep.replace('-', ''));
                      }
                    }}
                    className={`flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.cep ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {buscandoCep && (
                    <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {errors.cep && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.cep}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logradouro *
                </label>
                <input
                  type="text"
                  value={formData.endereco.logradouro}
                  onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.logradouro ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Rua, Avenida, etc."
                />
                {errors.logradouro && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.logradouro}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  value={formData.endereco.numero}
                  onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.numero ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="123"
                />
                {errors.numero && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.numero}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  value={formData.endereco.complemento}
                  onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Apto, Casa, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={formData.endereco.bairro}
                  onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.bairro ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Centro, Jardins, etc."
                />
                {errors.bairro && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.bairro}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.endereco.cidade}
                  onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cidade ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="São Paulo"
                />
                {errors.cidade && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.cidade}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UF *
                </label>
                <select
                  value={formData.endereco.uf}
                  onChange={(e) => handleEnderecoChange('uf', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.uf ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
                {errors.uf && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="h-3 w-3 mr-1" />
                    {errors.uf}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FaUser className="h-5 w-5 mr-2 text-purple-600" />
              Informações Adicionais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Observações sobre o cliente..."
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href={`/admin/clientes/${clienteId}`}
              className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <FaSave className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
