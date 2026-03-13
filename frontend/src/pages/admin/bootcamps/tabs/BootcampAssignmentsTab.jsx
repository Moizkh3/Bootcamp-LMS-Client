import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, CheckSquare } from 'lucide-react';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import CreateAssignmentModal from '../../../teacher/assignments/CreateAssignmentModal';

import {
    useGetAssignmentsByBootcampQuery,
    useCreateAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation
} from '../../../../features/assignment/assignmentApi';
import toast from 'react-hot-toast';

export default function BootcampAssignmentsTab({ bootcampId }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const { data: assignmentsResponse, isLoading, error } = useGetAssignmentsByBootcampQuery(bootcampId);
    const [createAssignment] = useCreateAssignmentMutation();
    const [updateAssignment] = useUpdateAssignmentMutation();
    const [deleteAssignment] = useDeleteAssignmentMutation();

    const assignments = assignmentsResponse?.data || [];

    const filteredAssignments = assignments.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await deleteAssignment(id).unwrap();
                toast.success('Assignment deleted');
            } catch (err) {
                toast.error(err.data?.message || 'Failed to delete');
            }
        }
    };

    const handleCreate = async (formData) => {
        try {
            await createAssignment(formData).unwrap();
            toast.success('Assignment created');
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || 'Failed to create');
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await updateAssignment({ id: selectedAssignment._id, data: formData }).unwrap();
            toast.success('Assignment updated');
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || 'Failed to update');
        }
    };

    const openCreateModal = () => {
        setSelectedAssignment(null);
        setIsModalOpen(true);
    };

    const openEditModal = (assignment) => {
        setSelectedAssignment(assignment);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Input
                    className="flex-1 max-w-sm"
                    icon={<Search size={20} />}
                    placeholder="Search assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" icon={<Plus size={18} />} onClick={openCreateModal}>
                    Create Assignment
                </Button>
            </div>

            <CreateAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleCreate}
                onUpdate={handleUpdate}
                assignment={selectedAssignment}
                bootcampId={bootcampId}
            />

            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Assignment</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Due Date</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9] text-center">Points</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9] text-center">Submissions</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-[#64748b]">Loading assignments...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-red-500">Error loading assignments</td></tr>
                            ) : filteredAssignments.length > 0 ? (
                                filteredAssignments.map((assignment) => (
                                    <tr key={assignment._id} className="hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <CheckSquare size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#0f172a]">{assignment.title}</p>
                                                    <p className="text-[0.7rem] text-[#64748b]">ID: {assignment._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#475569]">{new Date(assignment.deadline).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-[#0f172a] font-semibold text-center">{assignment.points || 0}</td>
                                        <td className="px-6 py-4 text-sm text-[#0f172a] font-semibold text-center">
                                            {assignment.submissionsCount || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(assignment)}
                                                    className="p-1.5 text-[#94a3b8] hover:text-[#1111d4] hover:bg-[#1111d4]/5 rounded transition-all"
                                                    title="Edit Assignment"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(assignment._id)}
                                                    className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded transition-all"
                                                    title="Delete Assignment"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-[#64748b]">
                                        No assignments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
