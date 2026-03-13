import React from 'react';
import { Search, Filter, ListFilter } from 'lucide-react';
import Input from '../../../components/common/Input';

const TeacherFilters = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="mb-10 flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <Input
                className="flex-1"
                icon={<Search size={20} />}
                placeholder="Search teachers by name, email, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button className="px-6 py-3.5 bg-white rounded-xl border border-[var(--color-border)] flex items-center gap-2 text-[var(--color-text-main)] hover:bg-[var(--color-surface-alt)] transition-all font-bold text-sm active:scale-95">
                    <Filter size={18} />
                    <span>Filters</span>
                </button>
                <button className="px-5 py-3.5 bg-white rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-surface-alt)] transition-all active:scale-95">
                    <ListFilter size={18} />
                </button>
            </div>
        </div>
    );
};

export default TeacherFilters;
