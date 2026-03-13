import React, { useState, useEffect, useRef } from 'react';
import { Pencil, X, CheckCircle2 } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';

import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';

const EditStudentModal = ({ isOpen, onClose, onSave, student }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentBootcampId: '',
        domainId: '',
        studentStatus: ''
    });

    const { data: bootcampsResponse } = useGetAllBootcampsQuery({});
    const { data: domainsResponse } = useGetAllDomainsQuery();

    const bootcamps = bootcampsResponse?.data || [];
    const domains = domainsResponse?.data || [];



    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                studentBootcampId: student.studentBootcampId?._id || student.studentBootcampId || '',
                domainId: student.domainId?._id || student.domainId || '',
                studentStatus: student.studentStatus || ''
            });
        }
    }, [student]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Student Profile"
            icon={<Pencil size={22} />}
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4">
                    <div className="space-y-4">
                        <Input
                            label="Student Name"
                            required
                            placeholder="Alex Rivera"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Email Address"
                            required
                            type="email"
                            placeholder="alex.r@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Enrolled Bootcamp"
                                value={formData.studentBootcampId}
                                onChange={(e) => setFormData({ ...formData, studentBootcampId: e.target.value })}
                                options={bootcamps.map(bc => ({ value: bc._id, label: bc.name }))}
                            />
                            <Select
                                label="Domain"
                                value={formData.domainId}
                                onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                                options={domains.map(d => ({ value: d._id, label: d.name }))}
                            />
                        </div>

                        <Select
                            label="Student Status"
                            value={formData.studentStatus}
                            onChange={(e) => setFormData({ ...formData, studentStatus: e.target.value })}
                            options={[
                                { value: 'enrolled', label: 'Active' },
                                { value: 'completed', label: 'Graduated' },
                                { value: 'dropout', label: 'Suspended' },
                                { value: 'suspended', label: 'Inactive' }
                            ]}
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-100">
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
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditStudentModal;
