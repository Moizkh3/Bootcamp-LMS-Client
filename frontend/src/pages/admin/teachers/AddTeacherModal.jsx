import React, { useState } from 'react';
import { UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Select from '../../../components/common/Select';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { useRegisterMutation } from '../../../features/auth/authServiceApi';
import { toast } from 'react-hot-toast';

const AddTeacherModal = ({ isOpen, onClose, bootcampId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        teacherBootcampIds: bootcampId ? [bootcampId] : [],
        teacherDomainIds: []
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                email: '',
                teacherBootcampIds: bootcampId ? [bootcampId] : [],
                teacherDomainIds: []
            });
        }
    }, [isOpen, bootcampId]);

    const { data: bootcampsResponse, isLoading: bootcampsLoading, error: bootcampsError } = useGetAllBootcampsQuery({ status: 'active' });
    const { data: domainsResponse, isLoading: domainsLoading, error: domainsError } = useGetAllDomainsQuery();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const bootcamps = bootcampsResponse?.data || [];
    const domains = domainsResponse?.data || [];

    const handleDomainChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, teacherDomainIds: selectedOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.teacherBootcampIds.length === 0) {
            toast.error('Please select at least one bootcamp');
            return;
        } 



        try {
            const dataToSubmit = {
                ...formData,
                role: 'teacher'
            };
            console.log(dataToSubmit);
            await register(dataToSubmit).unwrap();
            toast.success('Teacher account created & Welcome Email Sent!');
            onClose();
            setFormData({ name: '', email: '', teacherBootcampIds: [], teacherDomainIds: [] });
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to create teacher account');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Teacher Account"
            icon={<UserPlus size={22} />}
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {(bootcampsError || domainsError) && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600">
                        <AlertCircle size={18} className="shrink-0" />
                        <p className="text-xs font-medium">Error loading data. Please check connection or try again.</p>
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Teacher Full Name"
                        required
                        placeholder="e.g. Dr. Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Email Address"
                        required
                        type="email"
                        placeholder="sarah.j@bootcamp.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <div className={`grid grid-cols-1 ${bootcampId ? '' : 'md:grid-cols-2'} gap-4`}>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Assigned Domains (Ctrl+Click)
                            </label>
                            <select
                                multiple
                                required
                                value={formData.teacherDomainIds}
                                onChange={handleDomainChange}
                                className="w-full px-4 py-2 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-normal text-[var(--color-text-main)] outline-none min-h-[100px]"
                                disabled={domainsLoading}
                            >
                                {domains.map(d => (
                                    <option key={d._id} value={d._id} className="py-1 px-2">
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                            {domainsLoading && <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold uppercase"><Loader2 size={12} className="animate-spin" /> Fetching domains...</div>}
                        </div>

                        {!bootcampId && (
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Assigned Bootcamps (Ctrl+Click to select multiple)
                            </label>
                            <select
                                multiple
                                required
                                value={formData.teacherBootcampIds}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({ ...formData, teacherBootcampIds: selectedOptions });
                                }}
                                className="w-full px-4 py-2 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-normal text-[var(--color-text-main)] outline-none min-h-[100px]"
                                disabled={bootcampsLoading}
                            >
                                {bootcamps.map(bc => (
                                    <option key={bc._id} value={bc._id} className="py-1 px-2">
                                        {bc.name}
                                    </option>
                                ))}
                            </select>
                            {bootcampsLoading && <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold uppercase"><Loader2 size={12} className="animate-spin" /> Fetching bootcamps...</div>}
                        </div>
                        )}
                    </div>
                </div>



                <div className="flex gap-3 pt-6 border-t border-slate-100">
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
                        {isRegistering ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddTeacherModal;

// export default AddTeacherModal;
