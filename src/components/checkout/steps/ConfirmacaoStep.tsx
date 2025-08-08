import React from 'react';
import { STEP_CONFIG } from '../constants';
import { UserAddress } from '../../../types/cart';
import { CorreiosResponse } from '../../../correios';

interface ConfirmacaoStepProps {
  customerData: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
  address: UserAddress;
  selectedFrete: CorreiosResponse | null;
  paymentMethod: 'credit_card' | 'boleto' | 'pix';
  cardData: {
    number: string;
    expMonth: string;
    expYear: string;
    securityCode: string;
    holderName: string;
    holderBirthDate: string;
    holderCPF: string;
  };
}

const ConfirmacaoStep: React.FC<ConfirmacaoStepProps> = ({ 
  customerData, 
  address, 
  selectedFrete, 
  paymentMethod, 
  cardData 
}) => {
  const config = STEP_CONFIG['confirmacao'];

  const dadosConfirmacao = [
    {
      title: '👤 Dados Pessoais',
      items: [
        { label: 'Nome', value: customerData.name },
        { label: 'E-mail', value: customerData.email },
        { label: 'CPF', value: customerData.cpf },
        { label: 'Telefone', value: customerData.phone }
      ]
    },
    {
      title: '📍 Endereço de Entrega',
      items: [
        { 
          label: 'Endereço', 
          value: `${address.logradouro}, ${address.numero}${address.complemento ? ` - ${address.complemento}` : ''}` 
        },
        { label: 'Bairro', value: address.bairro },
        { label: 'Cidade/Estado', value: `${address.cidade} - ${address.uf}` },
        { label: 'CEP', value: address.cep }
      ]
    },
    {
      title: '🚚 Frete Selecionado',
      items: [
        { 
          label: 'Serviço', 
          value: selectedFrete ? (selectedFrete.Codigo === '04014' ? 'SEDEX' : 'PAC') : 'Não selecionado' 
        },
        { 
          label: 'Prazo', 
          value: selectedFrete ? `${selectedFrete.PrazoEntrega} dias úteis` : 'Não calculado' 
        },
        { 
          label: 'Valor', 
          value: selectedFrete ? `R$ ${selectedFrete.Valor.replace(',', '.')}` : 'Não calculado' 
        }
      ]
    },
    {
      title: '💳 Método de Pagamento',
      items: [
        { 
          label: 'Forma', 
          value: paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 
                 paymentMethod === 'boleto' ? 'Boleto Bancário' : 'PIX' 
        },
        ...(paymentMethod === 'credit_card' ? [{
          label: 'Cartão',
          value: `**** **** **** ${cardData.number.slice(-4)}`
        }] : [])
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 sm:p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-${config.color}-100 rounded-full flex items-center justify-center mr-2 sm:mr-3`}>
            <span className="text-sm sm:text-base">{config.icon}</span>
          </div>
          {config.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {dadosConfirmacao.map((secao, index) => (
            <div key={index}>
              <h4 className="font-medium text-gray-900 mb-3">{secao.title}</h4>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  {secao.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <span className="text-gray-600">{item.label}:</span>
                      <span className="ml-2 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoStep;
