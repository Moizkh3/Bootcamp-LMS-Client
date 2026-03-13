import React, { useState } from 'react';
import { Upload, Plus, Search, User as UserIcon, Mail, Hash, ChevronRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetTeacherStudentsQuery } from '../../../features/teacher/teacherApi';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import BulkUploadModal from '../../admin/students/BulkUploadModal';
import AddStudentModal from '../../admin/students/AddStudentModal';
import { toast } from 'react-hot-toast';

const TeacherStudentDirectory = () => {
    const navigate = useNavigate();
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [domainFilter, setDomainFilter] = useState('All Domains');

    const { data: response, isLoading, error } = useGetTeacherStudentsQuery();
    const students = response?.data || [];

    // Derive unique domains from students for the filter
    const availableDomains = ['All Domains', ...new Set(students.map(s => s.domainId?.name).filter(Boolean))];

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.rollNo.toString().includes(searchTerm);
        
        const matchesDomain = domainFilter === 'All Domains' || student.domainId?.name === domainFilter;

        return matchesSearch && matchesDomain;
    });

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]">Loading students...</div>;
    if (error) return (
        <div className="text-red-500 text-center py-10">
            <p className="text-lg font-bold">Error loading students</p>
            <p className="text-sm opacity-70">{error?.data?.message || JSON.stringify(error)}</p>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8">
            <Breadcrumbs />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">My Students</h2>
                    <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">Manage students in your assigned bootcamps</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        icon={<Upload size={18} />}
                        onClick={() => setIsBulkModalOpen(true)}
                    >
                        Bulk Upload
                    </Button>
                    <Button
                        variant="primary"
                        icon={<Plus size={18} />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Student
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search students by name, email, or roll no..."
                            className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-full md:w-64 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
                    <select
                        className="w-full py-3 px-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-bold text-[var(--color-text-main)] appearance-none cursor-pointer"
                        value={domainFilter}
                        onChange={(e) => setDomainFilter(e.target.value)}
                    >
                        {availableDomains.map(domain => (
                            <option key={domain} value={domain}>{domain}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                    <div 
                        key={student._id}
                        onClick={() => navigate(`/teacher/students/${student._id}`)}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/20 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--color-text-main)]">{student.name}</h3>
                                <p className="text-xs text-[var(--color-text-muted)] font-medium">Roll No: {student.rollNo}</p>
                            </div>
                            <ChevronRight className="ml-auto text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" size={18} />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium">
                                <Mail size={14} className="text-[var(--color-primary)]" />
                                {student.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium">
                                <Hash size={14} className="text-[var(--color-primary)]" />
                                {student.studentBootcampId?.name || 'No Bootcamp'}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium">
                                <Layers size={14} className="text-[var(--color-primary)]" />
                                {student.domainId?.name || 'No Domain'}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                student.studentStatus === 'enrolled' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                                {student.studentStatus}
                            </span>
                            <span className="text-xs font-bold text-[var(--color-primary)] group-hover:underline">View Progress Details</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-20 bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)]">
                    <p className="text-[var(--color-text-muted)] font-medium">No students found</p>
                </div>
            )}

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

export default TeacherStudentDirectory;
