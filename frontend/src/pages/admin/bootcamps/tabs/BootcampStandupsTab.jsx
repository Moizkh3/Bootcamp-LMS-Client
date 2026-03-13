import React, { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useGetBootcampProgressQuery, useReviewStandupMutation } from '../../../../features/progress/progressApi';
import StandupCard from '../../../teacher/standups/StandupCard';
import StandupFeedbackModal from '../../../teacher/standups/StandupFeedbackModal';
import toast from 'react-hot-toast';

export default function BootcampStandupsTab({ bootcampId }) {
    const { data: progressDataResponse, isLoading: progressLoading, error } = useGetBootcampProgressQuery(bootcampId, {
        skip: !bootcampId
    });

    const [reviewStandup] = useReviewStandupMutation();

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedStandup, setSelectedStandup] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [readIds, setReadIds] = useState([]);

    const standups = useMemo(() => {
        if (!progressDataResponse?.data) return [];
        return progressDataResponse.data.map(p => ({
            id: p._id,
            studentId: p.studentId?._id,
            name: p.studentId?.name || 'Unknown Student',
            email: p.studentId?.email,
            rollNo: p.studentId?.rollNo,
            role: "Student",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.studentId?.name || 'S')}&background=random`,
            yesterday: p.yesterdayWork,
            today: p.todayPlan,
            timeLogged: p.hoursWorked,
            blocker: p.blockers,
            isRead: !!p.reviewedAt || readIds.includes(p._id),
            date: p.date || p.createdAt
        }));
    }, [progressDataResponse, readIds]);

    const handleOpenFeedback = (standup) => {
        setSelectedStandup(standup);
        setIsFeedbackModalOpen(true);
    };

    const handleFeedbackAction = async ({ id, grade, feedback }) => {
        try {
            setIsReviewing(true);
            await reviewStandup({ id, grade, feedback }).unwrap();
            toast.success("Feedback submitted successfully");
            setIsFeedbackModalOpen(false);
            if (!readIds.includes(id)) {
                setReadIds(prev => [...prev, id]);
            }
        } catch (err) {
            toast.error(err?.data?.message || "Failed to submit feedback");
            console.error("Failed to review standup:", err);
        } finally {
            setIsReviewing(false);
        }
    };

    const sortedStandups = [...standups].sort((a, b) => {
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
        return new Date(b.date) - new Date(a.date);
    });

    if (progressLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)] mb-4" />
                <p className="text-[var(--color-text-muted)] font-medium">Loading standups...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 text-center shadow-sm text-red-500">
                Error loading standups.
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedStandups.length > 0 ? (
                    sortedStandups.map((standup) => (
                        <StandupCard
                            key={standup.id}
                            {...standup}
                            onMarkRead={() => handleOpenFeedback(standup)}
                            onFeedback={() => handleOpenFeedback(standup)}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-[var(--color-surface)] rounded-xl border border-dashed border-[var(--color-border)]">
                        <p className="text-[var(--color-text-muted)] font-medium">No standups found for this bootcamp.</p>
                    </div>
                )}
            </div>

            <StandupFeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                standup={selectedStandup}
                onAction={handleFeedbackAction}
                isLoading={isReviewing}
            />
        </div>
    );
}
