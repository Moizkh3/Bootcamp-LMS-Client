import React, { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';
import { useEffect } from 'react';

const QuickAddModal = ({ isOpen, onClose, onAdd }) => {
    const { data: bootcampsResponse } = useGetAllBootcampsQuery();
    const bootcamps = bootcampsResponse?.data || [];

    const [domainName, setDomainName] = useState('');
    const [bootcamp, setBootcamp] = useState('');

    useEffect(() => {
        if (bootcamps.length > 0 && !bootcamp) {
            setBootcamp(bootcamps[0].name);
        }
    }, [bootcamps, bootcamp]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!domainName.trim()) return;

        onAdd({
            name: domainName,
            bootcamp: bootcamp,
            status: 'Active',
            type: 'Core Track',
            mentorName: 'TBD',
            mentorAvatar: ''
        });

        setDomainName('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Quick Add Domain"
            icon={<Plus size={22} />}
            size="sm"
        >
            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <Input
                    label="Domain Name"
                    autoFocus
                    required
                    placeholder="e.g. Cloud Architecture"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                />

                <Select
                    label="Select Bootcamp"
                    value={bootcamp}
                    onChange={(e) => setBootcamp(e.target.value)}
                    options={bootcamps.map(b => ({
                        label: b.name,
                        value: b.name
                    }))}
                />

                <div className="pt-2 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3.5 bg-white text-[var(--color-text-main)] font-bold text-sm rounded-xl hover:bg-[var(--color-surface-alt)] transition-all active:scale-95 border border-[var(--color-border)]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[var(--color-primary)] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 transition-all text-sm active:scale-95"
                    >
                        Create Now
                    </button>
                </div>

                <div className="p-4 bg-[var(--color-surface-alt)] rounded-xl flex items-center gap-3 border border-[var(--color-border)]">
                    <Info size={16} className="text-[var(--color-text-muted)] shrink-0" />
                    <p className="text-[10px] text-[var(--color-text-muted)] font-medium leading-relaxed">
                        This will create a domain with default settings. Use the full form for more control.
                    </p>
                </div>
            </form>
        </Modal>
    );
};

export default QuickAddModal;
