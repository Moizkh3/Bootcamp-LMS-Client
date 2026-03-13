import { Pencil, AlertCircle, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Select from '../../../components/common/Select';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';

const EditTeacherModal = ({ isOpen, onClose, onSave, teacher }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        teacherBootcampIds: [],
        teacherDomainIds: []
    });

    const { data: bootcampsResponse, isLoading: bootcampsLoading, error: bootcampsError } = useGetAllBootcampsQuery({ status: 'active' });
    const { data: domainsResponse, isLoading: domainsLoading, error: domainsError } = useGetAllDomainsQuery();

    const bootcamps = bootcampsResponse?.data || [];
    const domains = domainsResponse?.data || [];

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.name || '',
                email: teacher.email || '',
                teacherBootcampIds: teacher.teacherBootcampIds?.map(b => b._id || b) || [],
                teacherDomainIds: teacher.teacherDomainIds?.map(d => d._id || d) || (teacher.domainId ? [teacher.domainId?._id || teacher.domainId] : [])
            });
        }
    }, [teacher]);

    const handleBootcampChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, teacherBootcampIds: selectedOptions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Teacher Profile"
            icon={<Pencil size={22} />}
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {(bootcampsError || domainsError) && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600">
                        <AlertCircle size={18} className="shrink-0" />
                        <p className="text-xs font-medium">Error loading data. Please try again.</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Assigned Domains (Ctrl+Click)
                            </label>
                            <select
                                multiple
                                required
                                value={formData.teacherDomainIds}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({ ...formData, teacherDomainIds: selectedOptions });
                                }}
                                className="w-full px-4 py-2 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-normal text-[var(--color-text-main)] outline-none min-h-[80px]"
                                disabled={domainsLoading}
                            >
                                {domains.map(d => (
                                    <option key={d._id} value={d._id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                            {domainsLoading && <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold uppercase"><Loader2 size={12} className="animate-spin" /> Fetching...</div>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Assigned Bootcamps (Ctrl+Click)
                            </label>
                            <select
                                multiple
                                required
                                value={formData.teacherBootcampIds}
                                onChange={handleBootcampChange}
                                className="w-full px-4 py-2 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-normal text-[var(--color-text-main)] outline-none min-h-[80px]"
                                disabled={bootcampsLoading}
                            >
                                {bootcamps.map(bc => (
                                    <option key={bc._id} value={bc._id}>
                                        {bc.name}
                                    </option>
                                ))}
                            </select>
                            {bootcampsLoading && <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold uppercase"><Loader2 size={12} className="animate-spin" /> Fetching...</div>}
                        </div>
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
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditTeacherModal;
