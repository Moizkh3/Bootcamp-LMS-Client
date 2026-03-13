import React, { useState } from "react";
import {
    History,
    Search,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    Filter,
    ChevronRight,
    ArrowUpDown,
    MessageSquare
} from "lucide-react";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import StatCard from "../../../components/common/StatCard";

import { useGetStudentProgressQuery } from "../../../features/progress/progressApi";
import { useGetStudentStatsQuery } from "../../../features/student/studentApi";

export default function ProgressHistory() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: progressResponse, isLoading: progressLoading } = useGetStudentProgressQuery();
    const { data: statsResponse, isLoading: statsLoading } = useGetStudentStatsQuery();

    const historyData = progressResponse?.data || [];
    const stats = statsResponse?.data;

    const filteredData = historyData.filter(item => 
        item.yesterdayWork?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.todayPlan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (progressLoading || statsLoading) {
        return <div className="p-8">Loading history...</div>;
    }

    return (
        <div className="p-8 bg-[var(--color-background)] min-h-screen">
            <Breadcrumbs />
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-3">
                        <History size={24} className="text-[var(--color-primary)]" />
                        Progress History
                    </h1>
                    <p className="text-[var(--color-text-muted)] font-medium text-sm mt-1">Review your past submissions, grades, and mentor feedback.</p>
                </div>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Submissions"
                    value={stats?.totalStandups || "0"}
                    icon={<History size={20} />}
                    variant="blue"
                />
                <StatCard
                    title="Avg. Grade"
                    value={stats?.avgGrade || "-"}
                    icon={<CheckCircle2 size={20} />}
                    variant="green"
                />
                <StatCard
                    title="Pending Review"
                    value={historyData.filter(h => h.status === 'pending' || !h.reviewedAt).length}
                    icon={<Clock size={20} />}
                    variant="orange"
                />
                <StatCard
                    title="Attendance"
                    value={stats?.attendance || "-"}
                    icon={<Calendar size={20} />}
                    variant="purple"
                />
            </div>

            {/* Filters and Search */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="Search by type, mentor, or grade..."
                            icon={<Search size={18} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button variant="ghost" className="border border-[var(--color-border)] px-4">
                            <Filter size={18} className="mr-2" />
                            Filter
                        </Button>
                        <Button variant="ghost" className="border border-[var(--color-border)] px-4">
                            <ArrowUpDown size={18} className="mr-2" />
                            Sort
                        </Button>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Type</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Grade</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Mentor</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {filteredData.map((item) => (
                            <tr key={item._id} className="hover:bg-[var(--color-background)]/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                                            <Calendar size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-[var(--color-text-main)]">
                                            {new Date(item.date || item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-[var(--color-text-main)]">Daily Standup</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${item.reviewedAt
                                        ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                                        : 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                                        }`}>
                                        {item.reviewedAt ? 'Reviewed' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm font-black ${item.grade?.startsWith('A') ? 'text-[var(--color-success)]' : 'text-[var(--color-text-main)]'
                                        }`}>{item.grade || '-'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200" />
                                        <span className="text-sm font-medium text-[var(--color-text-main)]">
                                            {item.mentor?.name || (item.reviewedAt ? 'Mentor' : 'Pending Review')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {item.feedback && (
                                        <div className="group/feedback relative inline-block">
                                            <MessageSquare size={16} className="text-[var(--color-primary)] cursor-help" />
                                            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-white border border-[var(--color-border)] rounded-xl shadow-xl text-left invisible group-hover/feedback:visible z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <MessageSquare size={10} /> Mentor Feedback
                                                </p>
                                                <p className="text-xs text-[var(--color-text-main)] italic">"{item.feedback}"</p>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-[var(--color-background)] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--color-text-muted)]">
                            <History size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--color-text-main)]">No history found</h3>
                        <p className="text-[var(--color-text-muted)] font-medium text-sm mt-1">Your submission history will appear here once you start submitting work.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
