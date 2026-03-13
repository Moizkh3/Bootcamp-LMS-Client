import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

const colorMap = {
    primary: {
        bg: 'bg-[var(--color-primary-muted)]',
        text: 'text-[var(--color-primary)]',
        bar: 'var(--color-primary)'
    },
    info: {
        bg: 'bg-[var(--color-info-bg)]',
        text: 'text-[var(--color-info)]',
        bar: 'var(--color-info)'
    },
    success: {
        bg: 'bg-[var(--color-success-bg)]',
        text: 'text-[var(--color-success)]',
        bar: 'var(--color-success)'
    },
    warning: {
        bg: 'bg-[var(--color-warning-bg)]',
        text: 'text-[var(--color-warning)]',
        bar: 'var(--color-warning)'
    },
    accent: {
        bg: 'bg-[var(--color-accent-bg)]',
        text: 'text-[var(--color-accent)]',
        bar: 'var(--color-accent)'
    }
};

export default function StatCard({ title, value, icon, trend = null, chartData = [], onClick, variant = 'primary' }) {
    const isPositive = trend?.startsWith('+');
    const colors = colorMap[variant] || colorMap.primary;

    return (
        <div
            onClick={onClick}
            className="p-5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col h-full transition-[var(--transition-base)] hover:shadow-md cursor-pointer active:scale-[0.98]"
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 ${colors.bg} rounded-xl flex ${colors.text}`}>
                    {icon}
                </div>
                {trend && (
                    <div
                        className={`px-2 py-1 rounded text-[0.75rem] font-bold ${isPositive ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'
                            }`}
                    >
                        {trend}
                    </div>
                )}
            </div>

            <p className="text-[0.875rem] font-medium text-[var(--color-text-muted)] mb-1">
                {title}
            </p>
            <p className="text-2xl font-bold text-[var(--color-text-main)] leading-none">
                {value}
            </p>

            {chartData && chartData.length > 0 && (
                <div className="w-full h-10 mt-3 flex items-end grow">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors.bar} fillOpacity={entry.opacity} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
