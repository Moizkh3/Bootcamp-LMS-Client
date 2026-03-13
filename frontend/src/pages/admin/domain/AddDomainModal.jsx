import { FolderPlus, Info } from 'lucide-react';
import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useGetUsersByRoleQuery } from '../../../features/user/userApi';

const AddDomainModal = ({ isOpen, onClose, onAdd }) => {
    const { data: usersResponse } = useGetUsersByRoleQuery('teacher');
    const teachers = usersResponse?.data || [];

    const [formData, setFormData] = useState({
        name: '',
        status: 'Active',
        type: 'Core Track',
        mentorIds: [], // Store array of teacher IDs
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.mentorIds.length === 0) {
            import('react-hot-toast').then(({ toast }) => {
                toast.error('Please assign at least one mentor to this domain');
            });
            return;
        }

        onAdd(formData);
        onClose();
        setFormData({
            name: '',
            status: 'Active',
            type: 'Core Track',
            mentorIds: [],
        });
    };

    const toggleMentor = (teacherId) => {
        setFormData(prev => ({
            ...prev,
            mentorIds: prev.mentorIds.includes(teacherId)
                ? prev.mentorIds.filter(id => id !== teacherId)
                : [...prev.mentorIds, teacherId]
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Domain"
            icon={<FolderPlus size={22} />}
        >
            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                <Input
                    label="Domain Name"
                    required
                    autoFocus
                    placeholder="e.g. Fullstack Web Dev"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                        Assigned Mentors
                    </label>
                    <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
                        {teachers.length > 0 ? (
                            teachers.map(teacher => (
                                <button
                                    key={teacher._id}
                                    type="button"
                                    onClick={() => toggleMentor(teacher._id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                        formData.mentorIds.includes(teacher._id)
                                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                                            : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
                                    }`}
                                >
                                    {teacher.name}
                                </button>
                            ))
                        ) : (
                            <p className="text-[10px] text-[var(--color-text-muted)] italic">No teachers available</p>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-[var(--color-primary-muted)]/30 border border-[var(--color-primary)]/10 rounded-xl flex gap-3">
                    <Info size={18} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium leading-relaxed">
                        Assigning multiple mentors allows different teachers to manage students and track progress within this technical track.
                    </p>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[var(--color-border)] mt-6">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        className="flex-1"
                    >
                        Create Domain
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddDomainModal;
