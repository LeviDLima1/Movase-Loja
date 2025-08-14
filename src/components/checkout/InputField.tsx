import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  colSpan?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Componente de campo de input otimizado com React.memo
const InputField = React.memo(({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  required = false, 
  maxLength, 
  className = '',
  colSpan = '',
  error,
  success = false,
  icon,
  disabled = false
}: InputFieldProps) => (
  <div className={colSpan}>
                  <label className="block text-xs sm:text-sm xl:text-base font-semibold text-gray-700 mb-1.5 sm:mb-2 xl:mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    
    <div className="relative">
      {icon && (
        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-2.5 sm:px-3 xl:px-4 xl:pl-10 py-2 sm:py-2.5 xl:py-3 text-xs sm:text-sm xl:text-base border-2 rounded-xl transition-all duration-300
          focus:ring-2 focus:ring-offset-0 focus:outline-none
          ${icon ? 'pl-8 sm:pl-10' : ''}
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
            : success 
              ? 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50'
              : 'border-gray-300 focus:ring-red-500 focus:border-red-500 hover:border-gray-400'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
      />
      
      {/* Ícone de sucesso */}
      {success && !icon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      )}
      
      {/* Ícone de erro */}
      {error && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
      )}
    </div>
    
    {/* Mensagem de erro */}
    {error && (
      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
    
    {/* Contador de caracteres */}
    {maxLength && (
      <div className="mt-1 text-xs text-gray-500 text-right">
        {value.length}/{maxLength}
      </div>
    )}
  </div>
));

InputField.displayName = 'InputField';

export default InputField;
