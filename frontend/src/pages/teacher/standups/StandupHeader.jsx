import React, { useRef, useState } from 'react';
import { Calendar, ChevronDown, LayoutGrid, List as ListIcon } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../../../components/common/Button';

const StandupHeader = ({ view, setView, range, setRange, customRange, setCustomRange, activeBootcamps = [], selectedBootcampId, setSelectedBootcampId }) => {
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const handleDateChange = (e, type) => {
        const newDate = new Date(e.target.value);
        if (!isNaN(newDate)) {
            if (type === 'start') {
                setCustomRange(prev => ({ ...prev, start: newDate }));
            } else {
                setCustomRange(prev => ({ ...prev, end: newDate }));
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight mb-2">
                    Student Daily Standups
                </h1>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mt-2">
                    <span className="shrink-0 pt-0.5">Monitoring Cohort:</span>
                    <div className="relative group w-fit">
                        <select
                            value={selectedBootcampId}
                            onChange={(e) => setSelectedBootcampId(e.target.value)}
                            className="appearance-none bg-transparent hover:bg-[var(--color-primary)]/5 pl-2 pr-6 py-1 text-[var(--color-primary)] font-bold decoration-[var(--color-primary)]/30 rounded-md cursor-pointer transition-all outline-none"
                        >
                            {activeBootcamps.length === 0 && <option value="">No Active Bootcamps</option>}
                            {activeBootcamps.map(bc => (
                                <option key={bc._id} value={bc._id}>{bc.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-primary)]">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {/* Timeframe Dropdown */}
                <div className="relative group">
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="appearance-none bg-[var(--color-surface)] h-[46px] pl-4 pr-10 text-xs font-bold text-[var(--color-text-main)] rounded-xl border border-[var(--color-border)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 cursor-pointer transition-all"
                    >
                        <option value="1 Day">Last 24 Hours</option>
                        <option value="3 Days">Last 3 Days</option>
                        <option value="7 Days">Last 7 Days</option>
                        <option value="10 Days">Last 10 Days</option>
                        <option value="20 Days">Last 20 Days</option>
                        <option value="1 Month">Last Month</option>
                        <option value="Custom">Custom Range</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
                        <ChevronDown size={16} />
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex bg-[var(--color-surface)] p-1 rounded-xl shadow-sm border border-[var(--color-border)] h-[46px]">
                    <button
                        onClick={() => setView('card')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'card' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
                    >
                        <LayoutGrid size={14} />
                        Cards
                    </button>
                    <button
                        onClick={() => setView('table')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'table' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
                    >
                        <ListIcon size={14} />
                        Table
                    </button>
                </div>

                {/* Custom Date Pickers */}
                {range === 'Custom' && (
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="date"
                                ref={startDateRef}
                                onChange={(e) => handleDateChange(e, 'start')}
                                className="absolute opacity-0 pointer-events-none"
                                value={format(customRange.start, 'yyyy-MM-dd')}
                            />
                            <Button
                                onClick={() => startDateRef.current.showPicker()}
                                variant="secondary"
                                className="bg-[var(--color-surface)] h-[46px] px-3"
                                icon={<Calendar size={16} />}
                            >
                                <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 mr-1">From:</span>
                                <span className="text-xs">{format(customRange.start, 'MMM d, yyyy')}</span>
                            </Button>
                        </div>
                        <div className="relative">
                            <input
                                type="date"
                                ref={endDateRef}
                                onChange={(e) => handleDateChange(e, 'end')}
                                className="absolute opacity-0 pointer-events-none"
                                value={format(customRange.end, 'yyyy-MM-dd')}
                            />
                            <Button
                                onClick={() => endDateRef.current.showPicker()}
                                variant="secondary"
                                className="bg-[var(--color-surface)] h-[46px] px-3"
                                icon={<Calendar size={16} />}
                            >
                                <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 mr-1">To:</span>
                                <span className="text-xs">{format(customRange.end, 'MMM d, yyyy')}</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StandupHeader;
