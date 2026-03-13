import React, { useState } from 'react';
import { Bold, Italic, List, Link, Image, Quote } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';

const AnnouncementModal = ({ isOpen, onClose, onPost, announcement, isAdmin = false }) => {
    const { data: domainsData } = useGetAllDomainsQuery();
    const { data: bootcampsData } = useGetAllBootcampsQuery(undefined, { skip: !isAdmin });
    const domains = domainsData?.data || [];
    const bootcamps = bootcampsData?.data || [];

    const [formData, setFormData] = useState(announcement ? {
        title: announcement.title || '',
        targetGroup: announcement.targetGroup || 'All Students',
        description: announcement.description || '',
        urgentEmail: announcement.urgentEmail || false,
        bootcampId: announcement.bootcampId || 'all',
    } : {
        title: '',
        targetGroup: 'all',
        description: '',
        urgentEmail: false,
        bootcampId: 'all',
    });

    // Reset form when announcement changes or modal opens
    React.useEffect(() => {
        if (announcement) {
            setFormData({
                title: announcement.title || '',
                targetGroup: announcement.domainId || 'all',
                description: announcement.description || '',
                urgentEmail: announcement.urgentEmail || false,
                bootcampId: announcement.bootcampId || 'all',
            });
        } else {
            setFormData({ title: '', targetGroup: 'all', description: '', urgentEmail: false, bootcampId: 'all' });
        }
    }, [announcement, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) return;
        onPost(formData);
        onClose();
        setFormData({ title: '', targetGroup: 'all', description: '', urgentEmail: false, bootcampId: 'all' });
    };

    const domainOptions = [
        { value: 'all', label: 'All Students' },
        ...domains.map(d => ({ value: d._id, label: d.name }))
    ];

    const bootcampOptions = [
        { value: 'all', label: 'All Bootcamps (Global)' },
        ...bootcamps.map(b => ({ value: b._id, label: b.name }))
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={announcement ? "Edit Announcement" : "Post New Announcement"}
            size="md"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Announcement Title */}
                <Input
                    label="Announcement Title"
                    placeholder="e.g. Weekly Workshop Schedule Update"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                {/* Target Bootcamp (Admin Only) */}
                {isAdmin && (
                    <Select
                        label="Target Bootcamp"
                        value={formData.bootcampId}
                        onChange={(e) => setFormData({ ...formData, bootcampId: e.target.value })}
                        placeholder="Choose target bootcamp"
                        options={bootcampOptions}
                    />
                )}

                {/* Target Student Group */}
                <Select
                    label="Target Student Group (Domain)"
                    value={formData.targetGroup}
                    onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}
                    placeholder="Choose target student group"
                    options={domainOptions}
                />

                {/* Announcement Content */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-text-main)]">Announcement Content</label>
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 focus-within:border-[var(--color-primary)] transition-all">
                        {/* Toolbar */}
                        <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                            <button type="button" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Bold size={18} /></button>
                            <button type="button" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Italic size={18} /></button>
                            <button type="button" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><List size={18} /></button>
                            <button type="button" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Link size={18} /></button>
                            <button type="button" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Image size={18} /></button>
                            <div className="w-px h-6 bg-[var(--color-border)]" />
                            <button type="button" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Quote size={18} /></button>
                        </div>
                        {/* Textarea */}
                        <textarea
                            placeholder="Write your announcement details here..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-transparent px-4 py-3 text-sm min-h-[150px] focus:outline-none resize-none text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]"
                            required
                        />
                    </div>
                </div>

                {/* Toggle Urgent Email */}
                {/* <div className="flex items-center justify-between p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--color-text-main)]">Send urgent email notification</span>
                        <span className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">Students will receive an immediate push and email alert.</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, urgentEmail: !formData.urgentEmail })}
                        className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${formData.urgentEmail ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.urgentEmail ? 'right-1' : 'left-1'}`} />
                    </button>
                </div> */}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-[var(--color-border)]">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                    >
                        {announcement ? "Update Announcement" : "Post Announcement"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AnnouncementModal;
