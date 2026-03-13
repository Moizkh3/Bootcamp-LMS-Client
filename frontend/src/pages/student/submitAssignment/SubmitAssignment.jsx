import React, { useState, useRef } from "react";
import {
    ArrowLeft,
    Upload,
    Github,
    FileText,
    Link as LinkIcon,
    AlertCircle,
    CheckCircle2,
    X,
    Send,
    Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { useSubmitAssignmentMutation } from "../../../features/submission/submissionApi";
import { useGetAssignmentByIdQuery } from "../../../features/assignment/assignmentApi";
import toast from "react-hot-toast";

export default function SubmitAssignment() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
 
    const { data: assignmentData, isLoading: isLoadingAssignment } = useGetAssignmentByIdQuery(id);
    const assignment = assignmentData?.data || {};
 
    const [formData, setFormData] = useState({
        frontendGithubUrl: "",
        backendGithubUrl: "",
        deployedUrl: "",
        behanceUrl: "",
        figmaUrl: "",
        note: ""
    });
    const [submitFile, setSubmitFile] = useState(null);
 
    const [submitAssignment, { isLoading: isSubmitting, isSuccess, error: submitError }] = useSubmitAssignmentMutation();
 
    const handleSubmit = async (e) => {
        e.preventDefault();
 
        try {
            await submitAssignment({
                assignmentId: id,
                frontendGithubUrl: formData.frontendGithubUrl,
                backendGithubUrl: formData.backendGithubUrl,
                deployedUrl: formData.deployedUrl,
                behanceUrl: formData.behanceUrl,
                figmaUrl: formData.figmaUrl,
                note: formData.note,
                referenceFile: submitFile
            }).unwrap();
 
            toast.success("Assignment submitted successfully!");
            setTimeout(() => navigate("/student/assignments"), 2000);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to submit assignment");
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-[var(--color-background)] min-h-screen">
            <Breadcrumbs />
            {/* Back Button */}
            <div className="mb-6 sm:mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="p-2 h-10 w-10 flex items-center justify-center rounded-xl border border-[var(--color-border)]"
                    icon={<ArrowLeft size={18} />}
                />
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-10 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--color-primary)]/5">
                        <Upload size={28} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-main)]">Submit Assignment</h1>
                    <p className="text-[var(--color-text-muted)] font-medium text-xs sm:text-sm mt-2">
                        {assignment.title || `Assignment #${id}`} · <span className="text-[var(--color-primary)]">{assignment.bootcamp?.name || 'Loading...'}</span>
                    </p>
                </div>

                {isLoadingAssignment ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
                    </div>
                ) : isSuccess ? (
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 sm:p-12 text-center shadow-xl animate-in zoom-in duration-500">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-main)] mb-2">Submission Successful!</h2>
                        <p className="text-[var(--color-text-muted)] font-medium mb-8 text-sm sm:text-base">Your assignment has been sent to your mentor for review.</p>
                        <div className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--color-primary)] animate-pulse">
                            <Loader2 size={16} className="animate-spin" />
                            Redirecting to your assignments...
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                        {/* Main Form Card */}
                        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8 md:p-10">
                            <div className="space-y-6 sm:space-y-8">
                                {(!assignment.requiredLinks || assignment.requiredLinks.includes('frontendGithubUrl')) && (
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                                            <Github size={16} className="text-[var(--color-primary)]" />
                                            Frontend/Main Repository Link
                                        </label>
                                        <Input
                                            placeholder="https://github.com/username/project-repo"
                                            value={formData.frontendGithubUrl}
                                            onChange={(e) => setFormData({ ...formData, frontendGithubUrl: e.target.value })}
                                            required
                                        />
                                        <p className="text-[10px] text-[var(--color-text-muted)] font-bold mt-2 uppercase tracking-tight italic">
                                            Make sure the repository is public or you've invited your mentor as a collaborator.
                                        </p>
                                    </div>
                                )}

                                {assignment.requiredLinks?.includes('backendGithubUrl') && (
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                                            <Github size={16} className="text-[var(--color-primary)]" />
                                            Backend Repository URL (Optional)
                                        </label>
                                        <Input
                                            placeholder="https://github.com/username/backend-repo"
                                            value={formData.backendGithubUrl}
                                            onChange={(e) => setFormData({ ...formData, backendGithubUrl: e.target.value })}
                                        />
                                    </div>
                                )}

                                {assignment.requiredLinks?.includes('deployedUrl') && (
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                                            <LinkIcon size={16} className="text-[var(--color-primary)]" />
                                            Deployed Application Link (Optional)
                                        </label>
                                        <Input
                                            placeholder="https://my-awesome-project.vercel.app"
                                            value={formData.deployedUrl}
                                            onChange={(e) => setFormData({ ...formData, deployedUrl: e.target.value })}
                                        />
                                    </div>
                                )}

                                {assignment.requiredLinks?.includes('behanceUrl') && (
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                                            <LinkIcon size={16} className="text-[var(--color-primary)]" />
                                            Behance Project Link
                                        </label>
                                        <Input
                                            placeholder="https://www.behance.net/gallery/..."
                                            value={formData.behanceUrl}
                                            onChange={(e) => setFormData({ ...formData, behanceUrl: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}

                                {assignment.requiredLinks?.includes('figmaUrl') && (
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                                            <LinkIcon size={16} className="text-[var(--color-primary)]" />
                                            Figma Design Link
                                        </label>
                                        <Input
                                            placeholder="https://www.figma.com/file/..."
                                            value={formData.figmaUrl}
                                            onChange={(e) => setFormData({ ...formData, figmaUrl: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}

                                {assignment.requiredLinks?.includes('document') && (
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                                            <Upload size={16} className="text-[var(--color-primary)]" />
                                            Assignment Document Resource <span className="text-[var(--color-text-muted)] font-normal">(Optional)</span>
                                        </label>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-[var(--color-background)] border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all group"
                                        >
                                            <div className="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Upload size={20} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-[var(--color-text-main)]">
                                                    {submitFile ? submitFile.name : "Click to upload document"}
                                                </p>
                                                <p className="text-[10px] text-[var(--color-text-muted)] font-bold mt-1 uppercase">
                                                    PDF, DOC, DOCX up to 10MB
                                                </p>
                                            </div>
                                            <input 
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setSubmitFile(e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Submission Notes */}
                                <div>
                                    <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                                        <FileText size={16} className="text-[var(--color-primary)]" />
                                        Submission Notes & Comments
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none text-[var(--color-text-main)]"
                                        placeholder="Describe your work, challenges faced, or specific areas you want feedback on..."
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    />
                                </div>
                            </div>

                            {submitError && (
                                <div className="mt-8 bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/20 p-4 rounded-xl flex items-center gap-3 text-[var(--color-danger)] text-sm font-bold">
                                    <AlertCircle size={18} />
                                    {submitError?.data?.message || "Failed to submit assignment"}
                                </div>
                            )}

                            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 py-4 font-bold border border-[var(--color-border)] hover:bg-gray-100"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="solid"
                                    className="flex-1 py-4 font-bold shadow-xl shadow-[var(--color-primary)]/20"
                                    disabled={isSubmitting}
                                    icon={isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                >
                                    {isSubmitting ? "Submitting Work..." : "Confirm & Submit"}
                                </Button>
                            </div>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
}
