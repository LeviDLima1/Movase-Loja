import React from 'react';
import { CHECKOUT_STEPS, STEP_CONFIG } from './constants';

interface ProgressBarProps {
  currentStep: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <>
      {/* Versão Desktop - Lateral Esquerda */}
      <div className="hidden lg:flex flex-col w-56 xl:w-64 pr-4 xl:pr-8">
        <div className="relative">
          {/* Linha vertical principal - posicionada exatamente no centro dos círculos */}
          <div className="absolute top-5 bottom-0 w-0.5 h-[85%] bg-gray-300 max-xl:left-[15px] min-xl:left-[19px]"></div>
          
          {CHECKOUT_STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = CHECKOUT_STEPS.findIndex(s => s.id === currentStep) > index;
            const stepConfig = STEP_CONFIG[step.id as keyof typeof STEP_CONFIG];
            
            return (
              <div key={step.id} className="relative">
                <div className="flex items-start py-4 xl:py-5">
                  {/* Círculo do passo */}
                  <div className={`flex items-center justify-center w-8 h-8 xl:w-10 xl:h-10 rounded-full border-2 transition-colors flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? '✓' : step.icon}
                  </div>
                  
                  {/* Texto do passo */}
                  <div className="ml-4 xl:ml-5 flex-1 min-w-0">
                    <div className={`text-sm xl:text-base font-medium ${
                      isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs xl:text-sm mt-1 ${
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

      {/* Versão Mobile - Horizontal */}
      <div className="lg:hidden mb-6 sm:mb-8 mx-auto">
        <div className="flex items-center justify-between space-x-2 sm:space-x-3">
          {CHECKOUT_STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = CHECKOUT_STEPS.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                }">
                  {isCompleted ? '✓' : step.icon}
                </div>
                {index < CHECKOUT_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 sm:mx-3 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        {/* Título da etapa atual no mobile */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="text-base sm:text-lg font-medium text-gray-900">
            {STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]?.title || 'Checkout'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]?.description || ''}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
