import React from 'react';
import { Calendar, BookOpen, Layers, CheckCircle2, Users, ArrowRight, Clock } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

const AssignmentDetailModal = ({ isOpen, onClose, assignment, onToggleStatus, onEdit }) => {
    if (!isOpen || !assignment) return null;

    const total = assignment.totalStudentsCount || 0;
    const submitted = assignment.submissionsCount || 0;
    const submissionRate = total > 0 ? Math.round((submitted / total) * 100) : 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={assignment.title}
            size="lg"
            showClose={true}
        >
            <div className="p-6 md:p-8">
                {/* Header Info */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${(assignment.status === 'Active' || assignment.status === 'published')
                        ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success)]/20'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                        }`}>
                        {assignment.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                        <Layers size={14} className="text-[var(--color-primary)]" />
                        {assignment.domain?.name || assignment.domain || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest ml-auto">
                        <BookOpen size={16} className="text-[var(--color-info)]" />
                        {assignment.description || 'No Description'}
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
                    <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider leading-none mb-1">Submissions</p>
                                <p className="text-lg md:text-xl font-bold text-[var(--color-text-main)]">{assignment.submissionsCount ?? 0} / {assignment.totalStudentsCount ?? 0}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Progress</span>
                                <span className="text-xs font-bold text-[var(--color-primary)]">{submissionRate}%</span>
                            </div>
                            <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${submissionRate}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-lg flex items-center justify-center ${assignment.isOverdue ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' : 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'}`}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider leading-none mb-1">Deadline</p>
                                <p className={`text-lg md:text-xl font-bold ${assignment.isOverdue ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-main)]'}`}>
                                    {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                            {assignment.isOverdue ? "Needs Attention" : "Submission Window Open"}
                            <ArrowRight size={14} className="text-[var(--color-text-muted)]" />
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-6 border-t border-[var(--color-border)]">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="w-full sm:flex-1"
                    >
                        Close
                    </Button>

                    <Button
                        onClick={() => {
                            onClose();
                            onEdit(assignment);
                        }}
                        variant="ghost"
                        className="w-full sm:flex-1 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                    >
                        Edit Task
                    </Button>
                    <Button
                        onClick={() => onToggleStatus(assignment._id)}
                        variant="solid"
                        className="w-full sm:flex-[2]"
                        icon={<CheckCircle2 size={18} />}
                    >
                        {(assignment.status === 'Active' || assignment.status === 'published') ? 'Close Task' : 'Reopen Task'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AssignmentDetailModal;
