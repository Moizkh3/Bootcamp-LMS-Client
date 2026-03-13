import React from 'react';
import Button from '../../../components/common/Button';
import { Plus } from 'lucide-react';

const AssignmentHeader = ({ activeCount = 12, onCreateClick }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight mb-2">
                        Assignments
                    </h1>
                    <p className="text-[var(--color-text-muted)] font-medium max-w-2xl">
                        Manage and track all student submissions across your active courses.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-[var(--color-info-bg)] px-4 py-2 rounded-full border border-[var(--color-info)] w-fit">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-info)] animate-pulse" />
                    <span className="text-[var(--color-info)] text-xs font-bold uppercase tracking-widest">
                        {activeCount} Active Assignments
                    </span>
                </div>
            </div>

            <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={onCreateClick}
            >
                Create Assignment
            </Button>
        </div>
    );
};

export default AssignmentHeader;
