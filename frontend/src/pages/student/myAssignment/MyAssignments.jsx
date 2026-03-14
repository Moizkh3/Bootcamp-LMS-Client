import React, { useState } from "react";
import { Clock, Calendar, Eye, Search, Filter, BookOpen, ChevronRight, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import Button from "../../../components/common/Button";
import { useGetStudentAssignmentsQuery } from "../../../features/student/studentApi";


const tabs = ["Pending", "Completed", "Needs Resubmission"];
const categories = ["All Categories", "Core Track", "Specialized", "Elective"];

const getStatusConfig = (status, deadline) => {
  const isOverdue = new Date(deadline) < new Date();
  
  switch(status) {
    case 'graded':
      return { label: "COMPLETED", class: "bg-green-100 text-green-600", tab: "Completed", action: "View Feedback" };
    case 're-submit':
      return { label: "RESUBMIT", class: "bg-orange-100 text-orange-600", tab: "Needs Resubmission", action: "Start Submission" };
    case 'submitted':
      return { label: "SUBMITTED", class: "bg-blue-100 text-blue-600", tab: "Completed", action: "View Submission" };
    case 'not-started':
    default:
      return { 
        label: isOverdue ? "OVERDUE" : "PENDING", 
        class: isOverdue ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700", 
        tab: "Pending", 
        action: "Start Submission" 
      };
  }
};

export default function MyAssignments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Pending");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [sortByDeadline, setSortByDeadline] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const { data: response, isLoading } = useGetStudentAssignmentsQuery();
  const rawAssignments = response?.data || [];

  const processedAssignments = rawAssignments.map(a => {
    const config = getStatusConfig(a.submissionStatus, a.deadline);
    return {
      ...a,
      statusLabel: config.label,
      statusClass: config.class,
      targetTab: config.tab,
      actionLabel: config.action,
      category: a.domain?.type || "Core Track",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80" // Default image
    };
  });

  const tabCounts = {
    Pending: processedAssignments.filter(a => a.targetTab === "Pending").length,
    Completed: processedAssignments.filter(a => a.targetTab === "Completed").length,
    "Needs Resubmission": processedAssignments.filter(a => a.targetTab === "Needs Resubmission").length
  };

  // Filter by tab
  let filtered = processedAssignments.filter((a) => a.targetTab === activeTab);

  // Filter by category
  if (activeCategory !== "All Categories") {
    filtered = filtered.filter((a) => a.category === activeCategory);
  }

  // Sort by deadline
  if (sortByDeadline) {
    filtered = [...filtered].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }

  if (isLoading) {
    return <div className="p-8">Loading assignments...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Breadcrumbs />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Assignments Dashboard</h1>
        <p className="text-[var(--color-text-muted)] font-medium text-sm mt-1">
          Manage your coursework, track deadlines, and view instructor feedback.
        </p>
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex p-1 bg-[var(--color-primary)]/5 rounded-xl w-fit border border-[var(--color-border)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveCategory("All Categories");
                setSortByDeadline(false);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                }`}
            >
              {tab}
              {tabCounts[tab] !== undefined && (
                <span className={`ml-2 text-[10px] rounded-md px-1.5 py-0.5 font-bold ${activeTab === tab ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "bg-gray-200 text-gray-500"
                  }`}>
                  {tabCounts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`flex items-center gap-2 text-sm font-bold border px-4 py-2.5 rounded-xl transition-all ${activeCategory !== "All Categories"
                ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)]"
                : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:border-[var(--color-text-muted)]/30"
                }`}
            >
              <Filter size={16} />
              {activeCategory}
            </button>
            {showCategoryDropdown && (
              <div className="absolute right-0 top-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-20 w-48 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors ${activeCategory === cat
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-main)]"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort by deadline toggle */}
          <button
            onClick={() => setSortByDeadline(!sortByDeadline)}
            className={`flex items-center gap-2 text-sm font-bold border px-4 py-2.5 rounded-xl transition-all ${sortByDeadline
              ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)]"
              : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:border-[var(--color-text-muted)]/30"
              }`}
          >
            <Clock size={16} />
            Sort Deadline
          </button>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-[var(--color-surface)] rounded-xl border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)]">
            <div className="w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center mb-4 border border-[var(--color-border)]">
              <ClipboardList size={32} className="opacity-20" />
            </div>
            <p className="text-sm font-bold">No assignments found in this category.</p>
          </div>
        ) : (
          filtered.map((a) => (
            <div key={a._id} className="bg-[var(--color-surface)] rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)] flex flex-col group hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300">
              {/* Content */}
              <div className="p-6 flex flex-col flex-1 gap-5">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 shadow-sm border border-[var(--color-primary)]/10 group-hover:scale-110 transition-transform">
                    <ClipboardList size={22} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm border ${a.statusClass}`}>
                      {a.statusLabel}
                    </span>
                    {a.grade !== null && a.grade !== undefined && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 shadow-sm flex items-center gap-1">
                        ⭐ {a.grade}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-h-[80px]">
                  <h3 className="font-bold text-[var(--color-text-main)] text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{a.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] font-medium leading-relaxed line-clamp-3">{a.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                   <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[var(--color-text-muted)] uppercase tracking-wider">Category</span>
                       <span className="text-[var(--color-text-main)] bg-gray-100 px-2 py-0.5 rounded uppercase">{a.domain?.name || a.category || 'General'}</span>
                    </div>
                   <div className={`flex items-center justify-between text-[11px] font-bold ${new Date(a.deadline) < new Date() ? 'text-red-500' : 'text-amber-600'}`}>
                      <span className="text-[var(--color-text-muted)] uppercase tracking-wider">Deadline</span>
                      <div className="flex items-center gap-1.5 ">
                        {new Date(a.deadline) < new Date() ? <Clock size={12} /> : <Calendar size={12} />}
                        {new Date(a.deadline) < new Date() ? "Overdue" : new Date(a.deadline).toLocaleDateString()}
                      </div>
                   </div>
                </div>

                <Button
                  onClick={() => navigate(a.actionLabel === "View Feedback" ? `/student/assignments/${a._id}/feedback` : `/student/assignments/${a._id}/submit`)}
                  variant={a.actionLabel === "View Feedback" ? "outline" : "solid"}
                  className="w-full py-3 mt-2"
                  icon={a.actionLabel === "View Feedback" ? <Eye size={16} /> : null}
                >
                  {a.actionLabel}
                </Button>
              </div>
            </div>
          ))
        )}


      </div>
    </div>
  );
}