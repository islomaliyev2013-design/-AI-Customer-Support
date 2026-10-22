import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  themeVariant?: 'glass' | 'dashboard';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  isPassword = false,
  type = 'text',
  themeVariant = 'glass',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const bgStyles =
    themeVariant === 'glass'
      ? 'bg-black/40 border-purple-500/25 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 placeholder:text-slate-500 text-white'
      : 'bg-[#121520] border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder:text-slate-500 text-white';

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>{label}</span>
          {error && <span className="text-rose-400 text-xs font-normal">{error}</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          type={effectiveType}
          className={`w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 outline-none border ${bgStyles} ${
            leftIcon ? 'pl-10' : ''
          } ${isPassword ? 'pr-10' : ''} ${
            error ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : ''
          } ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
};
