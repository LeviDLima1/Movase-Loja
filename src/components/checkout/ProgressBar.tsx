import React from 'react';
import { CHECKOUT_STEPS, STEP_CONFIG } from './constants';

interface ProgressBarProps {
  currentStep: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <>
      {/* Versão Desktop - Lateral Esquerda */}
      <div className="hidden lg:flex flex-col space-y-4 w-64 pr-8">
        {CHECKOUT_STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = CHECKOUT_STEPS.findIndex(s => s.id === currentStep) > index;
          const stepConfig = STEP_CONFIG[step.id as keyof typeof STEP_CONFIG];
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Linha vertical conectando os passos */}
              {index > 0 && (
                <div className={`w-0.5 h-8 ml-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
              
              <div className="flex items-center">
                {/* Círculo do passo */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? '✓' : step.icon}
                </div>
                
                {/* Texto do passo */}
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-xs ${
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

      {/* Versão Mobile - Horizontal */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between space-x-2">
          {CHECKOUT_STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = CHECKOUT_STEPS.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                }">
                  {isCompleted ? '✓' : step.icon}
                </div>
                {index < CHECKOUT_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        {/* Título da etapa atual no mobile */}
        <div className="mt-4 text-center">
          <div className="text-sm font-medium text-gray-900">
            {STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]?.title || 'Checkout'}
          </div>
          <div className="text-xs text-gray-500">
            {STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]?.description || ''}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
