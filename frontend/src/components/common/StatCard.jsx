import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
    primary: {
        bg: 'bg-[var(--color-primary-muted)]',
        text: 'text-[var(--color-primary)]',
        accent: 'var(--color-primary)'
    },
    info: {
        bg: 'bg-[var(--color-info-bg)]',
        text: 'text-[var(--color-info)]',
        accent: 'var(--color-info)'
    },
    success: {
        bg: 'bg-[var(--color-success-bg)]',
        text: 'text-[var(--color-success)]',
        accent: 'var(--color-success)'
    },
    warning: {
        bg: 'bg-[var(--color-warning-bg)]',
        text: 'text-[var(--color-warning)]',
        accent: 'var(--color-warning)'
    },
    danger: {
        bg: 'bg-[var(--color-error-bg)]',
        text: 'text-[var(--color-error)]',
        accent: 'var(--color-error)'
    }
};

const StatCard = ({ title, value, icon, trend, variant = 'primary', onClick }) => {
    const isPositive = trend?.startsWith('+');
    const colors = colorMap[variant] || colorMap.primary;

    return (
        <div
            onClick={onClick}
            className={`bg-[var(--color-surface)] rounded-xl p-5 shadow-sm border border-[var(--color-border)] flex flex-col h-full transition-all hover:shadow-md ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 ${colors.bg} ${colors.text} rounded-xl`}>
                    {icon && React.cloneElement(icon, { size: 20 })}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-[0.7rem] font-bold ${isPositive
                        ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                        : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'
                        }`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-[var(--color-text-muted)] font-medium text-[0.85rem] mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
