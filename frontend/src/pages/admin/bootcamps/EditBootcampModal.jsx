import React, { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';

const EditBootcampModal = ({ isOpen, onClose, onSave, bootcamp }) => {
    const [formData, setFormData] = useState({
        name: '',
        start: '',
        end: '',
        status: '',
        color: '#1111d4'
    });

    useEffect(() => {
        if (bootcamp) {
            setFormData({
                name: bootcamp.name,
                start: bootcamp.start,
                end: bootcamp.end,
                status: bootcamp.status,
                color: bootcamp.color
            });
        }
    }, [bootcamp]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Bootcamp"
            icon={<Edit3 size={22} />}
            size="md"
        >
            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <Input
                    label="Program Name"
                    required
                    placeholder="e.g. Full Stack Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        required
                        placeholder="MMM DD, YYYY"
                        value={formData.start}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    />
                    <Input
                        label="End Date"
                        required
                        placeholder="MMM DD, YYYY"
                        value={formData.end}
                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    />
                </div>

                <Select
                    label="Current Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    options={[
                        "Active",
                        "Completed",
                        "Scheduled"
                    ]}
                />

                <div className="pt-4 flex gap-3">
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
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditBootcampModal;
