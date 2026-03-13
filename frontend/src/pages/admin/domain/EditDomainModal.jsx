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
        bootcamp: '',
        status: '',
        type: '',
        mentorName: '',
        mentorAvatar: '',
        studentsCount: 0
    });
    const fileInputRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, mentorAvatar: url }));
        }
    };

    useEffect(() => {
        if (domainData) {
            setFormData(domainData);
        }
    }, [domainData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
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

                <Select
                    label="Bootcamp"
                    value={formData.bootcamp}
                    onChange={(e) => setFormData({ ...formData, bootcamp: e.target.value })}
                    options={bootcamps.map(b => ({
                        label: b.name,
                        value: b.name
                    }))}
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

                <Select
                    label="Lead Mentor"
                    placeholder="Select a mentor"
                    value={formData.mentorName}
                    onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
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
                            Change Photo
                        </Button>
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
