import { useNavigate } from 'react-router-dom';
import {
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation
} from '../../../features/user/userApi';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

import { PlusCircle, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import TeacherCard from './TeacherCard';
import TeacherFilters from './TeacherFilters';
import AddTeacherModal from './AddTeacherModal';
import EditTeacherModal from './EditTeacherModal';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import TeacherAssignmentsPanel from './TeacherAssignmentsPanel';
import ResetPasswordModal from '../../../components/common/ResetPasswordModal';
import LoadingScreen from '../../../components/common/LoadingScreen';
import Button from '../../../components/common/Button';

const TeacherDirectory = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: usersResponse, isLoading, error } = useGetAllUsersQuery({ role: 'teacher' });
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // State for assignments panel
    const [selectedTeacherForAssignments, setSelectedTeacherForAssignments] = useState(null);
    const [isAssignmentsPanelOpen, setIsAssignmentsPanelOpen] = useState(false);

    const teachersList = usersResponse?.users || [];

    const filteredTeachers = teachersList.filter(teacher => {
        const matchesName = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEmail = teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Check single domainId (legacy/student-like)
        const matchesSingleDomain = teacher.domainId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Check multiple teacherDomainIds
        const matchesMultiDomain = teacher.teacherDomainIds?.some(d => 
            d.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return matchesName || matchesEmail || matchesSingleDomain || matchesMultiDomain;
    });

    const handleAddTeacher = () => {
        // Redux invalidates after add (if implemented via register)
        setIsAddModalOpen(false);
    };

    const handleEditTeacher = async (updatedTeacher) => {
        try {
            await updateUser({ id: selectedTeacher._id, ...updatedTeacher }).unwrap();
            toast.success('Teacher updated successfully');
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update teacher');
        }
    };

    const openEditModal = (teacher) => {
        setSelectedTeacher(teacher);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (teacher) => {
        setSelectedTeacher(teacher);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTeacher?._id) return;
        setIsDeleting(true);
        try {
            await deleteUser(selectedTeacher._id).unwrap();
            toast.success('Teacher deleted successfully');
            setIsDeleteModalOpen(false);
            setSelectedTeacher(null);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete teacher');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleTeacherClick = (teacher) => {
        navigate(`/teachers/${teacher._id}`);
    };

    if (isLoading) return <LoadingScreen variant="contained" text="Loading teachers..." />;
    if (error) return <div className="text-red-500 text-center py-10">Error loading teachers: {error?.data?.message || error.message}</div>;

    return (
        <div className="max-w-[1400px] mx-auto min-h-full">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">
                        Mentor & Teacher Management
                    </h2>
                    <p className="text-[var(--color-text-muted)] mt-2 font-medium max-w-xl">
                        Directory of all authorized instructors, course leads, and mentors overseeing our bootcamp tracks.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        icon={<Download size={16} />}
                    >
                        Export
                    </Button>
                    <Button
                        variant="primary"
                        icon={<Plus size={18} />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add New Teacher
                    </Button>
                </div>
            </header>

            {/* Search and Filters */}
            <TeacherFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Teacher Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTeachers.map((teacher) => (
                    <TeacherCard
                        key={teacher._id}
                        {...teacher}
                        onClick={() => handleTeacherClick(teacher)}
                        onEdit={() => openEditModal(teacher)}
                        onDelete={() => handleDeleteClick(teacher)}
                        onResetPassword={() => { setSelectedTeacher(teacher); setIsResetPasswordModalOpen(true); }}
                    />
                ))}
            </div>

            {/* Pagination Component Placeholder */}

            {/* Modals */}
            <AddTeacherModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddTeacher}
            />
            <EditTeacherModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditTeacher}
                teacher={selectedTeacher}
            />

            {/* Reset Password Modal */}
            <ResetPasswordModal
                isOpen={isResetPasswordModalOpen}
                onClose={() => setIsResetPasswordModalOpen(false)}
                user={selectedTeacher}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedTeacher?.name}
                isDeleting={isDeleting}
                message="Are you sure you want to remove this teacher? Their access to the portal will be revoked, and their assigned domain roles will be vacated."
            />

            {/* Assignments Slide-over Panel */}
            <TeacherAssignmentsPanel
                isOpen={isAssignmentsPanelOpen}
                onClose={() => setIsAssignmentsPanelOpen(false)}
                teacher={selectedTeacherForAssignments}
            />
        </div>
    );
};

export default TeacherDirectory;
