import { ArrowLeftIcon, GitCommitIcon, StarIcon, CheckCircleIcon, AlertCircleIcon, FileText, User, Calendar, ExternalLink } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSubmissionByAssignmentQuery } from "../../../features/submission/submissionApi";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import Button from "../../../components/common/Button";

export default function FeedbackDetail() {
  const navigate = useNavigate();
  const { id: assignmentId } = useParams();

  console.log("FeedbackDetail - Assignment ID from params:", assignmentId);

  // If no assignmentId is provided (e.g., from Sidebar), we'll fetch all and show newest
  const { data: submissionsResponse, isLoading: submissionsLoading, error: submissionsError } = useGetSubmissionByAssignmentQuery(assignmentId, {
    // We allow calling even without ID to catch generic feedback requests from the sidebar
  });
  
  console.log("FeedbackDetail - Query Status:", { 
    assignmentId: assignmentId || 'none (fetching all/latest)', 
    submissionsLoading, 
    hasData: !!submissionsResponse, 
    error: submissionsError 
  });
  
  const submissions = submissionsResponse?.submissions || [];
  
  // Get latest submission
  const submission = submissions.length > 0 ? [...submissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;

  if (submissionsLoading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading feedback details...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <Breadcrumbs />
      {/* Back + Title */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => navigate("/student/assignments")}
          variant="ghost"
          size="sm"
          className="p-2 h-10 w-10 flex items-center justify-center rounded-xl border border-[var(--color-border)]"
          icon={<ArrowLeftIcon size={18} />}
        />
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Feedback Detail</h1>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-text-main)] tracking-tight">
            {submission?.assignment?.title || "Assignment Detail"}
          </h2>
          <div className="flex flex-wrap items-center gap-6 mt-3 text-sm font-medium text-[var(--color-text-muted)]">
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-[var(--color-primary)]" />
              Submitted: {submission ? new Date(submission.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
            </span>
            <span className="flex items-center gap-2">
              <User size={14} className="text-[var(--color-primary)]" />
              Status: <span className="capitalize">{submission?.status || "Not Submitted"}</span>
            </span>
          </div>
        </div>
        {submission?.status === 're-submit' && (
          <div className="flex items-center gap-3 bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning)]/20 text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm h-fit">
            <AlertCircleIcon size={16} />
            Resubmission Requested
          </div>
        )}
      </div>

      {/* Main Content Stack */}
      <div className="flex flex-col gap-10">
        {/* Top Section: Submission & Stats */}
        <div className="space-y-8">
          {/* Submission Card */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="font-bold text-[var(--color-text-main)] flex items-center gap-2">
                <FileText size={18} className="text-[var(--color-primary)]" />
                Your Submission
              </h3>
            </div>

            {/* Repo Card */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 border border-[var(--color-border)] rounded-xl p-5 mb-8 relative z-10 bg-[var(--color-background)]/50 group hover:border-[var(--color-primary)]/30 transition-all duration-300">
              <div className="w-14 h-14 bg-[var(--color-text-main)] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-500">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {submission?.frontendGithubUrl ? (
                  <>
                    <a href={submission.frontendGithubUrl} target="_blank" rel="noreferrer" className="font-bold text-[var(--color-primary)] hover:underline truncate block">
                      {submission.frontendGithubUrl.replace("https://", "")}
                    </a>
                    <p className="text-xs text-[var(--color-text-muted)] font-medium mt-1 uppercase tracking-tighter">Frontend Repository</p>
                  </>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)] italic">No repository provided</p>
                )}
                {submission?.backendGithubUrl && (
                  <div className="mt-2 text-sm">
                    <a href={submission.backendGithubUrl} target="_blank" rel="noreferrer" className="font-bold text-[var(--color-primary)] hover:underline truncate block">
                      {submission.backendGithubUrl.replace("https://", "")}
                    </a>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-tighter mt-0.5">Backend Repository</p>
                  </div>
                )}
                {submission?.deployedUrl && (
                  <div className="mt-2 text-sm">
                    <a href={submission.deployedUrl} target="_blank" rel="noreferrer" className="font-bold text-[var(--color-success)] hover:underline truncate block">
                      {submission.deployedUrl.replace("https://", "")}
                    </a>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-tighter mt-0.5">Deployed Application</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Notes */}
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                Submission Notes
              </p>
              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-5 shadow-inner">
                <p className="text-sm text-[var(--color-text-muted)] font-medium leading-relaxed italic">
                  "{submission?.note || "No notes provided."}"
                </p>
              </div>
            </div>

            <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-16 -mt-16" />
          </div>

          {/* Stats + Previous */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
              <h3 className="font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                Submission Overview
              </h3>
              <div className="space-y-4">
                {[
                  { 
                    label: "Submission Type", 
                    value: submission?.referenceFile ? "File Attachment" : "GitHub Repository",
                    valueClass: "text-[var(--color-primary)] font-bold capitalize"
                  },
                  { 
                    label: "Submission Date", 
                    value: submission ? new Date(submission.createdAt).toLocaleDateString() : "N/A" 
                  },
                  { 
                    label: "Outcome", 
                    value: submission?.status === 'graded' ? "Verified" : "Pending", 
                    valueClass: submission?.status === 'graded' ? "text-[var(--color-success)] font-bold" : "text-[var(--color-warning)] font-bold" 
                  },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between text-sm py-1 border-b border-[var(--color-border)] last:border-0">
                    <span className="text-[var(--color-text-muted)] font-medium">{stat.label}</span>
                    <span className={stat.valueClass || "text-[var(--color-text-main)] font-bold"}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
              <h3 className="font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                Submission History
              </h3>
              <div className="space-y-3">
                {submissions.map((s, i) => (
                  <div key={s._id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] group hover:border-[var(--color-primary)]/30 transition-all cursor-pointer">
                    <CheckCircleIcon size={20} className={s.status === 'graded' ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]/30"} />
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-main)]">Attempt {submissions.length - i}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">{new Date(s.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <div className="text-sm text-[var(--color-text-muted)] italic py-4">No submissions yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Reviewer Feedback */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-xl p-6 sm:p-8 md:p-10 ring-4 ring-[var(--color-primary)]/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="font-bold text-[var(--color-primary)] text-xl flex items-center gap-3">
              <StarIcon size={24} className="fill-[var(--color-primary)]" />
              Detailed Reviewer Feedback
            </h3>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 mb-10 relative z-10 border-b border-[var(--color-border)] pb-10">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] shadow-inner text-center shrink-0 min-w-[140px]">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-black text-[var(--color-text-main)]">{submission?.grade || 0}</span>
                  <span className="text-[var(--color-text-muted)] text-xl font-bold">/100</span>
                </div>
                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-2">Final Score</p>
              </div>

              <div className="h-16 w-px bg-[var(--color-border)] hidden md:block" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">Mentor Feedback</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Graded by Instructor
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                  <p className="text-2xl font-bold text-primary">{submission?.grade || 0}/100</p>
                </div>
              </div>
            </div>

            <div className="md:ml-auto flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-right">Review Status</p>
              <div className={`flex items-center gap-3 border text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm h-fit capitalize ${
                submission?.status === 'graded' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                submission?.status === 're-submit' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]/20' :
                'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {submission?.status === 'graded' ? <CheckCircleIcon size={16} /> : <AlertCircleIcon size={16} />}
                {submission?.status || "Under Review"}
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-8 relative z-10">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.15em] mb-4">TEACHER FEEDBACK & CODE REVIEW</p>
            <div className="space-y-6 text-sm text-[var(--color-text-muted)] font-medium leading-relaxed">
              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-5 shadow-inner">
                <p className="text-sm text-[var(--color-text-main)] whitespace-pre-wrap">
                  {submission?.feedback || "Review in progress. Your mentor will provide detailed feedback soon."}
                </p>
              </div>

              {submission?.status === 're-submit' && (
                <div className="bg-[var(--color-warning-bg)] border border-[var(--color-warning)]/20 rounded-xl p-5 shadow-sm">
                  <p className="text-[var(--color-warning)] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertCircleIcon size={14} />
                    Action Required
                  </p>
                  <p className="text-[var(--color-text-main)] text-xs font-medium leading-relaxed">
                    Mentor has requested changes. Please address the feedback above and resubmit your work.
                  </p>
                </div>
              )}

              {submission?.status === 're-submit' && (
                <Button
                  variant="solid"
                  className="w-full py-4 mt-6 shadow-xl"
                  onClick={() => navigate(`/student/assignments/${assignmentId}/submit`)}
                  icon={<ExternalLink size={18} />}
                >
                  Resubmit Assignment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}