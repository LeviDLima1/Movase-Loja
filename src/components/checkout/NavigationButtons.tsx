import React from 'react';

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
  const isFirstStep = currentStep === 'dados-pessoais';
  const isLastStep = currentStep === 'confirmacao';

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
      <button
        type="button"
        onClick={onPrevStep}
        disabled={isFirstStep}
        className={`px-6 py-3 text-base rounded-lg font-medium transition-colors ${
          isFirstStep
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
        }`}
      >
        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      {isLastStep ? (
        <button
          type="submit"
          disabled={isProcessing}
          onClick={onSubmit}
          className="px-8 py-3 text-base bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Finalizar Compra
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNextStep}
          className="px-8 py-3 text-base bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          Próximo
          <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
