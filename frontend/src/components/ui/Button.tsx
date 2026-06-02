'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-fleet-accent hover:bg-blue-600 text-white',
    secondary: 'bg-fleet-card border border-fleet-border hover:border-fleet-accent/50 text-white',
    ghost: 'hover:bg-fleet-card text-fleet-muted hover:text-white',
    danger: 'bg-fleet-danger/20 text-fleet-danger hover:bg-fleet-danger/30 border border-fleet-danger/30',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' };

  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}
