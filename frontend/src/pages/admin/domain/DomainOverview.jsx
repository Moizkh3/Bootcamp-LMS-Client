import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Users, Edit3, Mail, BookOpen, Hash,
    BarChart3, UserCircle, Search, Shield, Star, TrendingUp
} from 'lucide-react';
import { useGetDomainByIdQuery, useEditDomainMutation } from '../../../features/domain/domainApi';
import { useGetAllUsersQuery, useGetUsersByRoleQuery } from '../../../features/user/userApi';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import EditDomainModal from './EditDomainModal';
import { toast } from 'react-hot-toast';

const TABS = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'overview', label: 'Overview', icon: BarChart3 },
];

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4 shadow-sm">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={22} />
        </div>
        <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-[var(--color-text-main)] mt-0.5">{value}</p>
        </div>
    </div>
);

const DomainOverview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDomain] = useEditDomainMutation();

    const { data: domainResponse, isLoading: domainLoading } = useGetDomainByIdQuery(id, { skip: !id });
    const { data: usersResponse, isLoading: usersLoading } = useGetAllUsersQuery(
        { role: 'student', domainId: id },
        { skip: !id }
    );

    const domain = domainResponse?.data;
    const students = usersResponse?.users || [];

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(s.rollNo).includes(searchQuery)
    );

    const activeCount = students.filter(s => s.studentStatus === 'enrolled').length;
    const graduatedCount = students.filter(s => s.studentStatus === 'completed').length;
    const dropoutCount = students.filter(s => s.studentStatus === 'dropout').length;

    const handleUpdate = async (updatedDomain) => {
        try {
            await editDomain({ id: updatedDomain._id, ...updatedDomain }).unwrap();
            toast.success('Domain updated successfully');
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update domain');
        }
    };

    if (domainLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
        );
    }

    if (!domain) {
        return (
            <div className="text-center py-20 text-[var(--color-text-muted)]">
                <p className="text-lg font-bold">Domain not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1280px] mx-auto">
            <Breadcrumbs />

            {/* Back + Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                <div className="flex items-start gap-4">
                    <button
                        onClick={() => navigate('/domains')}
                        className="mt-1 p-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tight">
                                {domain.name}
                            </h1>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] uppercase tracking-wider">
                                {domain.type || 'Domain'}
                            </span>
                            {domain.status && (
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                    domain.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {domain.status}
                                </span>
                            )}
                        </div>
                        <p className="text-[var(--color-text-muted)] mt-1.5 font-medium max-w-xl">
                            {domain.description || 'Manage students, track performance and view domain analytics.'}
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    icon={<Edit3 size={16} />}
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Edit Domain
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={Users}
                    label="Total Students"
                    value={students.length}
                    color="bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                />
                <StatCard
                    icon={Star}
                    label="Active"
                    value={activeCount}
                    color="bg-green-100 text-green-600"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Graduated"
                    value={graduatedCount}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard
                    icon={Shield}
                    label="Dropped Out"
                    value={dropoutCount}
                    color="bg-red-100 text-red-500"
                />
            </div>

            {/* Mentors Section */}
            {(domain.mentorIds?.length > 0 || domain.mentorName) && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield size={16} /> Assigned Mentors
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {domain.mentorIds?.length > 0 ? (
                            domain.mentorIds.map((mentor, index) => {
                                const mName = mentor.name || mentor;
                                const mAvatar = mentor.avatar;
                                return (
                                    <div key={mentor._id || index} className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm min-w-[240px]">
                                        <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-black text-lg shrink-0">
                                            {mAvatar && !mAvatar.includes('placeholder') ? (
                                                <img src={mAvatar} alt={mName} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                mName.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Mentor</p>
                                            <p className="text-base font-bold text-[var(--color-text-main)] mt-0.5">{mName}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm min-w-[240px]">
                                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-black text-lg shrink-0">
                                    {domain.mentorName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Mentor</p>
                                    <p className="text-base font-bold text-[var(--color-text-main)] mt-0.5">{domain.mentorName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-[var(--color-border)] mb-6 pb-0">
                {TABS.map(({ id: tabId, label, icon: Icon }) => (
                    <button
                        key={tabId}
                        onClick={() => setActiveTab(tabId)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                            activeTab === tabId
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                        }`}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'students' && (
                <div>
                    {/* Search */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                        <Input
                            placeholder="Search by name, email or roll no..."
                            icon={<Search size={16} />}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="max-w-sm"
                        />
                        <p className="text-xs font-medium text-[var(--color-text-muted)] shrink-0">
                            {filteredStudents.length} of {students.length} students
                        </p>
                    </div>

                    {usersLoading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-8 h-8 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredStudents.map(student => {
                                const statusConfig = {
                                    enrolled:  { label: 'Active',     cls: 'bg-green-100 text-green-700' },
                                    completed: { label: 'Graduated',  cls: 'bg-blue-100 text-blue-700' },
                                    dropout:   { label: 'Dropped Out',cls: 'bg-red-100 text-red-600' },
                                };
                                const sc = statusConfig[student.studentStatus] || { label: student.studentStatus, cls: 'bg-slate-100 text-slate-500' };
                                return (
                                    <div
                                        key={student._id}
                                        onClick={() => navigate(`/students/${student._id}`)}
                                        className="bg-white border border-[var(--color-border)] rounded-2xl p-5 flex items-center gap-4 hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                                            {student.name?.charAt(0)?.toUpperCase() || <UserCircle size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-[var(--color-text-main)] truncate pr-2">{student.name}</h4>
                                                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${sc.cls}`}>
                                                    {sc.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)]">
                                                    <Hash size={11} /> {student.rollNo}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] truncate">
                                                    <Mail size={11} /> {student.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center mb-5">
                                <Users size={36} className="text-[var(--color-text-muted)]" />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--color-text-main)]">No students found</h3>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xs">
                                {searchQuery ? 'No students match your search.' : `No students are currently enrolled in the ${domain.name} domain.`}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Domain Details</h3>
                        <dl className="space-y-4">
                            {[
                                { label: 'Domain Name', value: domain.name, icon: BookOpen },
                                { label: 'Type', value: domain.type || '—', icon: Shield },
                                { label: 'Status', value: domain.status || '—', icon: Star },
                                { label: 'Mentor', value: domain.mentorName || 'Not Assigned', icon: UserCircle },
                            ].map(({ label, value, icon: Icon }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-alt)] flex items-center justify-center shrink-0">
                                        <Icon size={15} className="text-[var(--color-text-muted)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{label}</p>
                                        <p className="text-sm font-semibold text-[var(--color-text-main)]">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Student Distribution</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Active', count: activeCount, total: students.length, color: 'bg-green-500' },
                                { label: 'Graduated', count: graduatedCount, total: students.length, color: 'bg-blue-500' },
                                { label: 'Dropped Out', count: dropoutCount, total: students.length, color: 'bg-red-400' },
                            ].map(({ label, count, total, color }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-xs font-bold text-[var(--color-text-muted)] mb-1.5">
                                        <span>{label}</span>
                                        <span>{count} / {total}</span>
                                    </div>
                                    <div className="h-2.5 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${color}`}
                                            style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Modal */}
            <EditDomainModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdate}
                domainData={domain}
            />
        </div>
    );
};

export default DomainOverview;
