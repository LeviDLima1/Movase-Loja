"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { calcularFrete, CorreiosResponse } from '../../correios';
import { 
  processarPagamentoCartao, 
  gerarBoleto, 
  gerarPIX, 
  validarCPF,
  PagSeguroOrder 
} from '../../services/pagseguro';
import { buscarEnderecoPorCEP, formatarCEP } from '../../services/viacep';
import FormaEntregaSelector from '../FormaEntregaSelector';
import { UserAddress } from '../../types/cart';

// Componentes do checkout
import ProgressBar from './ProgressBar';
import NavigationButtons from './NavigationButtons';
import DadosPessoaisStep from './steps/DadosPessoaisStep';
import EnderecoStep from './steps/EnderecoStep';
import PagamentoStep from './steps/PagamentoStep';
import ConfirmacaoStep from './steps/ConfirmacaoStep';

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
  onFreteChange?: (frete: CorreiosResponse | null) => void;
}

type CheckoutStep = 'dados-pessoais' | 'endereco' | 'frete' | 'pagamento' | 'confirmacao';

export default function CheckoutForm({ onSuccess, onFreteChange }: CheckoutFormProps) {
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  
  // Estado da etapa atual
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('dados-pessoais');
  
  // Estados do formulário
  const [address, setAddress] = useState<UserAddress>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'boleto' | 'pix'>('credit_card');
  const [cardData, setCardData] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    securityCode: '',
    holderName: '',
    holderBirthDate: '',
    holderCPF: ''
  });

  // Estados do frete
  const [freteOptions, setFreteOptions] = useState<CorreiosResponse[]>([]);
  const [selectedFrete, setSelectedFrete] = useState<CorreiosResponse | null>(null);
  const [isCalculatingFrete, setIsCalculatingFrete] = useState(false);
  const [cepCalculado, setCepCalculado] = useState<string>('');
  const [isBuscandoEndereco, setIsBuscandoEndereco] = useState(false);

  // Estados do pagamento
  const [isProcessing, setIsProcessing] = useState(false);

  const calcularFreteCEP = useCallback(async () => {
    if (address.cep.length !== 8) return;

    setIsCalculatingFrete(true);
    try {
      const pesoTotal = items.reduce((sum, item) => sum + (item.quantity * 0.5), 0);
      const opcoes = await calcularFrete(address.cep, pesoTotal);
      setFreteOptions(opcoes);
      
      if (opcoes.length > 0) {
        setSelectedFrete(opcoes[0]);
      }
      
      setCepCalculado(address.cep);
    } catch (error) {
      showToast('Erro ao calcular frete. Verifique o CEP.', 'error');
    } finally {
      setIsCalculatingFrete(false);
    }
  }, [address.cep, items, showToast]);

  // Calcular frete quando CEP mudar
  useEffect(() => {
    if (address.cep.length === 8 && !isCalculatingFrete && cepCalculado !== address.cep) {
      calcularFreteCEP();
    }
  }, [calcularFreteCEP, isCalculatingFrete, cepCalculado]);

  // Notificar mudança no frete selecionado
  useEffect(() => {
    if (onFreteChange && selectedFrete) {
      onFreteChange(selectedFrete);
    }
  }, [selectedFrete, onFreteChange]);

  const handleAddressChange = useCallback((field: keyof UserAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    
    if (field === 'cep') {
      setFreteOptions([]);
      setSelectedFrete(null);
      setCepCalculado('');
      
      if (value.length === 8) {
        buscarEnderecoAutomatico(value);
      }
    }
  }, []);

  const buscarEnderecoAutomatico = useCallback(async (cep: string) => {
    if (cep.length !== 8) return;
    
    setIsBuscandoEndereco(true);
    try {
      const endereco = await buscarEnderecoPorCEP(cep);
      
      setAddress(prev => ({
        ...prev,
        cep: formatarCEP(endereco.cep),
        logradouro: endereco.logradouro,
        bairro: endereco.bairro,
        cidade: endereco.localidade,
        uf: endereco.uf
      }));
      
      showToast('Endereço preenchido automaticamente!', 'success');
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      showToast('CEP não encontrado. Preencha manualmente.', 'error');
    } finally {
      setIsBuscandoEndereco(false);
    }
  }, [showToast]);

  const handleCustomerChange = useCallback((field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCardChange = useCallback((field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePaymentMethodChange = useCallback((method: 'credit_card' | 'boleto' | 'pix') => {
    setPaymentMethod(method);
  }, []);

  // Validações por etapa
  const validateDadosPessoais = useCallback((): boolean => {
    if (!customerData.name || !customerData.email || !customerData.cpf || !customerData.phone) {
      showToast('Preencha todos os dados pessoais', 'error');
      return false;
    }

    if (!validarCPF(customerData.cpf)) {
      showToast('CPF inválido', 'error');
      return false;
    }

    return true;
  }, [customerData, showToast]);

  const validateEndereco = useCallback((): boolean => {
    if (!address.cep || !address.logradouro || !address.numero || !address.bairro || !address.cidade || !address.uf) {
      showToast('Preencha todos os dados do endereço', 'error');
      return false;
    }
    return true;
  }, [address, showToast]);

  const validateFrete = useCallback((): boolean => {
    if (!selectedFrete) {
      showToast('Selecione uma opção de frete', 'error');
      return false;
    }
    return true;
  }, [selectedFrete, showToast]);

  const validatePagamento = useCallback((): boolean => {
    if (paymentMethod === 'credit_card') {
      if (!cardData.number || !cardData.expMonth || !cardData.expYear || !cardData.securityCode || !cardData.holderName) {
        showToast('Preencha todos os dados do cartão', 'error');
        return false;
      }
    }
    return true;
  }, [paymentMethod, cardData, showToast]);

  // Navegação entre etapas
  const nextStep = useCallback(() => {
    let isValid = false;
    
    switch (currentStep) {
      case 'dados-pessoais':
        isValid = validateDadosPessoais();
        if (isValid) setCurrentStep('endereco');
        break;
      case 'endereco':
        isValid = validateEndereco();
        if (isValid) setCurrentStep('frete');
        break;
      case 'frete':
        isValid = validateFrete();
        if (isValid) setCurrentStep('pagamento');
        break;
      case 'pagamento':
        isValid = validatePagamento();
        if (isValid) setCurrentStep('confirmacao');
        break;
    }
  }, [currentStep, validateDadosPessoais, validateEndereco, validateFrete, validatePagamento]);

  const prevStep = useCallback(() => {
    switch (currentStep) {
      case 'endereco':
        setCurrentStep('dados-pessoais');
        break;
      case 'frete':
        setCurrentStep('endereco');
        break;
      case 'pagamento':
        setCurrentStep('frete');
        break;
      case 'confirmacao':
        setCurrentStep('pagamento');
        break;
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePagamento()) return;

    setIsProcessing(true);
    try {
      const orderData: Omit<PagSeguroOrder, 'charges'> = {
        reference_id: `PED-${Date.now()}`,
        customer: {
          name: customerData.name,
          email: customerData.email,
          taxId: customerData.cpf.replace(/\D/g, ''),
          phones: [{
            country: '55',
            area: customerData.phone.substring(0, 2),
            number: customerData.phone.substring(2).replace(/\D/g, '')
          }],
          address: {
            street: address.logradouro,
            number: address.numero,
            complement: address.complemento,
            district: address.bairro,
            city: address.cidade,
            state: address.uf,
            country: 'BR',
            postalCode: address.cep
          }
        },
        items: items.map(item => ({
          id: item.id.toString(),
          description: item.titulo,
          amount: Math.round(item.price * 100),
          quantity: item.quantity,
          weight: 500
        })),
        shipping: {
          address: {
            street: address.logradouro,
            number: address.numero,
            complement: address.complemento,
            district: address.bairro,
            city: address.cidade,
            state: address.uf,
            country: 'BR',
            postalCode: address.cep
          }
        }
      };

      let response;

      switch (paymentMethod) {
        case 'credit_card':
          response = await processarPagamentoCartao(orderData, {
            number: cardData.number,
            expMonth: cardData.expMonth,
            expYear: cardData.expYear,
            securityCode: cardData.securityCode,
            holderName: cardData.holderName,
            holderBirthDate: cardData.holderBirthDate,
            holderTaxId: cardData.holderCPF
          });
          break;

        case 'boleto':
          response = await gerarBoleto(orderData);
          break;

        case 'pix':
          response = await gerarPIX(orderData);
          break;

        default:
          throw new Error('Método de pagamento inválido');
      }

      showToast('Pedido realizado com sucesso!', 'success');
      clearCart();
      onSuccess(response.id);

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      showToast('Erro ao processar pagamento. Tente novamente.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [validatePagamento, customerData, address, items, paymentMethod, cardData, showToast, clearCart, onSuccess]);

  // Renderizar etapa atual
  const renderCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 'dados-pessoais':
        return (
          <DadosPessoaisStep
            customerData={customerData}
            onCustomerChange={handleCustomerChange}
          />
        );

      case 'endereco':
        return (
          <EnderecoStep
            address={address}
            onAddressChange={handleAddressChange}
            isBuscandoEndereco={isBuscandoEndereco}
            isCalculatingFrete={isCalculatingFrete}
          />
        );

      case 'frete':
        return (
          <FormaEntregaSelector
            opcoes={freteOptions}
            selecionado={selectedFrete}
            onSelecionar={setSelectedFrete}
            isLoading={isCalculatingFrete}
          />
        );

      case 'pagamento':
        return (
          <PagamentoStep
            paymentMethod={paymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
            cardData={cardData}
            onCardChange={handleCardChange}
          />
        );

      case 'confirmacao':
        return (
          <ConfirmacaoStep
            customerData={customerData}
            address={address}
            selectedFrete={selectedFrete}
            paymentMethod={paymentMethod}
            cardData={cardData}
          />
        );

      default:
        return null;
    }
  }, [currentStep, customerData, address, freteOptions, selectedFrete, isCalculatingFrete, isBuscandoEndereco, paymentMethod, cardData, handleCustomerChange, handleAddressChange, handlePaymentMethodChange, handleCardChange]);

  return (
    <div className="lg:flex lg:space-x-8">
      {/* Barra de Progresso Lateral */}
      <ProgressBar currentStep={currentStep} />

      {/* Conteúdo Principal */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Conteúdo da Etapa Atual */}
          {renderCurrentStep()}

          {/* Botões de Navegação */}
          <NavigationButtons
            currentStep={currentStep}
            isProcessing={isProcessing}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onSubmit={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}
