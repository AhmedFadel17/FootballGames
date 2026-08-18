import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'launch' | 'light' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingText?: string;
  wrapperClassName?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      isLoading = false,
      loadingText = 'Processing...',
      className = '',
      wrapperClassName = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-headline font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:pointer-events-none select-none';

    const variants = {
      primary: 'bg-gradient-to-r from-[#7818c6] to-[#ddb7ff] text-white hover:brightness-110 shadow-lg rounded-md',
      secondary: 'glass-panel border border-white/10 text-white hover:bg-white/5 rounded-md',
      accent: 'bg-[#3da9fc] text-[#0b1326] shadow-[0_0_20px_rgba(61,169,252,0.2)] hover:shadow-[0_0_40px_rgba(61,169,252,0.4)] hover:brightness-110 rounded-xl',

      launch: 'bg-gradient-to-r from-accent-cyan/80 to-secondary text-white shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:brightness-110 rounded-xl',

      light: 'bg-[#f0f0f0] text-[#0b1326] shadow-xl hover:brightness-110 rounded-md',
      outline: 'border-2 border-[#7818c6]/50 text-white hover:border-[#7818c6] hover:bg-[#7818c6]/10 rounded-md'
    };

    const sizes = {
      sm: 'px-6 py-2 text-[10px]',
      md: 'px-8 py-2.5 text-xs',
      lg: 'px-8 py-3 text-sm',
      xl: 'px-12 py-5 text-base',
    };

    const classes = `
      ${baseStyles}
      ${variants[variant]}
      ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const buttonContent = (
      <>
        {isLoading ? (
          <>
            <span className="material-symbols-outlined text-base animate-spin">autorenew</span>
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0 flex items-center">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="flex-shrink-0 flex items-center">{icon}</span>}
          </>
        )}
      </>
    );

    if (wrapperClassName) {
      const glowGradient = variant === 'launch'
        ? 'from-accent-cyan to-secondary'
        : variant === 'primary'
          ? 'from-[#7818c6] to-[#ddb7ff]'
          : 'from-primary to-secondary';

      return (
        <div className={`relative group inline-block ${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${glowGradient} blur-md opacity-40 group-hover:opacity-80 transition-opacity rounded-xl`}></div>
          <button
            ref={ref}
            className={`relative ${classes}`}
            disabled={disabled || isLoading}
            {...props}
          >
            {buttonContent}
          </button>
        </div>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';