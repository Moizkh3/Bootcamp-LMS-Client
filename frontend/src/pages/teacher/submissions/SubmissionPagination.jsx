import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SubmissionPagination = ({ current, totalPages, onNext, onPrevious }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t border-[var(--color-border)]">
            <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
                Showing Page <span className="text-[var(--color-primary)] font-bold">{current}</span> of <span className="text-[var(--color-text-main)] font-bold">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={onPrevious}
                    disabled={current === 1}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-2 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            // In a real app, you'd handle page click here
                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all border ${page === current ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onNext}
                    disabled={current >= totalPages}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default SubmissionPagination;
