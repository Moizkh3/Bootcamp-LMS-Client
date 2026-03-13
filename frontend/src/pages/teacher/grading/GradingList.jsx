import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    ChevronRight,
    Clock,
    X,
    Loader2,
    AlertCircle
} from 'lucide-react';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Select from '../../../components/common/Select';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useGetTeacherSubmissionsQuery } from '../../../features/teacher/teacherApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';

const GradingList = () => {
    const navigate = useNavigate();
    const { data: submissionsResponse, isLoading, error } = useGetTeacherSubmissionsQuery();
    const { data: domainsResponse } = useGetAllDomainsQuery();
    const domains = domainsResponse?.data || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [domainFilter, setDomainFilter] = useState('All Domains');
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    const allSubmissions = submissionsResponse?.data || [];

    const filteredSubmissions = allSubmissions.filter(sub => {
        const studentName = sub.student?.name || '';
        const assignmentTitle = sub.assignment?.title || '';
        const domainId = sub.assignment?.domain?._id || sub.assignment?.domain;

        const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDomain = domainFilter === 'All Domains' || domainId === domainFilter;
        const matchesStatus = statusFilter === 'All Statuses' || sub.status === statusFilter;

        return matchesSearch && matchesDomain && matchesStatus;
    });

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--color-error)]">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-bold">Error loading submissions. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto min-h-full pb-10">
            <Breadcrumbs items={[
                { label: 'Teacher Dashboard', path: '/teacher/dashboard' },
                { label: 'Grading' }
            ]} />

            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 mt-6">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">Assignment Submissions</h1>
                    <p className="text-[var(--color-text-muted)] mt-2 font-medium max-w-xl">
                        Monitor and evaluate student submissions across all active bootcamp modules.
                    </p>
                </div>
            </header>

            {/* Filters Area */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 mb-8 shadow-sm">
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1">
                        <Input
                            icon={<Search size={18} />}
                            placeholder="Search by student name or assignment title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Select
                            className="min-w-[160px]"
                            label="Filter Domain"
                            value={domainFilter}
                            onChange={(e) => setDomainFilter(e.target.value)}
                            options={[
                                { value: 'All Domains', label: 'All Domains' },
                                ...domains.map(d => ({ value: d._id, label: d.name }))
                            ]}
                        />

                        <Select
                            className="min-w-[160px]"
                            label="Filter Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                'All Statuses',
                                'submitted',
                                'graded',
                                're-submit',
                                'late',
                                'under-review'
                            ]}
                        />

                        <Button
                            onClick={() => {
                                setSearchTerm('');
                                setDomainFilter('All Domains');
                                setStatusFilter('All Statuses');
                            }}
                            variant="ghost"
                            size="md"
                            className="text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] h-[46px] mt-6"
                            icon={<X size={16} />}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Submissions List */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center">
                        <Loader2 size={40} className="animate-spin text-[var(--color-primary)] mb-4" />
                        <p className="text-[var(--color-text-muted)] font-bold uppercase tracking-widest text-xs">Fetching Data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--color-background)] text-[var(--color-text-muted)] text-[10px] font-bold uppercase tracking-[0.1em] border-b border-[var(--color-border)]">
                                    <th className="px-8 py-5">Full Name & Student ID</th>
                                    <th className="px-6 py-5">Assignment Module</th>
                                    <th className="px-6 py-5 text-center">Domain</th>
                                    <th className="px-6 py-5">Submission Date</th>
                                    <th className="px-6 py-5 text-center">Current Status</th>
                                    <th className="px-8 py-5 text-right">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {filteredSubmissions.map((sub) => (
                                    <tr
                                        key={sub._id}
                                        onClick={() => navigate(`/teacher/grading/${sub._id}`)}
                                        className="hover:bg-[var(--color-primary)]/5 transition-all duration-300 group cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)] group-hover:scale-105 transition-transform bg-[var(--color-surface-alt)]">
                                                    <img src={sub.student?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.student?.name)}`} alt={sub.student?.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{sub.student?.name}</p>
                                                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">{sub.student?.rollNo || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 min-w-[250px]">
                                            <p className="text-sm font-semibold text-[var(--color-text-main)] line-clamp-1 mb-1">{sub.assignment?.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/5 px-2 py-0.5 rounded border border-[var(--color-primary)]/10">Module {sub.assignment?.module}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info)]/20">
                                                {sub.assignment?.domain?.name || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--color-text-main)]">
                                                    <Clock size={12} className="text-[var(--color-primary)]" />
                                                    {new Date(sub.createdAt).toLocaleDateString()}
                                                </div>
                                                <span className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Submitted Date</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${sub.status === 'submitted' ? 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30 text-[var(--color-warning)]' :
                                                sub.status === 'graded' ? 'bg-[var(--color-success-bg)] border-[var(--color-success)]/30 text-[var(--color-success)]' :
                                                    'bg-[var(--color-info-bg)] border-[var(--color-info)]/30 text-[var(--color-info)]'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'submitted' ? 'bg-[var(--color-warning)] animate-pulse' :
                                                    sub.status === 'graded' ? 'bg-[var(--color-success)]' :
                                                        'bg-[var(--color-info)]'
                                                    }`} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{sub.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="w-10 h-10 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:border-[var(--color-primary)]/30 group-hover:shadow-md transition-all">
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredSubmissions.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="w-20 h-20 bg-[var(--color-background)] text-[var(--color-text-muted)] rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-[var(--color-border)] group">
                                    <Search size={32} className="group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-1">No matching results</h3>
                                <p className="text-[var(--color-text-muted)] font-medium max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GradingList;
