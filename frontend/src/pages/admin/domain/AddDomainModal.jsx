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
        bootcamp: '',
        status: 'Active',
        type: 'Core Track',
        mentorName: '',
        mentorAvatar: ''
    });
    const fileInputRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, mentorAvatar: url }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
        setFormData({
            name: '',
            bootcamp: '',
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
                        label="Assign Bootcamp"
                        required
                        placeholder="Select bootcamp"
                        value={formData.bootcamp}
                        onChange={(e) => setFormData({ ...formData, bootcamp: e.target.value })}
                        options={bootcamps.map(b => ({
                            label: b.name,
                            value: b._id
                        }))}
                    />
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
                    <div className="flex flex-col items-center gap-4 py-2 border-b border-[var(--color-border)] pb-6 mb-2">
                        <div className="relative group/avatar">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-[var(--color-primary)]/10 shadow-lg bg-gray-50 flex items-center justify-center border border-[var(--color-border)]">
                                {formData.mentorAvatar ? (
                                    <img src={formData.mentorAvatar} alt="mentor avatar" className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110 duration-500" />
                                ) : (
                                    <User size={32} className="text-gray-300" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--color-primary)] text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-soft)] transition-all hover:scale-110 active:scale-95"
                            >
                                <Camera size={14} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-[var(--color-text-main)]">Mentor Photo</p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current.click()}
                                className="text-[var(--color-primary)] font-bold text-xs mt-1"
                            >
                                Upload Photo
                            </Button>
                        </div>
                    </div>
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
