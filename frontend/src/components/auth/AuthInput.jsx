import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Specialized Input for Auth with Password Toggle
 * Style adapted to match frontend's standardized Input.
 */
const AuthInput = ({ icon: Icon, type, placeholder, hasViewIcon, onChange, value, label, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <div className="space-y-1.5 w-full mb-4">
            {label && (
                <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {/* Left Icon */}
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors">
                        <Icon size={18} />
                    </div>
                )}

                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`
                        w-full px-4 py-3.5 bg-[var(--color-surface-alt)] 
                        rounded-xl border border-[var(--color-border)] 
                        focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] 
                        transition-all text-sm font-normal text-[var(--color-text-main)] outline-none
                        ${Icon ? 'pl-11' : ''}
                        ${isPasswordField && hasViewIcon ? 'pr-11' : ''}
                    `}
                    {...props}
                />

                {/* Password Toggle */}
                {isPasswordField && hasViewIcon && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] active:scale-90 transition-all"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AuthInput;
