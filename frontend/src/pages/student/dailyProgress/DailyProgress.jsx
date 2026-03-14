import { useState, useEffect } from "react";
import { AlertTriangleIcon, ClockIcon, ArrowLeftIcon, CheckCircle2, Edit3Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { useDispatch, useSelector } from "react-redux";
import { useSubmitStandupMutation, useUpdateStandupMutation, useGetTodayStandupStatusQuery } from "../../../features/progress/progressApi";
import { } from "../../../features/student/studentApi";
import toast from "react-hot-toast";

export default function DailyProgress() {
  const navigate = useNavigate();
  const { data: standupStatus } = useGetTodayStandupStatusQuery();
  const [submitStandup, { isLoading: isSubmitting }] = useSubmitStandupMutation();
  const [updateStandup, { isLoading: isUpdating }] = useUpdateStandupMutation();

  const isAlreadySubmitted = standupStatus?.isSubmitTodayStandup;
  const isEditable = standupStatus?.isEditable;
  const todayStandup = standupStatus?.todayStandup;

  const [workedOn, setWorkedOn] = useState("");
  const [planToday, setPlanToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const [needMentor, setNeedMentor] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [hoursWorked, setHoursWorked] = useState("8.0");
  const [draft, setDraft] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAlreadySubmitted && isEditable && todayStandup) {
      setWorkedOn(todayStandup.yesterdayWork || "");
      setPlanToday(todayStandup.todayPlan || "");
      setBlockers(todayStandup.blockers || "");
      setNeedMentor(!!todayStandup.needMentor);
      setGithubLink(todayStandup.githubLink || "");
      setHoursWorked(todayStandup.hoursWorked?.toString() || "8.0");
    }
  }, [isAlreadySubmitted, isEditable, todayStandup]);

  const validate = () => {
    const newErrors = {};
    if (!workedOn.trim()) newErrors.workedOn = "This field is required.";
    if (!planToday.trim()) newErrors.planToday = "This field is required.";
    if (!hoursWorked || Number(hoursWorked) <= 0) newErrors.hoursWorked = "Enter valid hours.";
    return newErrors;
  };

  const handleSaveDraft = () => {
    setDraft(true);
    setTimeout(() => setDraft(false), 2500);
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      if (isAlreadySubmitted && isEditable) {
        await updateStandup({
          id: todayStandup._id,
          yesterdayWork: workedOn,
          todayPlan: planToday,
          blockers,
          needMentor,
          githubLink,
          hoursWorked: Number(hoursWorked),
        }).unwrap();
        toast.success("Progress updated successfully!");
      } else {
        await submitStandup({
          yesterdayWork: workedOn,
          todayPlan: planToday,
          blockers,
          needMentor,
          githubLink,
          hoursWorked: Number(hoursWorked),
        }).unwrap();
        toast.success("Progress submitted successfully!");
      }
      navigate("/student/progress/history");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to process progress");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {draft && (
        <div className="fixed top-8 right-8 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-main)] text-sm font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-lg flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
          Draft saved successfully
        </div>
      )}

      <div className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <Breadcrumbs />
          <Link to="/student" className="flex items-center gap-2 text-[var(--color-primary)] text-sm font-bold mb-8 hover:underline underline-offset-4 decoration-[var(--color-primary)]/30 w-fit group">
            <ArrowLeftIcon size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-8 border-b border-[var(--color-border)]">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Daily Progress Report</h1>
                <p className="text-[var(--color-text-muted)] font-medium mt-1">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <span className={`flex items-center gap-2 border text-xs font-bold px-4 py-2 rounded-xl w-fit ${isAlreadySubmitted ? 'text-[var(--color-success)] bg-[var(--color-success-bg)] border-[var(--color-success)]/20' : 'text-[var(--color-info)] bg-[var(--color-info-bg)] border-[var(--color-info)]/20'}`}>
                {isAlreadySubmitted ? <CheckCircle2 size={14} /> : <ClockIcon size={14} />}
                {isAlreadySubmitted ? "Submitted" : "Due in 4 hours"}
              </span>
            </div>

            {isAlreadySubmitted && !isEditable ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[var(--color-success)]/10">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-3">You're All Set!</h2>
                <p className="text-[var(--color-text-muted)] font-medium max-w-sm mx-auto mb-8">
                  Your daily progress report for today has been recorded. You can view your details in the history section.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button onClick={() => navigate("/student/progress/history")} variant="solid">
                     View History
                   </Button>
                   <Button onClick={() => navigate("/student")} variant="outline">
                     Back to Dashboard
                   </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {isAlreadySubmitted && isEditable && (
                  <div className="bg-[var(--color-info-bg)] border border-[var(--color-info)]/20 rounded-xl p-4 flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[var(--color-info)] text-white rounded-lg flex items-center justify-center shrink-0">
                      <Edit3Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-main)]">Edit Mode</p>
                      <p className="text-xs text-[var(--color-text-muted)] font-medium">You can still update your standup for this session.</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3">What did you work on yesterday?</label>
                  <textarea
                    rows={4}
                    value={workedOn}
                    onChange={(e) => { setWorkedOn(e.target.value); setErrors((p) => ({ ...p, workedOn: "" })); }}
                    placeholder="Describe your tasks and accomplishments..."
                    className={`w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]/50 ${errors.workedOn ? "border-red-400 ring-4 ring-red-400/10" : "hover:border-[var(--color-primary)]/50"}`}
                  />
                  {errors.workedOn && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">
                    <AlertTriangleIcon size={12} /> {errors.workedOn}
                  </p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3">What is your plan for today?</label>
                  <textarea
                    rows={4}
                    value={planToday}
                    onChange={(e) => { setPlanToday(e.target.value); setErrors((p) => ({ ...p, planToday: "" })); }}
                    placeholder="Outline your goals for the next 24 hours..."
                    className={`w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]/50 ${errors.planToday ? "border-red-400 ring-4 ring-red-400/10" : "hover:border-[var(--color-primary)]/50"}`}
                  />
                  {errors.planToday && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">
                    <AlertTriangleIcon size={12} /> {errors.planToday}
                  </p>}
                </div>

                <div className="border border-[var(--color-warning)]/20 bg-[var(--color-warning-bg)] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                    <AlertTriangleIcon size={16} className="text-[var(--color-warning)]" />
                    Any Blockers?
                  </h3>
                  <textarea
                    rows={4}
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    placeholder="Describe any challenges or issues you are facing..."
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]/50"
                  />
                  <div className="flex items-center gap-3 mt-4">
                    <input
                      type="checkbox"
                      id="mentor-check"
                      checked={needMentor}
                      onChange={(e) => setNeedMentor(e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] cursor-pointer accent-[var(--color-primary)]"
                    />
                    <label htmlFor="mentor-check" className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2 cursor-pointer">
                      I need help from a Mentor
                      <span className="bg-[var(--color-error-bg)] text-[var(--color-error)] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Urgent</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-text-main)] mb-2">GitHub / Code Link</label>
                    <Input
                      type="text"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-text-main)] mb-2">Hours Worked</label>
                    <Input
                      type="number"
                      value={hoursWorked}
                      onChange={(e) => { setHoursWorked(e.target.value); setErrors((p) => ({ ...p, hoursWorked: "" })); }}
                      step="0.5"
                      min="0"
                      icon={<ClockIcon size={16} />}
                      error={errors.hoursWorked}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)] italic">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Note: You can edit this report within 2 hours of submission
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleSaveDraft} variant="outline" className="flex-1 md:flex-none">
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      isLoading={isSubmitting || isUpdating}
                      variant="solid"
                      className="flex-1 md:flex-none"
                      icon={<CheckCircle2 size={18} />}
                    >
                      {isAlreadySubmitted ? "Update Progress" : "Submit Progress"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="text-center py-4 text-sm text-gray-400">
        © 2023 Bootcamp Management System. Empowering developers worldwide.
      </div>
    </div>
  );
}