import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Standardized Select Component
 */
const Select = ({
    label,
    value,
    onChange,
    options = [],
    placeholder,
    required = false,
    className = '',
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
                <select
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full px-4 py-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-normal text-[var(--color-text-main)] outline-none cursor-pointer appearance-none"
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value || opt} value={opt.value || opt}>
                            {opt.label || opt}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
                    <ChevronDown size={18} />
                </div>
            </div>
        </div>
    );
};

export default Select;
