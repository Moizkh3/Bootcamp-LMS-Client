import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Edit3,
    Trash2,
    Calendar,
    Users,
    Layers,
    AlertTriangle,
    Mail,
    Shield,
    Briefcase
} from 'lucide-react';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import EditTeacherModal from './EditTeacherModal';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { 
    useGetUserByIdQuery, 
    useUpdateUserMutation,
    useDeleteUserMutation
} from '../../../features/user/userApi';
import toast from 'react-hot-toast';

// Import Tab Components
import TeacherOverviewTab from './tabs/TeacherOverviewTab';
import TeacherAssignmentsTab from './tabs/TeacherAssignmentsTab';
import TeacherBootcampsTab from './tabs/TeacherBootcampsTab';

export default function TeacherDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: userResponse, isLoading, error } = useGetUserByIdQuery(id);
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const teacher = userResponse?.user;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Tab state
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'assignments', label: 'Assignments' },
        { id: 'bootcamps', label: 'Assigned Bootcamps' }
    ];

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]">Loading teacher details...</div>;

    if (!teacher) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertTriangle size={48} className="text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Teacher Not Found</h2>
                <p className="text-slate-500 mb-6">The teacher you are looking for does not exist or has been removed.</p>
                <Button variant="primary" onClick={() => navigate('/teachers')}>
                    Back to Directory
                </Button>
            </div>
        );
    }

    const handleUpdate = async (updatedData) => {
        try {
            await updateUser({ id, ...updatedData }).unwrap();
            toast.success('Teacher updated successfully');
        } catch (err) {
            toast.error(err.data?.message || 'Failed to update teacher');
        }
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUser(id).unwrap();
            toast.success('Teacher deleted successfully');
            setIsDeleteModalOpen(false);
            navigate('/teachers');
        } catch (err) {
            toast.error(err.data?.message || 'Failed to delete teacher');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col">
            <Breadcrumbs />

            <div className="mb-6 flex items-center">
                <button
                    onClick={() => navigate('/teachers')}
                    className="flex items-center text-sm font-medium text-[#64748b] hover:text-[#1111d4] transition-colors"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Teachers
                </button>
            </div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div
                        className="w-16 h-16 flex items-center justify-center rounded-2xl font-bold text-2xl shrink-0 shadow-sm"
                        style={{ backgroundColor: `var(--color-primary-light)`, color: `var(--color-primary)` }}
                    >
                        {teacher.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">
                            {teacher.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-sm">
                                <Mail size={14} />
                                {teacher.email}
                            </div>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider"
                            >
                                {teacher.role}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        icon={<Edit3 size={18} />}
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Profile
                    </Button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-2 h-11 px-4 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                        Remove
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto no-scrollbar border-b border-[#e2e8f0] mb-8">
                <div className="flex gap-8 px-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-sm font-bold whitespace-nowrap transition-colors relative ${activeTab === tab.id
                                ? 'text-[#1111d4]'
                                : 'text-[#64748b] hover:text-[#0f172a]'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1111d4] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && <TeacherOverviewTab teacher={teacher} />}
                {activeTab === 'assignments' && <TeacherAssignmentsTab teacherId={teacher._id} />}
                {activeTab === 'bootcamps' && <TeacherBootcampsTab teacher={teacher} />}
            </div>

            {/* Edit Modal */}
            <EditTeacherModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdate}
                teacher={teacher}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={teacher?.name}
                isDeleting={isDeleting}
                message="Are you sure you want to remove this teacher? Their access to the portal will be revoked, and their assigned domain roles will be vacated."
            />
        </div>
    );
}
