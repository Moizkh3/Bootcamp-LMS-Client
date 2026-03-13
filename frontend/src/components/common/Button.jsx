import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standardized Button Component
 * Lighter aesthetics per user request.
 */
const Button = ({
    children,
    variant = 'primary', // primary, secondary, danger, outline, ghost, solid
    size = 'md',      // sm, md, lg
    isLoading = false,
    icon: Icon,
    className = '',
    disabled = false,
    type = 'button',
    onClick,
    ...props
}) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl';

    // Size variants
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base'
    };

    // Color/Visual variants
    const variantStyles = {
        // Lighter primary (Light blue background with primary text)
        primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 shadow-sm shadow-[var(--color-primary)]/5',
        // Traditional solid primary (Darker button)
        solid: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-soft)] shadow-lg shadow-[var(--color-primary)]/20',
        // Lighter secondary
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/50',
        // Danger variant
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
        // Outline
        outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-alt)]',
        // Ghost
        ghost: 'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-main)]'
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`
                ${baseStyles}
                ${sizeStyles[size]}
                ${variantStyles[variant]}
                ${className}
            `}
            {...props}
        >
            {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                Icon && <span>{Icon}</span>
            )}
            <span>{children}</span>
        </button>
    );
};

export default Button;
