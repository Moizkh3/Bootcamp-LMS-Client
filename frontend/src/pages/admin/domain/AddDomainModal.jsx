import { FolderPlus, Info, Camera, User } from 'lucide-react';
import React, { useState, useRef } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { useGetUsersByRoleQuery } from '../../../features/user/userApi';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';

const AddDomainModal = ({ isOpen, onClose, onAdd }) => {
    const { data: usersResponse } = useGetUsersByRoleQuery('teacher');
    const { data: bootcampsResponse } = useGetAllBootcampsQuery();

    const teachers = usersResponse?.data || [];
    const bootcamps = bootcampsResponse?.data || [];

    const [formData, setFormData] = useState({
        name: '',
        status: 'Active',
        type: 'Core Track',
        mentorName: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
        setFormData({
            name: '',
            status: 'Active',
            type: 'Core Track',
            mentorName: '',
            mentorAvatar: ''
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Domain"
            icon={<FolderPlus size={22} />}
        >
            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Domain Name"
                        required
                        autoFocus
                        placeholder="e.g. Fullstack Web Dev"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Select
                        label="Initial Status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        options={[
                            "Active",
                            "Inactive",
                            "Archived"
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Select
                        label="Lead Mentor"
                        placeholder="Select a mentor"
                        value={formData.mentorName}
                        onChange={(e) => {
                            const selectedTeacher = teachers.find(t => t.name === e.target.value);
                            setFormData({
                                ...formData,
                                mentorName: e.target.value,
                                // mentorAvatar: selectedTeacher?.avatar || '' // If we had avatars
                            });
                        }}
                        options={teachers.map(t => ({
                            label: t.name,
                            value: t.name
                        }))}
                    />

                </div>

                <div className="p-4 bg-[var(--color-primary-muted)]/30 border border-[var(--color-primary)]/10 rounded-xl flex gap-3">
                    <Info size={18} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium leading-relaxed">
                        Creating a new domain will allow you to assign specialized mentors and track specific student cohorts within this technical track.
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
