import React, { useState } from 'react';
import { Bell, ChevronDown, AlertCircle } from 'lucide-react';
import LoadingScreen from '../../../components/common/LoadingScreen';
import SubmissionFilters from './SubmissionFilters';
import SubmissionList from './SubmissionList';
import SubmissionPagination from './SubmissionPagination';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import { useGetTeacherSubmissionsQuery } from '../../../features/teacher/teacherApi';

const SubmissionsDashboard = () => {
    const { data: submissionsResponse, isLoading, error } = useGetTeacherSubmissionsQuery();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [assignmentFilter, setAssignmentFilter] = useState('All Assignments');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [domainFilter, setDomainFilter] = useState('All Domains');
    const [searchTerm, setSearchTerm] = useState('');
    const [range, setRange] = useState('All Time');
    const [customRange, setCustomRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date()
    });

    const allSubmissions = submissionsResponse?.data || [];

    const filteredSubmissions = allSubmissions.filter(s => {
        const assignmentTitle = s.assignment?.title || '';
        const assignmentId = s.assignment?._id || s.assignment;
        const studentName = s.student?.name || '';
        const domainId = s.assignment?.domain?._id || s.assignment?.domain;

        const matchesAssignment = assignmentFilter === 'All Assignments' || assignmentId === assignmentFilter;
        const matchesDomain = domainFilter === 'All Domains' || domainId === domainFilter;
        const matchesStatus = statusFilter === 'All Statuses' || s.status === statusFilter;

        const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());

        // Time filtering
        const submissionDate = new Date(s.createdAt);
        const now = new Date();
        let matchesTime = true;

        if (range === '1 Day') {
            matchesTime = submissionDate >= new Date(now.setHours(0, 0, 0, 0));
        } else if (range === '3 Days') {
            matchesTime = submissionDate >= new Date(new Date().setDate(new Date().getDate() - 3));
        } else if (range === '7 Days') {
            matchesTime = submissionDate >= new Date(new Date().setDate(new Date().getDate() - 7));
        } else if (range === '10 Days') {
            matchesTime = submissionDate >= new Date(new Date().setDate(new Date().getDate() - 10));
        } else if (range === '20 Days') {
            matchesTime = submissionDate >= new Date(new Date().setDate(new Date().getDate() - 20));
        } else if (range === '1 Month') {
            matchesTime = submissionDate >= new Date(new Date().setMonth(new Date().getMonth() - 1));
        } else if (range === 'Custom') {
            const start = new Date(customRange.start).setHours(0, 0, 0, 0);
            const end = new Date(customRange.end).setHours(23, 59, 59, 999);
            matchesTime = submissionDate >= start && submissionDate <= end;
        }

        return matchesAssignment && matchesDomain && matchesStatus && matchesSearch && matchesTime;
    });

    const totalSubmissions = filteredSubmissions.length;
    const paginatedSubmissions = filteredSubmissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--color-error)] border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-bold">Error loading submissions. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <Breadcrumbs items={[
                        { label: 'Teacher Dashboard', path: '/teacher/dashboard' },
                        { label: 'Submissions' }
                    ]} />
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight mt-2">Student Progress</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-all group h-[46px] w-[46px] flex items-center justify-center">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--color-danger)] border-2 border-[var(--color-surface)] rounded-full group-hover:animate-bounce" />
                    </button>
                </div>
            </div>

            <SubmissionFilters
                assignment={assignmentFilter} setAssignment={setAssignmentFilter}
                status={statusFilter} setStatus={setStatusFilter}
                domain={domainFilter} setDomain={setDomainFilter}
                search={searchTerm} setSearch={setSearchTerm}
                range={range} setRange={setRange}
                customRange={customRange} setCustomRange={setCustomRange}
            />

            {isLoading ? (
                <LoadingScreen variant="contained" text="Loading Submissions..." />
            ) : (
                <>
                    <SubmissionList submissions={paginatedSubmissions} />
                    {totalSubmissions > itemsPerPage && (
                        <SubmissionPagination
                            current={currentPage}
                            totalPages={Math.ceil(totalSubmissions / itemsPerPage)}
                            onNext={() => setCurrentPage(prev => Math.min(Math.ceil(totalSubmissions / itemsPerPage), prev + 1))}
                            onPrevious={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        />
                    )}
                    {totalSubmissions === 0 && (
                        <div className="text-center py-20 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                            <p className="text-[var(--color-text-muted)] italic font-medium">No submissions found.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SubmissionsDashboard;
