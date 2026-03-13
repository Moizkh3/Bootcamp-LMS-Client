import React, { useState, useRef } from 'react';
import { X, UserPlus, CheckCircle2, Camera, User } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { useGetAllBootcampsQuery, useGetBootcampByIdQuery } from '../../../features/bootcamp/bootcampApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { useRegisterMutation } from '../../../features/auth/authServiceApi';
import { toast } from 'react-hot-toast';

const AddStudentModal = ({ isOpen, onClose, bootcampId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentBootcampId: bootcampId || '',
        domainId: ''
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                email: '',
                studentBootcampId: bootcampId || '',
                domainId: ''
            });
        }
    }, [isOpen, bootcampId]);

    const { data: bootcampsResponse } = useGetAllBootcampsQuery({});
    const { data: domainsResponse } = useGetAllDomainsQuery({ skip: !!bootcampId });
    const { data: bootcampDataResponse } = useGetBootcampByIdQuery(bootcampId || '', { skip: !bootcampId });
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const bootcamps = bootcampsResponse?.data || [];
    const allDomains = domainsResponse?.data || [];
    
    const relevantDomains = bootcampId ? (bootcampDataResponse?.data?.domains || []) : allDomains;

    React.useEffect(() => {
        if (relevantDomains.length === 1 && !formData.domainId) {
            setFormData(prev => ({ ...prev, domainId: relevantDomains[0]._id }));
        }
    }, [relevantDomains, formData.domainId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ ...formData, role: 'student' }).unwrap();
            toast.success('Student registered successfully! Credentials have been sent to their email.');
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


                <div className={`grid grid-cols-1 ${bootcampId ? '' : 'md:grid-cols-2'} gap-5`}>
                    {!bootcampId && (
                    <Select
                        label="Target Bootcamp"
                        placeholder="Select bootcamp"
                        required
                        value={formData.studentBootcampId}
                        onChange={(e) => setFormData({ ...formData, studentBootcampId: e.target.value })}
                        options={bootcamps.map(bc => ({ value: bc._id, label: bc.name }))}
                    />
                    )}
                    {relevantDomains.length !== 1 && (
                        <Select
                            label="Assigned Domain"
                            placeholder="Select domain"
                            required
                            value={formData.domainId}
                            onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                            options={relevantDomains.map(d => ({ value: d._id, label: d.name }))}
                        />
                    )}
                </div>

                <div className="flex items-start gap-2 text-[11px] text-[var(--color-text-muted)] font-medium bg-[var(--color-surface-alt)] rounded-lg p-3">
                    <CheckCircle2 size={14} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                    Each student will receive a welcome email with their login credentials and a unique secure password.
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
