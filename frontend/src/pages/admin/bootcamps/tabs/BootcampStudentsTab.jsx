import React, { useState } from 'react';
import { Plus, Trash2, Search, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import AddStudentModal from '../../students/AddStudentModal';
import BulkUploadModal from '../../students/BulkUploadModal';
import { UploadCloud } from 'lucide-react';

import { useGetAllUsersQuery } from '../../../../features/user/userApi';

export default function BootcampStudentsTab({ bootcampId }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const { data: usersResponse, isLoading, error } = useGetAllUsersQuery({
        role: 'student',
        bootcampId
    });

    const students = usersResponse?.users || [];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemoveStudent = (id) => {
        // Mutation for removing student from bootcamp to be implemented
        console.log('Remove student', id);
    };

    const handleAddStudent = (studentData) => {
        // Redux handles re-fetching after successful modal action if configured
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Input
                    className="flex-1 max-w-sm"
                    icon={<Search size={20} />}
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Button variant="secondary" icon={<UploadCloud size={18} />} onClick={() => setIsBulkModalOpen(true)}>
                        Bulk Upload
                    </Button>
                    <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsAddModalOpen(true)}>
                        Add Student
                    </Button>
                </div>
            </div>

            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddStudent}
                bootcampId={bootcampId}
            />

            <BulkUploadModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                bootcampId={bootcampId}
            />

            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Student Name</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Email</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Status</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                            {isLoading ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-[#64748b]">Loading students...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-red-500">Error loading students</td></tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#0f172a]">{student.name}</p>
                                            <p className="text-[0.7rem] text-[#64748b]">ID: {student._id}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#475569]">{student.email}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold border ${student.studentStatus === 'enrolled' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    student.studentStatus === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}
                                            >
                                                {student.studentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => navigate(`/students/${student._id}`)}
                                                    className="p-1.5 text-[#94a3b8] hover:text-[#1111d4] hover:bg-[#1111d4]/5 rounded transition-all"
                                                    title="View Profile"
                                                >
                                                    <ExternalLink size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveStudent(student._id)}
                                                    className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded transition-all"
                                                    title="Remove Student"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-[#64748b]">
                                        No students found.
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
