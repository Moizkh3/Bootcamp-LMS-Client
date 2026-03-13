import React, { useState } from 'react';
import StudentRow from './StudentRow';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EditStudentModal from './EditStudentModal';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import Breadcrumbs from '../../../components/common/Breadcrumbs';

const StudentTable = ({ students, onUpdate, onDelete, onToggleStatus }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (updatedStudent) => {
        onUpdate({ ...updatedStudent, _id: selectedStudent._id });
        setIsEditModalOpen(false);
    };

    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        await onDelete(selectedStudent._id);
        setIsDeleteModalOpen(false);
        setIsDeleting(false);
        setSelectedStudent(null);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <th className="px-4 py-3.5">Student Name</th>
                            <th className="px-4 py-3.5">Email</th>
                            <th className="px-4 py-3.5">Enrolled Bootcamp</th>
                            <th className="px-4 py-3.5">Domain</th>
                            <th className="px-4 py-3.5">Status</th>
                            <th className="px-4 py-3.5">Joined Date</th>
                            <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                            <StudentRow
                                key={student._id}
                                {...student}
                                onEdit={() => handleEdit(student)}
                                onToggleStatus={(currentStatus) => onToggleStatus(student._id, currentStatus)}
                                onDelete={() => handleDeleteClick(student)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 tracking-tight">
                    Showing <span className="font-extrabold text-slate-900">{students.length > 0 ? `1-${students.length}` : '0'}</span> of <span className="font-extrabold text-slate-900">{students.length}</span> students
                </p>
                <div className="flex items-center gap-2 opacity-0 pointer-events-none">
                    {/* Pagination hidden until backend implementation */}
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50" disabled>
                        <ChevronLeft size={18} />
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#3636e2] text-white font-black text-xs shadow-md shadow-[#3636e2]/20">1</button>
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-white transition-all text-xs">2</button>
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-white transition-all text-xs">3</button>
                    <span className="text-slate-400 mx-1 text-xs font-bold leading-none">...</span>
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-white transition-all text-xs">62</button>
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-white transition-all">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            <EditStudentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdate}
                student={selectedStudent}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedStudent?.name}
                isDeleting={isDeleting}
                message="Are you sure you want to delete this student? All academic records, attendance logs, and assignment history will be permanently lost."
            />
        </div>
    );
};

export default StudentTable;
