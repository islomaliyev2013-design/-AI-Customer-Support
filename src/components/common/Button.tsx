import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'primary' | 'secondary' | 'danger' | 'glass' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    neon: 'neon-btn text-white font-semibold shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] border border-purple-400/30',
    primary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 border border-purple-500/20',
    secondary: 'bg-[#181B26] hover:bg-[#202535] text-slate-200 border border-white/10 hover:border-white/20',
    danger: 'bg-rose-600/90 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/25 border border-rose-500/30',
    glass: 'bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/15 hover:border-white/25',
    outline: 'border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
