import React from 'react';
import {
    GraduationCap,
    AlertCircle,
    Bold,
    Italic,
    List,
    Code,
    Link as LinkIcon,
    RotateCcw,
    Send,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

const GradingModal = ({ isOpen, onClose, studentName, score, setScore, feedback, setFeedback, onAction, isLoading, isGraded }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isGraded ? "Update Evaluation" : "Student Evaluation"}
            icon={<GraduationCap size={24} />}
            size="lg"
        >
            <div className="space-y-8 p-8">
                {/* Context Banner */}
                <div className="flex items-center justify-between p-4 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-[var(--color-surface)]">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">
                                {isGraded ? 'Updating Assessment' : 'Assessing Student'}
                            </p>
                            <h3 className="text-sm font-bold text-[var(--color-text-main)]">{studentName}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Score */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-xs font-semibold text-[var(--color-text-main)] uppercase tracking-widest flex items-center justify-between">
                                Final Score
                                <span className="text-[10px] font-medium text-[var(--color-text-muted)] lowercase tracking-normal">0-100 range</span>
                            </label>
                            <div className="relative group/score">
                                <input
                                    type="number"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    placeholder="--"
                                    className="w-full bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl px-4 py-8 text-5xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] transition-all text-[var(--color-text-main)]"
                                />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-3xl font-bold text-[var(--color-text-muted)] opacity-30">%</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200/50">
                                <AlertCircle size={14} className="text-amber-600 shrink-0" />
                                <p className="text-[10px] font-semibold text-amber-700 leading-tight uppercase tracking-wider">
                                    Final grade will be visible to the student immediately.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Feedback */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Teacher Feedback & Revisions</label>
                        <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10 focus-within:border-[var(--color-primary)] transition-all">
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full bg-transparent p-6 text-sm min-h-[300px] focus:outline-none resize-none font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]"
                                placeholder="Provide feedback for the student..."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[var(--color-border)]">
                    <Button
                        onClick={() => onAction('reject')}
                        variant="danger"
                        className="flex-[0.4] py-6 flex-col h-auto gap-1.5"
                        icon={isLoading ? <Loader2 className="animate-spin" /> : <RotateCcw size={18} />}
                        disabled={isLoading}
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Reject Submission</span>
                            <span className="text-[9px] font-medium opacity-70 normal-case tracking-normal">Request resubmission</span>
                        </div>
                    </Button>
                    <Button
                        onClick={() => onAction('approve')}
                        variant="success"
                        className="flex-1 py-6 flex-col h-auto gap-1.5 shadow-lg shadow-emerald-200/50"
                        icon={isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                        disabled={isLoading}
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                {isGraded ? 'Update Review' : 'Submit Grade'}
                            </span>
                            <span className="text-[9px] font-medium opacity-70 normal-case tracking-normal">
                                {isGraded ? 'Apply updated evaluation' : 'Execute evaluation'}
                            </span>
                        </div>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default GradingModal;
