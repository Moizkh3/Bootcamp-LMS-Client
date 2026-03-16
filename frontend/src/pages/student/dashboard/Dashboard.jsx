import { ChevronRightIcon, RocketIcon, Zap, ClipboardList, BarChart3 } from "lucide-react";
import LoadingScreen from "../../../components/common/LoadingScreen";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import StatCard from "../../../components/common/StatCard";
import Button from "../../../components/common/Button";
import { useSelector } from "react-redux";
import { useGetStudentStatsQuery, useGetStudentAssignmentsQuery } from "../../../features/student/studentApi";
import { useGetTodayStandupStatusQuery } from "../../../features/progress/progressApi";
import { useGetAnnouncementsQuery } from "../../../features/announcement/announcementApi";


export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: statsResponse, isLoading: statsLoading } = useGetStudentStatsQuery();
  const { data: standupResponse } = useGetTodayStandupStatusQuery();
  const { data: announcementsResponse } = useGetAnnouncementsQuery({ 
    bootcampId: user?.studentBootcampId, 
    domainId: user?.domainId 
  }, { skip: !user });
  const { data: assignmentsResponse, isLoading: assignmentsLoading } = useGetStudentAssignmentsQuery();

  const stats = statsResponse?.data;
  const isStandupSubmitted = standupResponse?.isSubmitTodayStandup;
  const announcementsList = announcementsResponse?.data?.slice(0, 3) || [];
  const nextAssignments = assignmentsResponse?.data
    ?.filter(a => a.submissionStatus === 'not-started')
    ?.slice(0, 2) || [];

  const statCards = [
    {
      icon: <Zap />,
      title: "Total Assignments",
      value: stats?.totalAssignments || "0",
      variant: "info",
    },
    {
      icon: <ClipboardList />,
      title: "Completed Tasks",
      value: stats?.completedAssignments || "0",
      variant: "success",
    },
    {
      icon: <BarChart3 />,
      title: "Total Standups",
      value: stats?.totalStandups || "0",
      variant: "warning",
    },
  ];

  if (statsLoading) {
    return <LoadingScreen variant="contained" text="Loading dashboard..." />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[var(--color-background)] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
            Welcome back, <span className="text-[var(--color-primary)]">{user?.name || 'Student'}!</span> 👋
          </h1>
          <p className="text-[var(--color-text-muted)] font-medium text-sm mt-1">
            You're doing great. Here's a quick look at your bootcamp status.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <StatCard
            key={idx}
            icon={card.icon}
            title={card.title}
            value={card.value + (card.suffix || "")}
            trend={card.trend}
            variant={card.variant}
          />
        ))}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        {/* Submit Standup Banner */}
        <div className={`lg:col-span-2 rounded-xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between border shadow-lg ${isStandupSubmitted ? 'bg-linear-to-br from-slate-800 to-slate-900 border-slate-700 shadow-slate-900/10' : 'bg-linear-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] border-[var(--color-primary)]/20 shadow-[var(--color-primary)]/10'}`}>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
            {/* Removed Play Icon per user request */}
          </div>
          <div className="absolute right-6 bottom-6 opacity-10">
            <RocketIcon size={100} />
          </div>
          
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-between mb-4">
               <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {isStandupSubmitted ? "Today's Status Update" : "Submit Today's Daily Standup"}
                  </h2>
                  <p className="text-white/80 text-sm font-medium">
                    {isStandupSubmitted 
                      ? "Here's what you've reported for today's session."
                      : "Keep your mentors updated on your daily progress and blockers."}
                  </p>
               </div>
               {isStandupSubmitted && (
                 <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md uppercase tracking-widest">
                    ✓ Submitted
                 </span>
               )}
            </div>

            {isStandupSubmitted && standupResponse?.todayStandup ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-2">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Worked on Yesterday</span>
                  <p className="text-sm font-medium text-white/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{standupResponse.todayStandup.yesterdayWork}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Plan for Today</span>
                  <p className="text-sm font-medium text-white/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{standupResponse.todayStandup.todayPlan}</p>
                </div>
                {standupResponse.todayStandup.blockers && (
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest block">Current Blockers</span>
                    <p className="text-sm font-medium text-amber-200/90 leading-relaxed bg-amber-500/10 p-3 rounded-lg border border-amber-500/10">{standupResponse.todayStandup.blockers}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/80 text-sm font-medium leading-relaxed max-w-sm mt-4">
                Updating your daily standup is essential for tracking progress and getting timely help from mentors.
              </p>
            )}
          </div>

          {!isStandupSubmitted && (
            <Button
              onClick={() => navigate("/student/progress")}
              className="bg-white text-[var(--color-primary)] hover:bg-slate-50 hover:scale-105 transition-all shadow-lg hover:shadow-white/20 px-8 py-3 w-fit mt-8 border-none"
            >
              Submit Now
            </Button>
          )}
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8 md:p-10">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            📢 Announcements
          </h3>
          <div className="space-y-6">
            {announcementsList.length > 0 ? (
              announcementsList.map((ann) => (
                <div key={ann._id} className="border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-[0.7rem] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      ann.creatorRole === 'admin'
                        ? 'bg-purple-50 text-purple-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {ann.creatorRole === 'admin' ? '🛡️ Admin' : '🎓 Mentor'}
                    </span>
                    {(ann.creatorName || ann.createdBy?.name) && (
                      <span className="text-[0.7rem] text-[var(--color-text-muted)] font-medium">— {ann.creatorName || ann.createdBy?.name}</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">{ann.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] font-medium leading-relaxed">{ann.description}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">No recent announcements.</p>
            )}
          </div>
        </div>

        {/* Up Next Assignments */}
        <div className="lg:col-span-3 bg-[var(--color-surface)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
              🕐 Up Next: Assignments
            </h3>
            <Link
              to="/student/assignments"
              className="text-[var(--color-primary)] text-sm font-bold hover:underline underline-offset-4 decoration-[var(--color-primary)]/30"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignmentsLoading ? (
               <LoadingScreen variant="contained" text="Loading assignments..." />
            ) : nextAssignments.length > 0 ? (
              nextAssignments.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/student/assignments/${item._id}/submit`)}
                  className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all cursor-pointer group shadow-sm bg-[var(--color-background)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shadow-sm">
                      ASM
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-text-main)] text-sm group-hover:text-[var(--color-primary)] transition-colors">{item.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)] font-medium">{item.module || 'Course Module'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-lg ${new Date(item.deadline) < new Date() ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                      {new Date(item.deadline) < new Date() ? 'Overdue' : `Due ${new Date(item.deadline).toLocaleDateString()}`}
                    </span>
                    <ChevronRightIcon size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">No pending assignments.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}