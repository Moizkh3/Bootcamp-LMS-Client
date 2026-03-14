import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    BookOpen, 
    CheckCircle2, 
    Clock, 
    MessageSquare, 
    Star, 
    ExternalLink,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { 
    useGetStudentProgressQuery, 
    useGiveStandupFeedbackMutation 
} from '../../../features/teacher/teacherApi';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { toast } from 'react-hot-toast';
import StatusSelect from '../../../components/common/StatusSelect';
import { useUpdateUserMutation } from '../../../features/user/userApi';

const StudentProgressDetails = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('standups');
    const [feedbackData, setFeedbackData] = useState({ standupId: '', grade: '', feedback: '' });

    const { data: response, isLoading, error, refetch } = useGetStudentProgressQuery(studentId);
    const [giveFeedback, { isLoading: isSubmittingFeedback }] = useGiveStandupFeedbackMutation();
    const [updateUser, { isLoading: isUpdatingStatus }] = useUpdateUserMutation();

    const studentData = response?.data || {};
    const { student, standups = [], submissions = [] } = studentData;

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await giveFeedback(feedbackData).unwrap();
            toast.success('Feedback submitted successfully');
            setFeedbackData({ standupId: '', grade: '', feedback: '' });
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to submit feedback');
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateUser({ id: studentId, studentStatus: newStatus }).unwrap();
            toast.success(`Student status updated to ${newStatus === 'enrolled' ? 'Active' : newStatus === 'completed' ? 'Graduated' : 'Dropped Out'}`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update student status');
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-red-500 text-center py-10">Error loading student progress</div>;

    return (
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 md:p-8">
            <Breadcrumbs customLabel={student?.name} />
            
            <div className="mb-8">
                <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} className="mb-4">
                    Back to Directory
                </Button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl flex items-center justify-center font-bold text-2xl">
                            {student?.name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-main)]">{student?.name}</h2>
                            <p className="text-sm text-[var(--color-text-muted)] font-medium">Roll No: {student?.rollNo} · {student?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('standups')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'standups' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-background)]'}`}
                        >
                            Daily Standups
                        </button>
                        <button 
                            onClick={() => setActiveTab('assignments')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'assignments' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-background)]'}`}
                        >
                            Assignments
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Management Bar */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
                    Manage Student Status
                </div>
                <StatusSelect 
                    currentStatus={student?.studentStatus} 
                    onStatusChange={handleStatusChange} 
                    isLoading={isUpdatingStatus}
                />
            </div>

            {activeTab === 'standups' ? (
                <div className="space-y-6">
                    {standups.map((standup) => (
                        <div key={standup._id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 overflow-hidden relative">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold">
                                            <Calendar size={18} />
                                            {new Date(standup.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        {standup.grade && (
                                            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Star size={14} /> Grade: {standup.grade}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Yesterday's Work</h4>
                                            <p className="text-sm text-[var(--color-text-main)] leading-relaxed whitespace-pre-wrap">{standup.yesterdayWork}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Today's Plan</h4>
                                            <p className="text-sm text-[var(--color-text-main)] leading-relaxed whitespace-pre-wrap">{standup.todayPlan}</p>
                                        </div>
                                    </div>

                                    {standup.blockers && (
                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                            <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Blockers</h4>
                                            <p className="text-sm text-red-700">{standup.blockers}</p>
                                        </div>
                                    )}

                                    {standup.feedback && (
                                        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                                            <h4 className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
                                                <MessageSquare size={14} /> My Feedback
                                            </h4>
                                            <p className="text-sm text-[var(--color-text-main)] italic">"{standup.feedback}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="md:w-72 bg-[var(--color-background)] rounded-xl p-5 border border-[var(--color-border)]">
                                    <h4 className="text-sm font-bold text-[var(--color-text-main)] mb-4">Provide Feedback</h4>
                                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                        <Input 
                                            label="Grade (e.g. A, B, 9/10)"
                                            placeholder="Grade"
                                            value={feedbackData.standupId === standup._id ? feedbackData.grade : ''}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, standupId: standup._id, grade: e.target.value })}
                                            required
                                        />
                                        <div>
                                            <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-2 uppercase">Comments</label>
                                            <textarea 
                                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none min-h-[100px]"
                                                placeholder="Write your feedback..."
                                                value={feedbackData.standupId === standup._id ? feedbackData.feedback : ''}
                                                onChange={(e) => setFeedbackData({ ...feedbackData, standupId: standup._id, feedback: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <Button 
                                            type="submit" 
                                            variant="primary" 
                                            className="w-full"
                                            disabled={isSubmittingFeedback && feedbackData.standupId === standup._id}
                                        >
                                            Submit Feedback
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                    {standups.length === 0 && <p className="text-center py-10 text-[var(--color-text-muted)]">No standups submitted yet.</p>}
                </div>
            ) : (
                <div className="space-y-6">
                    {submissions.map((sub) => (
                        <div key={sub._id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--color-text-main)]">{sub.assignment?.title}</h3>
                                    <p className="text-xs text-[var(--color-text-muted)] font-medium">Submitted on {new Date(sub.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                                    sub.status === 'graded' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {sub.status}
                                </div>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    icon={<ExternalLink size={16} />}
                                    onClick={() => navigate(`/teacher/grading/${sub._id}`)}
                                >
                                    Review
                                </Button>
                            </div>
                        </div>
                    ))}
                    {submissions.length === 0 && <p className="text-center py-10 text-[var(--color-text-muted)]">No assignments submitted yet.</p>}
                </div>
            )}
        </div>
    );
};

export default StudentProgressDetails;
