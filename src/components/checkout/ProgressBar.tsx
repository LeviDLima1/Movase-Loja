import React from 'react';
import { CHECKOUT_STEPS, STEP_CONFIG } from './constants';
import { 
  User, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface ProgressBarProps {
  currentStep: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'dados-pessoais':
        return <User className="w-5 h-5" />;
      case 'endereco':
        return <MapPin className="w-5 h-5" />;
      case 'frete':
        return <Truck className="w-5 h-5" />;
      case 'pagamento':
        return <CreditCard className="w-5 h-5" />;
      case 'confirmacao':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Versão Desktop - Lateral Esquerda */}
      <div className="hidden lg:flex flex-col w-56 xl:w-64 2xl:w-72 pr-3 xl:pr-4 2xl:pr-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4 xl:p-6">
          <div className="flex items-center mb-6 xl:mb-8">
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-2 xl:mr-3">
              <svg className="w-4 h-4 xl:w-5 xl:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg xl:text-md font-bold text-gray-900">Progresso da Compra</h3>
              <p className="text-xs xl:text-sm text-gray-600">Acompanhe suas etapas</p>
            </div>
          </div>
          
          <div className="relative">
            {/* Linha vertical principal */}
            <div className="absolute top-6 bottom-0 left-[22px] w-1 bg-gradient-to-b from-red-500 via-orange-400 to-gray-200 rounded-full"></div>
            
            {CHECKOUT_STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = CHECKOUT_STEPS.findIndex(s => s.id === currentStep) > index;
              const stepConfig = STEP_CONFIG[step.id as keyof typeof STEP_CONFIG];
              
              return (
                <div key={step.id} className="relative">
                  <div className="flex items-start py-3 xl:py-4">
                    {/* Círculo do passo */}
                    <div className={`flex items-center justify-center w-10 h-10 xl:w-12 xl:h-12 rounded-full border-2 transition-all duration-300 flex-shrink-0 shadow-lg ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-green-200' 
                        : isActive 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 border-red-500 text-white shadow-red-200'
                          : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400 shadow-sm'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 xl:w-6 xl:h-6" />
                      ) : (
                        getStepIcon(step.id)
                      )}
                    </div>
                    
                    {/* Texto do passo */}
                    <div className="ml-3 xl:ml-4 flex-1 min-w-0">
                      <div className={`text-sm xl:text-md font-bold transition-colors ${
                        isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs xl:text-xs mt-1 transition-colors ${
                        isActive ? 'text-red-500' : isCompleted ? 'text-green-500' : 'text-gray-400'
                      }`}>
                        {stepConfig?.description || ''}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Versão Mobile - Horizontal */}
      <div className="lg:hidden mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {CHECKOUT_STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = CHECKOUT_STEPS.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 flex-shrink-0 shadow-lg ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-green-200' 
                        : isActive 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 border-red-500 text-white shadow-red-200'
                          : 'bg-white border-gray-300 text-gray-400 shadow-sm'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        getStepIcon(step.id)
                      )}
                    </div>
                    <div className={`text-xs font-bold mt-2 text-center transition-colors ${
                      isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < CHECKOUT_STEPS.length - 1 && (
                    <div className="flex-1 flex items-center justify-center px-2">
                      <div className={`h-1 flex-1 transition-colors rounded-full ${
                        isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                      }`} />
                      <ArrowRight className={`w-4 h-4 mx-1 transition-colors ${
                        isCompleted ? 'text-green-500' : 'text-gray-300'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Título da etapa atual no mobile */}
        <div className="mt-6 text-center">
          <div className="text-xl font-bold text-gray-900 mb-2">
            {STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]?.title || 'Checkout'}
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            {STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]?.description || ''}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
