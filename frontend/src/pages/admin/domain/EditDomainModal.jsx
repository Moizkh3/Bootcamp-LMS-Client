import { FolderEdit, Camera, User } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { useGetUsersByRoleQuery } from '../../../features/user/userApi';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';

const EditDomainModal = ({ isOpen, onClose, onSave, domainData }) => {
    const { data: usersResponse } = useGetUsersByRoleQuery('teacher');
    const { data: bootcampsResponse } = useGetAllBootcampsQuery();

    const teachers = usersResponse?.data || [];
    const bootcamps = bootcampsResponse?.data || [];

    const [formData, setFormData] = useState({
        name: '',
        status: '',
        type: '',
        mentorIds: [],
    });

    useEffect(() => {
        if (domainData) {
            // Normalize mentorIds to be an array of IDs (strings)
            const normalizedMentorIds = (domainData.mentorIds || []).map(m => 
                typeof m === 'object' ? m._id : m
            );

            // Handle legacy mentorId if mentorIds is empty
            if (normalizedMentorIds.length === 0 && domainData.mentorId) {
                normalizedMentorIds.push(domainData.mentorId);
            }

            setFormData({
                ...domainData,
                mentorIds: normalizedMentorIds
            });
        }
    }, [domainData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
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
            title="Edit Domain"
            icon={<FolderEdit size={22} />}
            size="md"
        >
            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <Input
                    label="Domain Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Web Development"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        options={[
                            "Active",
                            "Inactive",
                            "Archived"
                        ]}
                    />
                    <Select
                        label="Type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        options={[
                            "Core Track",
                            "Specialized",
                            "Elective"
                        ]}
                    />
                </div>

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
                                        formData.mentorIds?.includes(teacher._id)
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
                        Update Domain
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditDomainModal;
