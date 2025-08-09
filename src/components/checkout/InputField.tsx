import React from 'react';

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
  colSpan = ''
}: InputFieldProps) => (
  <div className={colSpan}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${className}`}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
    />
  </div>
));

InputField.displayName = 'InputField';

export default InputField;
