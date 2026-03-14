import React from 'react';
import { CheckCircle2, UserMinus, UserCheck, Loader2 } from 'lucide-react';

const statuses = [
    { id: 'enrolled', label: 'Active', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { id: 'completed', label: 'Graduated', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 'dropout', label: 'Dropped Out', icon: UserMinus, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
];

const StatusSelect = ({ currentStatus, onStatusChange, isLoading }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {statuses.map((status) => {
                const Icon = status.icon;
                const isActive = currentStatus === status.id;
                
                return (
                    <button
                        key={status.id}
                        disabled={isLoading}
                        onClick={() => onStatusChange(status.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            isActive 
                                ? `${status.bg} ${status.color} ${status.border} shadow-sm scale-105` 
                                : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {isLoading && isActive ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Icon size={14} />
                        )}
                        {status.label}
                    </button>
                );
            })}
        </div>
    );
};

export default StatusSelect;
