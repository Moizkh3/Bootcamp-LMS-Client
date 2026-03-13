import React, { useState } from 'react';
import { Mail, Calendar, Clock, CheckCircle2, Link as LinkIcon, FileText, ChevronRight, X, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { useReviewSubmissionMutation } from '../../../features/teacher/teacherApi';
import { toast } from 'react-hot-toast';

const SubmissionCard = ({ student: submission }) => {
    const navigate = useNavigate();
    const [reviewSubmissionMutation, { isLoading: isReviewingMutation }] = useReviewSubmissionMutation();

    const {
        _id,
        student,
        assignment,
        createdAt,
        status,
        frontendGithubUrl,
        backendGithubUrl,
        deployedUrl,
        behanceUrl,
        figmaUrl,
        grade,
        feedback
    } = submission;

    const name = student?.name || 'Unknown Student';
    const avatar = student?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
    const assignmentTitle = assignment?.title || 'Unknown Assignment';
    const module = assignment?.module || 'N/A';
    const dueDate = assignment?.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'N/A';

    const isLate = status === 'late';

    const [isReviewing, setIsReviewing] = useState(false);
    const [customGrade, setCustomGrade] = useState(grade || '');
    const [customFeedback, setCustomFeedback] = useState(feedback || '');

    const handleReview = async (result) => {
        try {
            const finalStatus = result === 'pass' ? 'graded' : 're-submit';
            await reviewSubmissionMutation({
                submissionId: _id,
                grade: parseInt(customGrade) || (result === 'pass' ? 100 : 0),
                status: finalStatus,
                feedback: customFeedback || (result === 'pass' ? 'Perfect work!' : 'Please review requirements and resubmit.')
            }).unwrap();
            
            toast.success(`Submission ${finalStatus} successfully`);
            setIsReviewing(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to review submission');
        }
    };

    return (
        <div className={`bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-primary)]/50 transition-all duration-300 group relative mb-6 overflow-hidden ${isLate ? 'after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1.5 after:bg-[var(--color-warning)]' : ''}`}>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                {/* Left: Student Info */}
                <div className="flex items-start md:items-center gap-6">
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-primary)]/20 transition-colors shadow-sm bg-[var(--color-surface-alt)]">
                            <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        </div>
                        {isLate && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-warning)] border-4 border-[var(--color-surface)] rounded-full flex items-center justify-center text-white font-bold text-[10px]">!</div>
                        )}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors tracking-tight">{name}</h3>
                            {isLate && (
                                <span className="px-3 py-1 bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    LATE
                                </span>
                            )}
                            {status === 'graded' && (
                                <span className="px-3 py-1 bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success)]/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    GRADED
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-sm font-semibold text-[var(--color-text-main)]">{assignmentTitle}</p>
                            <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/5 px-2 py-0.5 rounded border border-[var(--color-primary)]/10">Module {module}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                <Calendar size={14} className="text-[var(--color-primary)]" />
                                Submitted: <span className="text-[var(--color-text-main)] ml-1">{new Date(createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                <Clock size={14} className={isLate ? "text-[var(--color-warning)]" : "text-[var(--color-success)]"} />
                                {isLate ? "Due: " : ""}
                                <span className={`${isLate ? "text-[var(--color-warning)]" : "text-[var(--color-success)] flex items-center gap-1.5"}`}>
                                    {isLate ? dueDate : (
                                        <>
                                            On-time
                                            <CheckCircle2 size={12} fill="currentColor" className="text-emerald-100 fill-[var(--color-success)]" />
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Attachment & Action */}
                <div className="flex flex-col md:flex-row md:items-center items-stretch gap-8 lg:gap-12 pl-0 lg:pl-4">

                    {/* Attachments */}
                    <div className="text-left md:text-right space-y-2">
                        <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Links</p>
                        <div className="flex flex-col gap-1">
                            {frontendGithubUrl && (
                                <a href={frontendGithubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start md:justify-end gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors text-xs font-semibold">
                                    <span>Frontend GitHub</span>
                                    <LinkIcon size={14} />
                                </a>
                            )}
                            {backendGithubUrl && (
                                <a href={backendGithubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start md:justify-end gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors text-xs font-semibold">
                                    <span>Backend GitHub</span>
                                    <LinkIcon size={14} />
                                </a>
                            )}
                            {deployedUrl && (
                                <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start md:justify-end gap-2 text-[var(--color-success)] hover:text-[var(--color-success)]/80 transition-colors text-xs font-semibold">
                                    <span>Live Demo</span>
                                    <LinkIcon size={14} />
                                </a>
                            )}
                            {behanceUrl && (
                                <a href={behanceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start md:justify-end gap-2 text-[#1769ff] hover:text-[#1769ff]/80 transition-colors text-xs font-semibold">
                                    <span>Behance Project</span>
                                    <LinkIcon size={14} />
                                </a>
                            )}
                            {figmaUrl && (
                                <a href={figmaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start md:justify-end gap-2 text-[#f24e1e] hover:text-[#f24e1e]/80 transition-colors text-xs font-semibold">
                                    <span>Figma Design</span>
                                    <LinkIcon size={14} />
                                </a>
                            )}
                            {submission.referenceFile && (
                                <a href={submission.referenceFile} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start md:justify-end gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors text-xs font-semibold">
                                    <span>Submission Document</span>
                                    <FileText size={14} />
                                </a>
                            )}
                            {!frontendGithubUrl && !backendGithubUrl && !deployedUrl && !behanceUrl && !figmaUrl && !submission.referenceFile && (
                                <p className="text-xs text-[var(--color-text-muted)] italic">No links or files provided</p>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="min-w-[240px] flex flex-col items-end gap-3">
                        {isReviewing ? (
                            <div className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={customGrade}
                                        onChange={(e) => setCustomGrade(e.target.value)}
                                        placeholder="Grade (0-100)"
                                        className="w-full bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                        min="0"
                                        max="100"
                                    />
                                    <span className="text-sm font-bold text-[var(--color-text-muted)]">%</span>
                                </div>
                                <textarea
                                    value={customFeedback}
                                    onChange={(e) => setCustomFeedback(e.target.value)}
                                    placeholder="Add feedback..."
                                    className="w-full bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--color-primary)] transition-all resize-none h-16"
                                />
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => setIsReviewing(false)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-[var(--color-text-muted)]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => handleReview('reject')}
                                        variant="danger"
                                        size="sm"
                                        icon={isReviewingMutation ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                                        disabled={isReviewingMutation}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleReview('pass')}
                                        variant="success"
                                        size="sm"
                                        icon={isReviewingMutation ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        disabled={isReviewingMutation}
                                    >
                                        Pass
                                    </Button>
                                </div>
                            </div>
                        ) : status === 'graded' ? (
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-[var(--color-success)] uppercase tracking-widest mb-1">Grade: {grade}%</p>
                                <Button
                                    onClick={() => setIsReviewing(true)}
                                    variant="outline"
                                    size="md"
                                    className="border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-success-bg)]"
                                    icon={<CheckCircle2 size={18} />}
                                >
                                    Change Review
                                </Button>
                            </div>
                        ) : status === 're-submit' ? (
                            <Button
                                onClick={() => setIsReviewing(true)}
                                variant="warning"
                                size="md"
                                icon={<X size={18} />}
                            >
                                Re-Review
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsReviewing(true)}
                                variant="primary"
                                size="lg"
                                className="w-full md:w-auto"
                                icon={<FileText size={18} />}
                            >
                                Review Now
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionCard;
