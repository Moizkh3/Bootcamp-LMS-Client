import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Layers, Type, CheckCircle2, Loader2 } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import {
    useCreateTeacherAssignmentMutation,
    useUpdateTeacherAssignmentMutation,
    useGetTeacherStatsQuery
} from '../../../features/teacher/teacherApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { toast } from 'react-hot-toast';

const CreateAssignmentModal = ({ isOpen, onClose, assignment }) => {
    const [createAssignment, { isLoading: isCreating }] = useCreateTeacherAssignmentMutation();
    const [updateAssignment, { isLoading: isUpdating }] = useUpdateTeacherAssignmentMutation();
    const { data: domainsData } = useGetAllDomainsQuery();
    const { data: statsData } = useGetTeacherStatsQuery();

    const domains = domainsData?.data || [];
    const activeBootcamps = statsData?.data?.activeBootcamps || [];

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        domain: '',
        bootcamp: '',
        deadline: '',
        module: '',
        status: 'Active',
        requiredLinks: ['frontendGithubUrl']
    });
    const [file, setFile] = useState(null);

    // Reset form when assignment changes or modal opens
    useEffect(() => {
        if (assignment && isOpen) {
            setFormData({
                title: assignment.title || '',
                description: assignment.description || '',
                domain: assignment.domain?._id || assignment.domain || (domains.length > 0 ? domains[0]._id : ''),
                bootcamp: assignment.bootcamp?._id || assignment.bootcamp || (activeBootcamps.length > 0 ? activeBootcamps[0]._id : ''),
                deadline: assignment.deadline ? new Date(assignment.deadline).toISOString().split('T')[0] : '',
                module: assignment.module || '',
                status: assignment.status || 'Active',
                requiredLinks: assignment.requiredLinks || ['frontendGithubUrl']
            });
            setFile(null);
        } else if (isOpen) {
            setFormData({
                title: '',
                description: '',
                domain: domains.length > 0 ? domains[0]._id : '',
                bootcamp: activeBootcamps.length > 0 ? activeBootcamps[0]._id : '',
                deadline: '',
                module: '',
                status: 'Active',
                requiredLinks: ['frontendGithubUrl']
            });
            setFile(null);
        }
    }, [assignment, isOpen, domains, activeBootcamps]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.deadline) {
            toast.error('All required fields are required');
            return;
        }


        try {
            if (assignment) {
                await updateAssignment({
                    id: assignment._id,
                    ...formData
                }).unwrap();
                toast.success('Assignment updated successfully');
            } else {
                const submitData = new FormData();
                submitData.append('title', formData.title);
                submitData.append('description', formData.description);
                submitData.append('domain', formData.domain);
                submitData.append('bootcamp', formData.bootcamp);
                submitData.append('deadline', formData.deadline);
                submitData.append('module', formData.module);
                submitData.append('status', formData.status);
                submitData.append('requiredLinks', JSON.stringify(formData.requiredLinks));
                if (file) {
                    submitData.append('document', file);
                }

                await createAssignment(submitData).unwrap();
                toast.success('Assignment created successfully');
            }
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to save assignment');
            console.error(err);
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={assignment ? "Edit Assignment" : "New Assignment"}
            subtitle={assignment ? "Update assignment details" : "Fill details to notify students"}
            size="md"
        >
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8">
                {/* Title Input */}
                <Input
                    label={
                        <span className="flex items-center gap-2">
                            <Type size={14} className="text-[var(--color-primary)]" />
                            Assignment Title
                        </span>
                    }
                    type="text"
                    required
                    placeholder="e.g., React Hooks Deep Dive"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={isLoading}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    {/* Description */}
                    <Input
                        label={
                            <span className="flex items-center gap-2">
                                <BookOpen size={14} className="text-[var(--color-info)]" />
                                Description
                            </span>
                        }
                        type="text"
                        required
                        placeholder="e.g., Build a full-stack dashboard..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={isLoading}
                    />

                    {/* Module Input */}
                    <Input
                        label={
                            <span className="flex items-center gap-2">
                                <Layers size={14} className="text-[var(--color-info)]" />
                                Module Name
                            </span>
                        }
                        type="text"
                        placeholder="e.g., Module 1: Introduction"
                        value={formData.module}
                        onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                        disabled={isLoading}
                    />

                    {/* Domain Select */}
                    <Select
                        label={
                            <span className="flex items-center gap-2">
                                <Layers size={14} className="text-[var(--color-primary)]" />
                                Domain
                            </span>
                        }
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        options={domains.map(d => ({ value: d._id, label: d.name }))}
                        disabled={isLoading}
                    />

                    {/* Bootcamp Select */}
                    <Select
                        label={
                            <span className="flex items-center gap-2">
                                <BookOpen size={14} className="text-[var(--color-primary)]" />
                                Bootcamp
                            </span>
                        }
                        value={formData.bootcamp}
                        onChange={(e) => setFormData({ ...formData, bootcamp: e.target.value })}
                        options={activeBootcamps.map(b => ({ value: b._id, label: b.name }))}
                        disabled={isLoading}
                    />
                </div>

                {/* Deadline Date */}
                <Input
                    label={
                        <span className="flex items-center gap-2">
                            <Calendar size={14} className="text-[var(--color-warning)]" />
                            Deadline Date
                        </span>
                    }
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    disabled={isLoading}
                />
 
                {/* Submission Links Selection */}
                <div className="space-y-4 p-6 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
                    <span className="text-sm font-bold text-[var(--color-text-main)] block mb-2">Required Submission Links</span>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: 'frontendGithubUrl', label: 'Frontend GitHub' },
                            { id: 'backendGithubUrl', label: 'Backend GitHub' },
                            { id: 'deployedUrl', label: 'Deployed URL' },
                            { id: 'behanceUrl', label: 'Behance' },
                            { id: 'figmaUrl', label: 'Figma' },
                            { id: 'document', label: 'Assignment Document Resource' }
                        ].map((link) => (
                            <label key={link.id} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.requiredLinks.includes(link.id)}
                                    onChange={(e) => {
                                        const newLinks = e.target.checked
                                            ? [...formData.requiredLinks, link.id]
                                            : formData.requiredLinks.filter(id => id !== link.id);
                                        setFormData({ ...formData, requiredLinks: newLinks });
                                    }}
                                    disabled={isLoading}
                                    className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                                    {link.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* File Upload Option */}
                {!assignment && (
                    <div className="space-y-4 p-6 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-[var(--color-text-main)] mb-2">Assignment Document Resource <span className="text-[var(--color-text-muted)] font-normal">(Optional)</span></span>
                        </div>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setFile(e.target.files[0])}
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm font-normal text-[var(--color-text-main)] outline-none cursor-pointer"
                        />
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 border-t border-[var(--color-border)]">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="secondary"
                        className="w-full sm:flex-1"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full sm:flex-[2]"
                        icon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        disabled={isLoading}
                    >
                        {isLoading ? (assignment ? "Updating..." : "Creating...") : (assignment ? "Update Assignment" : "Create Assignment")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateAssignmentModal;
