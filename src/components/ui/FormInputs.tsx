import React, { InputHTMLAttributes, forwardRef, SelectHTMLAttributes } from 'react';
import { Maximize2 } from 'lucide-react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  showMaxButton?: boolean;
  onMaxClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, size = 'md', showMaxButton, onMaxClick, className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`
              w-full bg-[#0A0B10] border rounded-xl text-white placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizeClasses[size]}
              ${error ? 'border-red-500/50' : 'border-white/10'}
              ${showMaxButton ? 'pr-20' : ''}
              ${className}
            `}
            {...props}
          />
          {showMaxButton && (
            <button
              type="button"
              onClick={onMaxClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#E6007A] bg-[#E6007A]/10 hover:bg-[#E6007A]/20 px-2 py-1 rounded transition-colors"
            >
              MAX
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-400 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-[#0A0B10] border rounded-xl px-4 py-3 text-white
            focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50' : 'border-white/10'}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface AmountInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  balance?: string;
  symbol?: string;
  onMaxClick?: () => void;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ label, error, balance, symbol, onMaxClick, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`
              w-full bg-[#0A0B10] border rounded-xl pl-4 pr-24 py-3 text-white
              placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500/50' : 'border-white/10'}
              ${className}
            `}
            {...props}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {symbol && (
              <span className="text-slate-400 text-sm">{symbol}</span>
            )}
            {onMaxClick && (
              <button
                type="button"
                onClick={onMaxClick}
                className="text-xs font-bold text-[#E6007A] bg-[#E6007A]/10 hover:bg-[#E6007A]/20 px-2 py-1 rounded transition-colors"
              >
                MAX
              </button>
            )}
          </div>
        </div>
        {balance !== undefined && (
          <div className="flex justify-between items-center mt-2">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <p className="text-slate-500 text-sm ml-auto">
              Balance: <span className="text-slate-300">{balance}</span>
            </p>
          </div>
        )}
      </div>
    );
  }
);

AmountInput.displayName = 'AmountInput';
