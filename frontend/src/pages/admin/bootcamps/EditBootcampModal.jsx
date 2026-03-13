import React, { useState, useEffect } from 'react';
import { Edit3, Users } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { useGetAllUsersQuery } from '../../../features/user/userApi';

const EditBootcampModal = ({ isOpen, onClose, onSave, bootcamp }) => {
    const { data: teachersResponse, isSuccess: isTeachersLoaded } = useGetAllUsersQuery({ role: 'teacher' }, { skip: !isOpen });
    const allTeachers = teachersResponse?.users || [];
    
    const [hasInitialized, setHasInitialized] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: '',
        color: '#1111d4',
        teacherIds: []
    });

    useEffect(() => {
        if (!isOpen) {
            setHasInitialized(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (bootcamp && isOpen && !hasInitialized && isTeachersLoaded) {
            // Helper to format date to YYYY-MM-DD for input type="date"
            const formatDate = (dateValue) => {
                if (!dateValue) return '';
                try {
                    const date = new Date(dateValue);
                    if (isNaN(date.getTime())) return '';
                    return date.toISOString().split('T')[0];
                } catch (e) {
                    return '';
                }
            };

            // Find assigned teachers
            const initialTeacherIds = allTeachers
                .filter(t => t.teacherBootcampIds?.some(b => b === bootcamp._id || b._id === bootcamp._id))
                .map(t => t._id);

            setFormData({
                name: bootcamp.name || '',
                description: bootcamp.description || '',
                startDate: formatDate(bootcamp.startDate),
                endDate: formatDate(bootcamp.endDate),
                status: bootcamp.status || 'Active',
                color: bootcamp.color || '#1111d4',
                teacherIds: initialTeacherIds
            });
            setHasInitialized(true);
        }
    }, [bootcamp, isOpen, hasInitialized, isTeachersLoaded, allTeachers]);

    const toggleTeacher = (teacherId) => {
        setFormData(prev => {
            const isSelected = prev.teacherIds.includes(teacherId);
            return {
                ...prev,
                teacherIds: isSelected 
                    ? prev.teacherIds.filter(id => id !== teacherId)
                    : [...prev.teacherIds, teacherId]
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Bootcamp"
            icon={<Edit3 size={22} />}
            size="md"
        >
            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <Input
                    label="Program Name"
                    required
                    placeholder="e.g. Full Stack Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                        Program Description
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Provide a detailed description of the bootcamp..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-normal text-[var(--color-text-main)] outline-none resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                    <Input
                        label="End Date"
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                </div>

                <Select
                    label="Current Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    options={[
                        "Active",
                        "Completed",
                        "Scheduled"
                    ]}
                />

                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                        Assigned Mentors
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 py-2">
                        {allTeachers.length > 0 ? allTeachers.map(teacher => (
                            <button
                                key={teacher._id}
                                type="button"
                                onClick={() => toggleTeacher(teacher._id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                    formData.teacherIds.includes(teacher._id)
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <Users size={12} className={formData.teacherIds.includes(teacher._id) ? "text-blue-500" : "text-slate-400"} />
                                {teacher.name}
                            </button>
                        )) : (
                            <p className="text-xs text-slate-400 italic">No mentors available.</p>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3.5 bg-white text-[var(--color-text-main)] font-bold text-sm rounded-xl hover:bg-[var(--color-surface-alt)] transition-all active:scale-95 border border-[var(--color-border)]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[var(--color-primary)] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 transition-all text-sm active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditBootcampModal;
