import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Upload, Plus } from 'lucide-react';
import StudentFilters from './StudentFilters';
import StudentTable from './StudentTable';
import BulkUploadModal from './BulkUploadModal';
import AddStudentModal from './AddStudentModal';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import {
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation
} from '../../../features/user/userApi';
import { toast } from 'react-hot-toast';


const StudentDirectory = () => {
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        bootcampId: '',
        domainId: '',
        search: '',
        studentStatus: ''
    });

    const { data: usersResponse, isLoading, error } = useGetAllUsersQuery({
        role: 'student',
        ...filters
    });

    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const studentsList = usersResponse?.users || [];

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleUpdateStudent = async (updatedStudent) => {
        try {
            await updateUser({ id: updatedStudent._id, ...updatedStudent }).unwrap();
            toast.success('Student updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update student');
        }
    };

    const handleDeleteStudent = async (id) => {
        try {
            await deleteUser(id).unwrap();
            toast.success('Student deleted successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete student');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'suspended' ? 'enrolled' : 'suspended';
        try {
            await updateUser({ id, studentStatus: newStatus }).unwrap();
            toast.success(`Student status updated to ${newStatus}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update student status');
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]">Loading students...</div>;
    if (error) return <div className="text-red-500 text-center py-10">Error loading students: {error?.data?.message || error.message}</div>;

    return (
        <div className="max-w-[1400px] mx-auto min-h-full">
            <Breadcrumbs />
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">Student Directory</h2>
                    <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">Manage all students enrolled in your bootcamps</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        icon={<Upload size={18} />}
                        onClick={() => setIsBulkModalOpen(true)}
                    >
                        Bulk Upload CSV
                    </Button>
                    <Button
                        variant="primary"
                        icon={<Plus size={18} />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Single Student
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
                <StudentFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Table */}
            <div className="mb-10">
                <StudentTable
                    students={studentsList}
                    onUpdate={handleUpdateStudent}
                    onDelete={handleDeleteStudent}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            {/* Modals */}
            <BulkUploadModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
            />
            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default StudentDirectory;
