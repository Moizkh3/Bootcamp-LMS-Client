import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Modal Component
 * 
 * Props:
 * - isOpen {boolean}: Controls visibility
 * - onClose {function}: Callback when modal should close
 * - title {string}: Title shown in header
 * - icon {ReactNode}: Optional icon shown next to title
 * - children {ReactNode}: Modal body content
 * - size {string}: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * - showClose {boolean}: Whether to show the close button (default: true)
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    icon: Icon,
    children,
    size = 'md',
    showClose = true
}) => {
    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`
                relative w-full ${sizeClasses[size]} 
                bg-white rounded-2xl shadow-2xl overflow-hidden border-none
                animate-in fade-in zoom-in duration-200
            `}>
                {/* Header */}
                <div className="p-6 flex justify-between items-center bg-white border-b border-[var(--color-border-soft)]">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="size-10 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center text-[var(--color-primary)]">
                                {Icon}
                            </div>
                        )}
                        <h2 className="text-xl font-bold text-[var(--color-text-main)] tracking-tight">
                            {title}
                        </h2>
                    </div>
                    {showClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[var(--color-surface-alt)] rounded-xl transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Body - We use a div here to allow content-controlled padding/layout */}
                <div className="max-h-[85vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
