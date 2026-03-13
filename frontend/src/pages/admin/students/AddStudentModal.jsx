import React, { useState, useRef } from 'react';
import { X, UserPlus, CheckCircle2, Camera, User } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { useRegisterMutation } from '../../../features/auth/authServiceApi';
import { toast } from 'react-hot-toast';

const AddStudentModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentBootcampId: '',
        domainId: ''
    });

    const { data: bootcampsResponse } = useGetAllBootcampsQuery({});
    const { data: domainsResponse } = useGetAllDomainsQuery();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const bootcamps = bootcampsResponse?.data || [];
    const domains = domainsResponse?.data || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ ...formData, role: 'student' }).unwrap();
            toast.success('Student registered successfully! Default password: BMS@2024');
            onClose();
            setFormData({ name: '', email: '', studentBootcampId: '', domainId: '' });
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to register student');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Register New Student"
            icon={<UserPlus size={22} />}
        >
            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Full Name"
                        autoFocus
                        placeholder="e.g. Alex Rivera"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="alex.r@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Select
                        label="Target Bootcamp"
                        placeholder="Select bootcamp"
                        required
                        value={formData.studentBootcampId}
                        onChange={(e) => setFormData({ ...formData, studentBootcampId: e.target.value })}
                        options={bootcamps.map(bc => ({ value: bc._id, label: bc.name }))}
                    />
                    <Select
                        label="Assigned Domain"
                        placeholder="Select domain"
                        required
                        value={formData.domainId}
                        onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                        options={domains.map(d => ({ value: d._id, label: d.name }))}
                    />
                </div>

                <div className="p-4 bg-[var(--color-primary-muted)]/30 rounded-xl border border-[var(--color-primary)]/10 flex gap-3">
                    <CheckCircle2 size={18} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium leading-relaxed">
                        Student will be registered with default password <span className="font-bold">BMS@2024</span>. They should change it upon first login.
                    </p>
                </div>


                <div className="flex gap-3 pt-6 border-t border-[var(--color-border)] mt-6">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isRegistering}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        className="flex-1"
                        disabled={isRegistering}
                    >
                        {isRegistering ? 'Registering...' : 'Add Student'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddStudentModal;
