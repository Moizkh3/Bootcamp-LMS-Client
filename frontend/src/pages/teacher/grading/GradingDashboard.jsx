import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Github,
    FileCode,
    FileText,
    CheckCircle2,
    XCircle,
    GraduationCap,
    ExternalLink,
    Star
} from 'lucide-react';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import LoadingScreen from '../../../components/common/LoadingScreen';
import GradingModal from './GradingModal';
import { useGetSubmissionByIdQuery, useReviewSubmissionMutation } from '../../../features/teacher/teacherApi';
import { toast } from 'react-hot-toast';
import { ensureAbsoluteUrl } from '../../../utils/helpers';

const GradingDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: submissionResponse, isLoading, error } = useGetSubmissionByIdQuery(id);
    const [reviewSubmissionMutation, { isLoading: isReviewing }] = useReviewSubmissionMutation();

    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

    React.useEffect(() => {
        if (submissionResponse?.data) {
            setScore(submissionResponse.data.grade?.toString() || '');
            setFeedback(submissionResponse.data.feedback || '');
        }
    }, [submissionResponse]);

    if (isLoading) {
        return <LoadingScreen variant="contained" text="Loading Submission..." />;
    }

    if (error || !submissionResponse?.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--color-error)]">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-bold">Error loading submission details.</p>
                <Button onClick={() => navigate('/teacher/grading')} variant="ghost" className="mt-4">Back to List</Button>
            </div>
        );
    }

    const submission = submissionResponse.data;
    const student = submission.student;
    const assignment = submission.assignment;

    const handleAction = async (type) => {
        try {
            // Mapping approve/reject to unified model statuses: graded / re-submit
            const status = type === 'approve' ? 'graded' : 're-submit';
            await reviewSubmissionMutation({
                submissionId: id,
                status,
                feedback,
                grade: parseInt(score) || 0
            }).unwrap();

            toast.success(`Submission ${status} successfully!`);
            setIsGradingModalOpen(false);

            setTimeout(() => {
                navigate('/teacher/grading');
            }, 1000);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to submit review');
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto min-h-full pb-20">
            <div className="px-6 lg:px-0 pt-6">
                <Breadcrumbs items={[
                    { label: 'Teacher Dashboard', path: '/teacher/dashboard' },
                    { label: 'Grading', path: '/teacher/grading' },
                    { label: 'Review Submission' }
                ]} />

                {/* Header Container */}
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 mt-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-main)] tracking-tight mb-4">
                            {assignment?.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface)] text-[var(--color-text-muted)] rounded-lg text-[10px] font-semibold uppercase tracking-widest border border-[var(--color-border)] shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                                Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-info-bg)] text-[var(--color-info)] rounded-lg text-[10px] font-semibold uppercase tracking-widest border border-[var(--color-info)]/20 shadow-sm">
                                <CheckCircle2 size={12} />
                                {submission.status.toUpperCase()}
                            </span>
                            {submission.status === 'graded' && (
                                <span className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100 shadow-sm">
                                    <Star size={14} fill="currentColor" />
                                    SCORE: {submission.grade}/100
                                </span>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        size="lg"
                        icon={<GraduationCap size={20} />}
                        onClick={() => setIsGradingModalOpen(true)}
                        className="shadow-lg shadow-[var(--color-primary)]/10"
                    >
                        {submission.status === 'graded' ? 'Update Grade' : 'Grade Assignment'}
                    </Button>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {/* Student Card */}
                    <article className="bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)] shadow-sm flex flex-wrap items-center justify-between gap-8 relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-primary)]/10 transition-colors duration-500" />

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-[var(--color-surface-alt)]">
                                <img src={student?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name)}`} alt={student?.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors">{student?.name}</h3>
                                <div className="flex items-center gap-4">
                                    <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/10 px-3 py-1 rounded-full border border-[var(--color-primary)]/20">ROLL: {student?.rollNo || 'N/A'}</p>
                                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest border-l border-[var(--color-border)] pl-4">{assignment?.domain?.name || 'General'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 relative z-10">
                            {submission.frontendGithubUrl && (
                                <Button
                                    variant="secondary"
                                    size="md"
                                    icon={<Github size={18} />}
                                    onClick={() => window.open(ensureAbsoluteUrl(submission.frontendGithubUrl), '_blank')}
                                >
                                    Frontend Repo
                                </Button>
                            )}
                            {submission.backendGithubUrl && (
                                <Button
                                    variant="secondary"
                                    size="md"
                                    icon={<Github size={18} />}
                                    onClick={() => window.open(ensureAbsoluteUrl(submission.backendGithubUrl), '_blank')}
                                >
                                    Backend Repo
                                </Button>
                            )}
                        </div>
                    </article>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Student Note */}
                        <section className="lg:col-span-2 space-y-4">
                            <h4 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-2 h-0.5 bg-[var(--color-primary)]" />
                                Student's Note
                            </h4>
                            <div className="bg-[var(--color-surface)] rounded-2xl p-8 lg:p-10 border border-[var(--color-border)] shadow-sm italic text-[var(--color-text-main)] leading-relaxed text-lg font-medium relative group hover:border-[var(--color-primary)]/30 transition-colors">
                                <p>{submission.note || "No note provided by the student."}</p>
                            </div>
                        </section>

                        {/* Submission Links/Files */}
                        <section className="space-y-4">
                            <h4 className="text-[11px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-2 h-0.5 bg-[var(--color-primary)]" />
                                Artifacts & Links
                            </h4>
                            <div className="space-y-3">
                                {submission.deployedUrl && (
                                    <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] shadow-sm flex items-center gap-4 group cursor-pointer hover:border-[var(--color-primary)] hover:shadow-lg transition-all" onClick={() => window.open(ensureAbsoluteUrl(submission.deployedUrl), '_blank')}>
                                        <div className="p-4 rounded-xl bg-[var(--color-success-bg)] text-[var(--color-success)] group-hover:scale-110 transition-transform">
                                            <ExternalLink size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--color-text-main)] mb-1 uppercase tracking-tight">Live Demo</p>
                                            <p className="text-[10px] font-semibold text-[var(--color-text-muted)] line-clamp-1">{submission.deployedUrl}</p>
                                        </div>
                                    </div>
                                )}
                                {submission.referenceFile && (
                                    <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] shadow-sm flex items-center gap-4 group cursor-pointer hover:border-[var(--color-primary)] hover:shadow-lg transition-all" onClick={() => window.open(ensureAbsoluteUrl(submission.referenceFile), '_blank')}>
                                        <div className="p-4 rounded-xl bg-[var(--color-info-bg)] text-[var(--color-info)] group-hover:scale-110 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--color-text-main)] mb-1 uppercase tracking-tight">Attached File</p>
                                            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">Click to download/view</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Grading Modal */}
            <GradingModal
                isOpen={isGradingModalOpen}
                onClose={() => setIsGradingModalOpen(false)}
                studentName={student?.name}
                score={score}
                setScore={setScore}
                feedback={feedback}
                setFeedback={setFeedback}
                onAction={handleAction}
                isLoading={isReviewing}
                isGraded={submission.status === 'graded'}
            />
        </div>
    );
};

export default GradingDashboard;
