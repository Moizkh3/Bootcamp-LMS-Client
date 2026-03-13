import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors">
                        {Icon}
                    </div>
                )}
                <input
                    type={inputType}
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
                        ${isPasswordField ? 'pr-11' : ''}
                    `}
                    {...props}
                />
                
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] active:scale-90 transition-all focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
