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
    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8">
      <button
        type="button"
        onClick={onPrevStep}
        disabled={isFirstStep}
        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors ${
          isFirstStep
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      {isLastStep ? (
        <button
          type="submit"
          disabled={isProcessing}
          onClick={onSubmit}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
              Processando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="px-6 sm:px-8 py-2 sm:py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors flex items-center justify-center"
        >
          Próximo
          <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
