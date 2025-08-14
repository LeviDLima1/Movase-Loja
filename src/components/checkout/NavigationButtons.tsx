import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: string;
  isProcessing: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isProcessing,
  onPrevStep,
  onNextStep,
  onSubmit
}) => {
  const getStepNumber = (step: string) => {
    const steps = ['dados-pessoais', 'endereco', 'frete', 'pagamento', 'confirmacao'];
    return steps.indexOf(step) + 1;
  };

  const isFirstStep = currentStep === 'dados-pessoais';
  const isLastStep = currentStep === 'confirmacao';

  return (
    <div className="space-y-3 sm:space-y-4 xl:space-y-6">
      {/* Botões de Navegação */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 xl:gap-6 pt-4 sm:pt-6 xl:pt-8 border-t-2 border-gray-200">
        {/* Botão Voltar */}
        <button
          type="button"
          onClick={onPrevStep}
          disabled={isFirstStep}
          className={`group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 xl:px-8 py-2.5 sm:py-3 xl:py-4 text-sm sm:text-base xl:text-lg rounded-xl font-bold transition-all duration-300 ${
            isFirstStep
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg cursor-pointer transform hover:-translate-y-1'
          }`}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        {/* Botão Próximo/Finalizar */}
        {isLastStep ? (
          <button
            type="submit"
            disabled={isProcessing}
            onClick={onSubmit}
            className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 xl:px-10 py-2.5 sm:py-3 xl:py-4 text-sm sm:text-base xl:text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Finalizar Compra
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNextStep}
            className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 xl:px-10 py-2.5 sm:py-3 xl:py-4 text-sm sm:text-base xl:text-lg bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Próximo Passo
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Indicador de Progresso */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="flex items-center gap-3 text-base font-semibold text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
            <span>Passo {getStepNumber(currentStep)} de 5</span>
          </div>
          <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
          <div className="text-sm text-gray-500">
            {currentStep === 'dados-pessoais' && 'Dados Pessoais'}
            {currentStep === 'endereco' && 'Endereço'}
            {currentStep === 'frete' && 'Frete'}
            {currentStep === 'pagamento' && 'Pagamento'}
            {currentStep === 'confirmacao' && 'Confirmação'}
          </div>
        </div>
      </div>

      {/* Informações de segurança */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Ambiente 100% Seguro
            </p>
            <p className="text-xs text-blue-600">
              Seus dados estão protegidos com criptografia SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationButtons;
