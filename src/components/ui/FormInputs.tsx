import React, { InputHTMLAttributes, forwardRef, SelectHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Maximize2 } from 'lucide-react';

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ========================================
   Button Components
   ======================================== */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'info' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF0877]/50 focus:ring-offset-2 focus:ring-offset-[#050508]";

  const variants = {
    primary: "bg-gradient-to-br from-[#FF0877] to-[#E6006A] hover:shadow-[0_8px_32px_rgba(255,8,119,0.35)] text-white",
    secondary: "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1]",
    ghost: "text-zinc-500 hover:text-white hover:bg-white/[0.05]",
    danger: "bg-[#EF4444] hover:bg-[#DC2626] text-white",
    success: "bg-[#22C55E] hover:bg-[#16A34A] text-white",
    info: "bg-[#3B82F6] hover:bg-[#2563EB] text-white",
    warning: "bg-[#F59E0B] hover:bg-[#D97706] text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-3 text-sm rounded-xl",
    lg: "px-6 py-3.5 text-base rounded-xl",
  };

  return (
    <button
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  const baseStyle = "inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF0877]/50 focus:ring-offset-2 focus:ring-offset-[#050508] rounded-lg";

  const sizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  const variants = {
    ghost: "text-zinc-500 hover:text-white hover:bg-white/[0.05]",
    secondary: "text-zinc-500 bg-white/[0.05] hover:bg-white/[0.1]",
  };

  return (
    <button
      className={cn(baseStyle, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ========================================
   Input Components
   ======================================== */

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  showMaxButton?: boolean;
  onMaxClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, size = 'md', showMaxButton, onMaxClick, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base',
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`
              w-full bg-[#08080C] border rounded-xl text-white placeholder:text-zinc-600
              focus:outline-none focus:ring-2 focus:ring-[#FF0877]/50 focus:ring-offset-2 focus:ring-offset-[#050508] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizeClasses[size]}
              ${error ? 'border-red-500/[0.5]' : 'border-white/[0.1]'}
              ${showMaxButton ? 'pr-20' : ''}
              ${className}
            `}
            {...props}
          />
          {showMaxButton && (
            <button
              type="button"
              onClick={onMaxClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FF0877] bg-[#FF0877]/10 hover:bg-[#FF0877]/20 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0877]/50"
            >
              MAX
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-red-400 text-sm mt-2">{error}</p>
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
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full bg-[#08080C] border rounded-xl px-4 py-3 text-white
            focus:outline-none focus:ring-2 focus:ring-[#FF0877]/50 focus:ring-offset-2 focus:ring-offset-[#050508] transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/[0.5]' : 'border-white/[0.1]'}
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
          <p id={errorId} className="text-red-400 text-sm mt-2">{error}</p>
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
  ({ label, error, balance, symbol, onMaxClick, className = '', id, ...props }, ref) => {
    const inputId = id || `amount-input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`
              w-full bg-[#08080C] border rounded-xl px-4 py-3 pr-24 text-white
              placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FF0877]/50 focus:ring-offset-2 focus:ring-offset-[#050508]
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500/[0.5]' : 'border-white/[0.1]'}
              ${className}
            `}
            {...props}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {symbol && (
              <span className="text-zinc-500 text-sm">{symbol}</span>
            )}
            {onMaxClick && (
              <button
                type="button"
                onClick={onMaxClick}
                className="text-xs font-bold text-[#FF0877] bg-[#FF0877]/10 hover:bg-[#FF0877]/20 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0877]/50"
              >
                MAX
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          {error && (
            <p id={errorId} className="text-red-400 text-sm">{error}</p>
          )}
          {!error && balance !== undefined && (
            <p className="text-zinc-600 text-sm ml-auto">
              Balance: <span className="text-zinc-400">{balance}</span>
            </p>
          )}
        </div>
      </div>
    );
  }
);

AmountInput.displayName = 'AmountInput';
