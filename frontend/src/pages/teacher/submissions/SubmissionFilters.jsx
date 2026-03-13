import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Select from '../../../components/common/Select';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { useGetTeacherAssignmentsQuery } from '../../../features/teacher/teacherApi';

const SubmissionFilters = ({ 
    assignment, setAssignment, 
    status, setStatus, 
    search, setSearch, 
    domain, setDomain,
    range, setRange,
    customRange, setCustomRange
}) => {
    const startDateRef = React.useRef(null);
    const endDateRef = React.useRef(null);
    const { data: domainsData } = useGetAllDomainsQuery();
    const { data: assignmentsData } = useGetTeacherAssignmentsQuery();
    
    const domains = domainsData?.data || [];
    const assignments = assignmentsData?.data || [];

    return (
        <div className="flex flex-wrap items-end gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm mb-8">
            <div className="flex-1 min-w-[250px]">
                <Input
                    icon={<Search size={18} />}
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Select
                className="min-w-[180px]"
                label="Domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                options={[
                    { value: 'All Domains', label: 'All Domains' },
                    ...domains.map(d => ({ value: d._id, label: d.name }))
                ]}
            />

            <Select
                className="min-w-[200px]"
                label="Assignment"
                value={assignment}
                onChange={(e) => setAssignment(e.target.value)}
                options={[
                    { value: 'All Assignments', label: 'All Assignments' },
                    ...assignments.map(a => ({ value: a._id, label: a.title }))
                ]}
            />

            <Select
                className="min-w-[150px]"
                label="Time Range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                options={[
                    '1 Day',
                    '3 Days',
                    '7 Days',
                    '10 Days',
                    '20 Days',
                    '1 Month',
                    'Custom'
                ]}
            />

            {range === 'Custom' && (
                <div className="flex items-center gap-2">
                    <div className="space-y-1.5">
                         <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">From</label>
                         <input
                            type="date"
                            className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                            value={customRange.start ? new Date(customRange.start).toISOString().split('T')[0] : ''}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
                         />
                    </div>
                    <div className="space-y-1.5">
                         <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">To</label>
                         <input
                            type="date"
                            className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                            value={customRange.end ? new Date(customRange.end).toISOString().split('T')[0] : ''}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
                         />
                    </div>
                </div>
            )}
            <Select
                className="min-w-[180px]"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                    'All Statuses',
                    'submitted',
                    'graded',
                    're-submit',
                    'late',
                    'under-review'
                ]}
            />

            <div className="flex items-center gap-4 ml-auto self-end pb-1">
                <Button
                    onClick={() => {
                        setSearch('');
                        setAssignment('All Assignments');
                        setStatus('All Statuses');
                        setDomain('All Domains');
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                    icon={<X size={16} />}
                >
                    Clear Filters
                </Button>
                <div className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-lg transition-all cursor-pointer">
                    <Filter size={20} />
                </div>
            </div>
        </div>
    );
};

export default SubmissionFilters;
