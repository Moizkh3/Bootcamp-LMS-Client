import React from 'react';
import { Search, Filter } from 'lucide-react';
import Select from '../../../components/common/Select';
import Input from '../../../components/common/Input';

const StudentFilters = ({ filters, onFilterChange }) => {
    return (
        <div className="mt-8 flex flex-wrap items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Select
                className="min-w-[200px]"
                label="Filter by Bootcamp"
                value={filters.bootcamp}
                onChange={(e) => onFilterChange('bootcamp', e.target.value)}
                options={[
                    "All Bootcamps",
                    "Fullstack Web",
                    "Data Science",
                    "UX/UI Design",
                    "Cybersecurity"
                ]}
            />

            <Select
                className="min-w-[200px]"
                label="Filter by Domain"
                value={filters.domain}
                onChange={(e) => onFilterChange('domain', e.target.value)}
                options={[
                    "All Domains",
                    "Engineering",
                    "Design",
                    "Data & AI",
                    "Product"
                ]}
            />

            <Input
                className="flex-1 min-w-[240px]"
                label="Search Students"
                placeholder="Search by name or email..."
                icon={<Search size={18} />}
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
            />

            <div className="mt-5">
                <button className="p-2.5 text-slate-500 hover:text-[#3636e2] hover:bg-slate-50 rounded-lg transition-all">
                    <Filter size={20} />
                </button>
            </div>
        </div>
    );
};

export default StudentFilters;
