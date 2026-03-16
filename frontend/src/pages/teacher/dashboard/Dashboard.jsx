
import React, { useState } from 'react';
import {
    Users,
    FileText,
    AlertCircle,
    ArrowRight,
    Plus,
    Layers,
    Megaphone,
    Loader2
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/auth/authSelectors';
import { useGetTeacherStatsQuery } from '../../../features/teacher/teacherApi';
import { useCreateAnnouncementMutation, useGetAnnouncementsQuery } from '../../../features/announcement/announcementApi';

import StatCard from './StatCard';
import RecentActivity from './RecentActivity';

import DeadlinesTable from './DeadlinesTable';
import CreateAssignmentModal from '../assignments/CreateAssignmentModal';
import AnnouncementModal from './AnnouncementModal';
import RecentActivityModal from './RecentActivityModal';
import Button from '../../../components/common/Button';
import LoadingScreen from '../../../components/common/LoadingScreen';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const { data: statsResponse, isLoading: statsLoading } = useGetTeacherStatsQuery();
    const [createAnnouncement] = useCreateAnnouncementMutation();

    const teacherStats = statsResponse?.data || {
        totalEnrolled: 0,
        pendingReviewsCount: 0,
        pendingSubmissionsCount: 0,
        overdueAssignments: 0,
        activeBootcamps: []
    };

    // Fetch announcements for the teacher's bootcamp
    const primaryBootcampId = teacherStats.activeBootcamps?.[0]?._id;
    const { data: announcementsResponse } = useGetAnnouncementsQuery(
        primaryBootcampId ? { bootcampId: primaryBootcampId } : {},
        { skip: !primaryBootcampId }
    );
    const announcements = announcementsResponse?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handleAddAssignmentGlobal } = useOutletContext();
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

    const handlePostAnnouncement = async (formData) => {
        try {
            const bootcampId = teacherStats.activeBootcamps?.[0]?._id;
            
            if (!bootcampId) {
                console.error("No bootcamp found for this teacher");
                return;
            }

            await createAnnouncement({
                title: formData.title,
                description: formData.description,
                bootcampId: bootcampId,
                domainId: formData.targetGroup === 'all' ? null : formData.targetGroup
            }).unwrap();
            
            setIsAnnouncementModalOpen(false);
        } catch (error) {
            console.error("Failed to post announcement:", error);
        }
    };

    const stats = [
        {
            title: `Total Enrolled (${teacherStats.teacherBootcamps || 'N/A'})`,
            value: statsLoading ? "..." : (teacherStats.totalEnrolled ?? 0).toString(),
            trend: teacherStats.teacherDomain || "Active Students",
            icon: <Users />,
            variant: "primary"
        },
        {
            title: "Pending Reviews",
            value: statsLoading ? "..." : (teacherStats.pendingReviewsCount ?? 0).toString(),
            trend: "Requires Attention",
            icon: <FileText />,
            variant: "warning"
        },
        {
            title: "Overdue Assignments",
            value: statsLoading ? "..." : (teacherStats.overdueAssignments ?? 0).toString(),
            trend: "Past Deadline",
            icon: <AlertCircle />,
            variant: "danger"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">
                        Welcome back, <span className="text-[var(--color-primary)] font-bold">{user?.name?.split(' ')[0] || 'Teacher'}</span> 👋
                    </h1>
                    <p className="text-[var(--color-text-muted)] font-medium text-sm">Here is what's happening in your cohorts today.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        variant="primary"
                        icon={<Plus size={18} />}
                    >
                        Create Assignment
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {statsLoading ? (
                    <div className="col-span-1 md:col-span-3">
                        <LoadingScreen variant="contained" text="Loading dashboard stats..." />
                    </div>
                ) : (
                    stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} loading={statsLoading} />
                    ))
                )}
            </div>

            {announcements.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-4">Recent Announcements</h2>
                    <div className="space-y-4">
                        {announcements.map((ann, i) => (
                            <div key={i} className="p-4 bg-[var(--color-info-bg)] border border-[var(--color-info)]/30 rounded-xl shadow-sm">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                        ann.creatorRole === 'admin'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {ann.creatorRole === 'admin' ? '🛡️ Admin' : '🎓 Mentor'}
                                    </span>
                                    {(ann.creatorName || ann.createdBy?.name) && (
                                        <span className="text-[10px] text-[var(--color-text-muted)] font-bold">— {ann.creatorName || ann.createdBy?.name}</span>
                                    )}
                                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-bold ml-auto">
                                        {new Date(ann.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-[var(--color-text-main)] font-bold text-sm mb-1">{ann.title}</h3>
                                <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">{ann.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Action Card: Assignments/Submissions */}
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 relative overflow-hidden group shadow-sm">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                                    <Layers size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-[var(--color-text-main)]">Student Submissions</h2>
                            </div>
                            <p className="text-[var(--color-text-muted)] font-medium mb-6 leading-relaxed text-sm">
                                You have <span className="text-[var(--color-primary)] font-semibold underline underline-offset-4 decoration-[var(--color-primary)]/30">{(teacherStats.pendingReviewsCount ?? 0)} pending reviews</span> that require your attention. Sort by cohort or assignment type to start grading.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={() => navigate('/teacher/submissions')}
                                    variant="primary"
                                    icon={<ArrowRight size={18} />}
                                >
                                    Go to Assignments Submissions
                                </Button>
                                <Button
                                    onClick={() => setIsAnnouncementModalOpen(true)}
                                    variant="secondary"
                                    icon={<Megaphone size={18} />}
                                >
                                    Post New Announcement
                                </Button>
                            </div>
                        </div>

                        {/* Decorative Background Elements */}
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-primary)]/10 transition-colors duration-700" />
                    </div>

                    <DeadlinesTable deadlines={teacherStats.upcomingDeadlines || []} />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <RecentActivity activities={teacherStats.recentActivity || []} onViewAll={() => setIsActivityModalOpen(true)} />
                </div>
            </div>

            <CreateAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={(data) => {
                    // This local onAdd might need update to use Mutation
                    setIsModalOpen(false);
                    // Refresh stats after creation if needed (RTK handles via tags)
                }}
            />
            <AnnouncementModal
                isOpen={isAnnouncementModalOpen}
                onClose={() => setIsAnnouncementModalOpen(false)}
                onPost={handlePostAnnouncement}
            />

            <RecentActivityModal
                isOpen={isActivityModalOpen}
                onClose={() => setIsActivityModalOpen(false)}
                activities={teacherStats.recentActivity || []}
            />
        </div>
    );
};

export default TeacherDashboard;

// export default TeacherDashboard;
