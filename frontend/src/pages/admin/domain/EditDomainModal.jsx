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
        studentsCount: 0
    });



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
