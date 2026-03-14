import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Mail,
    Calendar,
    AlertCircle,
    Share2,
    MessageSquare,
    UserCircle,
    Loader2,
    Shield,
    BookOpen
} from 'lucide-react';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../features/user/userApi';
import StatusSelect from '../../../components/common/StatusSelect';
import { toast } from 'react-hot-toast';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: response, isLoading, error, refetch } = useGetUserByIdQuery(id);
    const [updateUser, { isLoading: isUpdatingStatus }] = useUpdateUserMutation();

    const studentData = response?.user;

    const handleStatusChange = async (newStatus) => {
        try {
            await updateUser({ id, studentStatus: newStatus }).unwrap();
            toast.success(`Student status updated successfully`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update status');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
            </div>
        );
    }

    if (error || !studentData) {
        return (
            <div className="text-center py-20 text-[var(--color-text-muted)]">
                <p className="text-lg font-bold">Student not found or error loading profile</p>
                <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const statusConfig = {
        enrolled: { label: 'Active', cls: 'bg-green-100 text-green-700 border-green-200' },
        completed: { label: 'Graduated', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
        dropout: { label: 'Dropped Out', cls: 'bg-red-100 text-red-600 border-red-200' },
    };

    const sc = statusConfig[studentData.studentStatus] || { label: studentData.studentStatus, cls: 'bg-slate-100 text-slate-500' };

    return (
        <div className="space-y-8 max-w-6xl mx-auto mb-10 px-4 md:px-6">
            <div className="flex items-center justify-between">
                <Breadcrumbs customLabel={studentData.name} />
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" icon={<Share2 size={16} />}>Share</Button>
                    <Button variant="ghost" size="sm" icon={<MessageSquare size={16} />}>Message</Button>
                </div>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12 border-b border-[var(--color-border)] pb-12 text-center md:text-left">
                <div className="relative group">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[var(--color-primary)]/10 border-4 border-[var(--color-surface)] shrink-0 bg-[var(--color-surface)] relative z-10">
                        <div className="w-full h-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-4xl font-bold">
                            {studentData.name.charAt(0)}
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-[var(--color-primary)] rounded-[3rem] blur-2xl opacity-10" />
                </div>

                <div className="flex-grow w-full pt-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4 justify-center md:justify-start">
                        <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-text-main)] tracking-tight">{studentData.name}</h1>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${sc.cls}`}>
                            {sc.label}
                        </span>
                    </div>

                    <p className="text-lg md:text-xl font-semibold text-[var(--color-primary)] mb-8 flex items-center justify-center md:justify-start gap-3">
                        Student
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)]" />
                        <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest">{studentData.studentBootcampId?.name || 'Assigned Bootcamp'}</span>
                    </p>

                    {/* Status Management Bar */}
                    <div className="mb-10 p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm max-w-2xl">
                        <div className="flex items-center gap-3 mb-4 text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                            <Shield size={16} className="text-[var(--color-primary)]" />
                            Manage Student Status
                        </div>
                        <StatusSelect 
                            currentStatus={studentData.studentStatus} 
                            onStatusChange={handleStatusChange} 
                            isLoading={isUpdatingStatus}
                        />
                    </div>

                    {/* Student Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl">
                        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                                <UserCircle size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Roll Number</p>
                                <p className="text-sm font-semibold text-[var(--color-text-main)]">{studentData.rollNo}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Email Address</p>
                                <p className="text-sm font-semibold text-[var(--color-text-main)] truncate max-w-[150px]">{studentData.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                                <BookOpen size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Domain</p>
                                <p className="text-sm font-semibold text-[var(--color-text-main)]">{studentData.domainId?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily History Placeholder */}
            <div>
                <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-10 flex items-center gap-4">
                    Daily History
                    <span className="h-px flex-grow bg-[var(--color-border)] opacity-60" />
                </h3>
                <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-3xl py-16 text-center">
                    <div className="w-20 h-20 bg-[var(--color-surface-alt)] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="text-[var(--color-text-muted)]" size={32} />
                    </div>
                    <p className="text-lg font-bold text-[var(--color-text-main)]">Daily Updates are in Teacher Dashboard</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-md mx-auto px-6">
                        Detailed daily standup history and assignment submissions are currently managed through the teacher's grading portal.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
