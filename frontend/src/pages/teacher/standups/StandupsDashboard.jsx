import React, { useState, useEffect, useMemo } from 'react';
import StandupHeader from './StandupHeader';
import StandupCard from './StandupCard';
import StandupsTable from './StandupsTable';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import StandupFeedbackModal from './StandupFeedbackModal';
import { useGetTeacherStatsQuery } from '../../../features/teacher/teacherApi';
import { useGetBootcampProgressQuery, useReviewStandupMutation } from '../../../features/progress/progressApi';
import toast from 'react-hot-toast';
import LoadingScreen from '../../../components/common/LoadingScreen';

const StandupsDashboard = () => {
    const [view, setView] = useState('card');
    const [range, setRange] = useState('1 Day');
    const [customRange, setCustomRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date()
    });
    const [readIds, setReadIds] = useState([]);
    const [selectedBootcampId, setSelectedBootcampId] = useState('');
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedStandup, setSelectedStandup] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);

    const { data: statsData, isLoading: statsLoading } = useGetTeacherStatsQuery();
    const activeBootcamps = statsData?.data?.activeBootcamps || [];

    useEffect(() => {
        if (activeBootcamps.length > 0 && !selectedBootcampId) {
            setSelectedBootcampId(activeBootcamps[0]._id);
        }
    }, [activeBootcamps, selectedBootcampId]);

    const { data: progressDataResponse, isLoading: progressLoading } = useGetBootcampProgressQuery(selectedBootcampId, {
        skip: !selectedBootcampId
    });

    const [reviewStandup] = useReviewStandupMutation();

    const standups = useMemo(() => {
        if (!progressDataResponse?.data) return [];
        console.log("Teacher Standups Raw Data:", progressDataResponse.data);
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

    const filteredStandups = standups.filter(standup => {
        const standupDate = new Date(standup.date);
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));

        if (range === '1 Day') {
            return standupDate >= startOfToday;
        } else if (range === '3 Days') {
            const daysAgo = new Date(new Date().setDate(new Date().getDate() - 3));
            return standupDate >= daysAgo;
        } else if (range === '7 Days') {
            const daysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
            return standupDate >= daysAgo;
        } else if (range === '10 Days') {
            const daysAgo = new Date(new Date().setDate(new Date().getDate() - 10));
            return standupDate >= daysAgo;
        } else if (range === '20 Days') {
            const daysAgo = new Date(new Date().setDate(new Date().getDate() - 20));
            return standupDate >= daysAgo;
        } else if (range === '1 Month') {
            const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
            return standupDate >= monthAgo;
        } else if (range === 'Custom') {
            const start = new Date(customRange.start).setHours(0, 0, 0, 0);
            const end = new Date(customRange.end).setHours(23, 59, 59, 999);
            return standupDate >= start && standupDate <= end;
        }
        return true;
    });

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

    const sortedStandups = [...filteredStandups].sort((a, b) => {
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
        return new Date(b.date) - new Date(a.date);
    });

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <Breadcrumbs items={[
                    { label: 'Teacher Dashboard', path: '/teacher/dashboard' },
                    { label: 'Standups' }
                ]} />
            </div>
            <StandupHeader
                view={view}
                setView={setView}
                range={range}
                setRange={setRange}
                customRange={customRange}
                setCustomRange={setCustomRange}
                activeBootcamps={activeBootcamps}
                selectedBootcampId={selectedBootcampId}
                setSelectedBootcampId={setSelectedBootcampId}
            />

            {statsLoading || progressLoading ? (
                <LoadingScreen variant="contained" text="Loading standups..." />
            ) : view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <p className="text-[var(--color-text-muted)] font-medium">No standups found for the selected timeframe.</p>
                        </div>
                    )}
                </div>
            ) : (
                <StandupsTable 
                    standups={sortedStandups} 
                    onMarkRead={(id) => handleOpenFeedback(sortedStandups.find(s => s.id === id))} 
                    onFeedback={handleOpenFeedback}
                />
            )}

            <StandupFeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                standup={selectedStandup}
                onAction={handleFeedbackAction}
                isLoading={isReviewing}
            />

        </div>
    );
};

export default StandupsDashboard;
