import React from 'react';

/**
 * Standardized Input Component
 */
const Input = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    required = false,
    className = '',
    icon: Icon,
    ...props
}) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                        {Icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`
                        w-full px-4 py-3 bg-[var(--color-surface-alt)] 
                        rounded-xl border border-[var(--color-border)] 
                        focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] 
                        transition-all text-sm font-normal text-[var(--color-text-main)] outline-none
                        ${Icon ? 'pl-11' : ''}
                    `}
                    {...props}
                />
            </div>
        </div>
    );
};

export default Input;
