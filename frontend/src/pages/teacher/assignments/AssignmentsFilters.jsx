import React from 'react';
import { Filter, X } from 'lucide-react';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';

import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';

const AssignmentsFilters = ({ domain, setDomain, status, setStatus, batch, setBatch, bootcamps = [] }) => {
    const { data: domainsData } = useGetAllDomainsQuery();
    const domains = domainsData?.data || [];

    const handleClearFilters = () => {
        setDomain('All Domains');
        setStatus('All Statuses');
        setBatch('All Course Batches');
    };

    return (
        <div className="mt-8 flex flex-wrap items-center gap-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm mb-8">
            <Select
                className="min-w-[200px]"
                label="Filter by Domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                options={[
                    { value: 'All Domains', label: 'All Domains' },
                    ...domains.map(d => ({ value: d._id, label: d.name }))
                ]}
            />

            <Select
                className="min-w-[200px]"
                label="Filter by Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                    'All Statuses',
                    'Active',
                    'Closed'
                ]}
            />

            <Select
                className="min-w-[200px]"
                label="Filter by Bootcamp"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                options={[
                    { value: 'All Course Batches', label: 'All Course Batches' },
                    ...bootcamps.map(b => ({ value: b._id, label: b.name }))
                ]}
            />

            <div className="flex items-center gap-4 ml-auto self-end pb-1">
                <Button
                    onClick={handleClearFilters}
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

export default AssignmentsFilters;
