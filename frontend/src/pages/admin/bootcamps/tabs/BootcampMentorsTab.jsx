import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import AddTeacherModal from '../../teachers/AddTeacherModal';

import { useGetAllUsersQuery } from '../../../../features/user/userApi';

export default function BootcampMentorsTab({ bootcampId }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data: mentorsResponse, isLoading, error } = useGetAllUsersQuery({
        role: 'teacher',
        bootcampId
    });

    const mentors = mentorsResponse?.users || [];

    const filteredMentors = mentors.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.role && m.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleRemoveMentor = (id) => {
        console.log('Remove mentor', id);
    };

    const handleAddMentor = (teacherData) => {
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Input
                    className="flex-1 max-w-sm"
                    icon={<Search size={20} />}
                    placeholder="Search mentors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsAddModalOpen(true)}>
                    Add Mentor
                </Button>
            </div>

            <AddTeacherModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMentor}
            />

            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Mentor Name</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Role</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Joined Date</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                            {isLoading ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-[#64748b]">Loading mentors...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-red-500">Error loading mentors</td></tr>
                            ) : filteredMentors.length > 0 ? (
                                filteredMentors.map((mentor) => (
                                    <tr key={mentor._id} className="hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#0f172a]">{mentor.name}</p>
                                            <p className="text-[0.7rem] text-[#64748b]">ID: {mentor._id}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#475569]">{mentor.teacherStatus || 'Instructor'}</td>
                                        <td className="px-6 py-4 text-sm text-[#475569]">{new Date(mentor.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemoveMentor(mentor._id)}
                                                className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded transition-all"
                                                title="Remove Mentor"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-[#64748b]">
                                        No mentors found.
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
