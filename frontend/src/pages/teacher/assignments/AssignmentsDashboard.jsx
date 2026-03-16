import { CheckSquare, AlertCircle } from 'lucide-react';
import LoadingScreen from '../../../components/common/LoadingScreen';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import AssignmentHeader from './AssignmentHeader';
import AssignmentsFilters from './AssignmentsFilters';
import AssignmentsTable from './AssignmentsTable';
import AssignmentDetailModal from './AssignmentDetailModal';
import CreateAssignmentModal from './CreateAssignmentModal';
import { useState } from 'react';

import {
        useGetTeacherAssignmentsQuery,
        useDeleteTeacherAssignmentMutation,
        useUpdateTeacherAssignmentMutation,
        useGetTeacherStatsQuery
    } from '../../../features/teacher/teacherApi';

const AssignmentsDashboard = () => {
    const { data: assignmentsResponse, isLoading, error } = useGetTeacherAssignmentsQuery();
    const { data: statsData } = useGetTeacherStatsQuery();
    const [deleteAssignment] = useDeleteTeacherAssignmentMutation();
    const [updateAssignment] = useUpdateTeacherAssignmentMutation();

    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [assignmentToEdit, setAssignmentToEdit] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filter States
    const [domainFilter, setDomainFilter] = useState('All Domains');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [batchFilter, setBatchFilter] = useState('All Course Batches');

    const assignments = assignmentsResponse?.data || [];
    const activeBootcamps = statsData?.data?.activeBootcamps || [];

    const filteredAssignments = assignments.filter(a => {
        const matchesDomain = domainFilter === 'All Domains' || a.domain?._id === domainFilter || a.domain === domainFilter;
        const matchesStatus = statusFilter === 'All Statuses' || a.status === statusFilter;
        const matchesBatch = batchFilter === 'All Course Batches' || a.bootcamp?._id === batchFilter || a.bootcamp === batchFilter;

        return matchesDomain && matchesStatus && matchesBatch;
    });

    const handleDeleteAssignment = async (id) => {
        try {
            await deleteAssignment(id).unwrap();
        } catch (err) {
            console.error('Failed to delete assignment:', err);
        }
    };

    const handleToggleStatus = async (id) => {
        const assignment = assignments.find(a => a._id === id);
        if (!assignment) return;

        try {
            const updated = await updateAssignment({
                id,
                status: (assignment.status === 'Active' || assignment.status === 'published') ? 'Closed' : 'Active'
            }).unwrap();

            if (selectedAssignment && selectedAssignment._id === id) {
                setSelectedAssignment(updated.data);
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleViewDetails = (assignment) => {
        setSelectedAssignment(assignment);
    };

    const handleEditAssignment = (assignment) => {
        setAssignmentToEdit(assignment);
        setIsCreateModalOpen(true);
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--color-error)]">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-bold">Error loading assignments. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Breadcrumbs />
            <AssignmentHeader
                activeCount={assignments.filter(a => a.status === 'Active').length}
                onCreateClick={() => setIsCreateModalOpen(true)}
                isLoading={isLoading}
            />

            <AssignmentsFilters
                domain={domainFilter} setDomain={setDomainFilter}
                status={statusFilter} setStatus={setStatusFilter}
                batch={batchFilter} setBatch={setBatchFilter}
                bootcamps={activeBootcamps}
            />

            {isLoading ? (
                <LoadingScreen variant="contained" text="Fetching assignments..." />
            ) : (
                <AssignmentsTable
                    assignments={filteredAssignments}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditAssignment}
                    onDelete={handleDeleteAssignment}
                />
            )}

            {/* Detail View Modal */}
            <AssignmentDetailModal
                isOpen={!!selectedAssignment}
                onClose={() => setSelectedAssignment(null)}
                assignment={selectedAssignment}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEditAssignment}
            />

            {/* Create Assignment Modal */}
            <CreateAssignmentModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setAssignmentToEdit(null);
                }}
                assignment={assignmentToEdit}
            />
        </div>
    );
};

export default AssignmentsDashboard;
