import React from 'react';
import { STEP_CONFIG } from '../constants';
import { UserAddress } from '../../../types/cart';
import { CorreiosResponse } from '../../../correios';
import { CheckCircle, User, MapPin, Truck, CreditCard, Shield } from 'lucide-react';

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
      title: 'Dados Pessoais',
      icon: <User className="w-5 h-5" />,
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-50 to-orange-50',
      items: [
        { label: 'Nome', value: customerData.name },
        { label: 'E-mail', value: customerData.email },
        { label: 'CPF', value: customerData.cpf },
        { label: 'Telefone', value: customerData.phone }
      ]
    },
    {
      title: 'Endereço de Entrega',
      icon: <MapPin className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
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
      title: 'Frete Selecionado',
      icon: <Truck className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
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
      title: 'Método de Pagamento',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50',
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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 text-white">
        <div className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 sm:mr-4 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">{config.title}</h3>
            <p className="text-green-100 mt-1 text-base sm:text-lg">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          {dadosConfirmacao.map((secao, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header da seção */}
              <div className={`bg-gradient-to-r ${secao.color} p-4 text-white`}>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    {secao.icon}
                  </div>
                  <h4 className="text-lg font-bold">{secao.title}</h4>
                </div>
              </div>
              
              {/* Conteúdo da seção */}
              <div className={`bg-gradient-to-r ${secao.bgColor} p-6`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {secao.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm font-medium text-gray-700">{item.label}:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informações finais */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-900 mb-1">Pronto para Finalizar!</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Revise todos os dados acima. Após confirmar, seu pedido será processado 
                e você receberá uma confirmação por e-mail. Obrigado por escolher a MOVASE!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoStep;
