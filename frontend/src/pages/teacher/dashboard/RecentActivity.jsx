import React from 'react';
import { Upload, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const RecentActivity = ({ activities = [], onViewAll }) => {
    // Remove the hardcoded activities array


    return (
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6 h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-[var(--color-text-main)] tracking-tight">Recent Activity</h3>
                <button
                    onClick={onViewAll}
                    className="text-[var(--color-primary)] text-sm font-semibold hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-[var(--color-border)]" />

                <div className="space-y-10">
                    {activities.length === 0 ? (
                        <p className="text-sm text-[var(--color-text-muted)] text-center py-4">No recent activity.</p>
                    ) : activities.map((activity) => {

                        let icon = <Upload size={16} />;
                        let iconBg = "bg-[var(--color-primary)]";
                        let colorClass = "text-[var(--color-primary)]";

                        if (activity.status === 'approved' || activity.status === 'graded') {
                            icon = <CheckCircle size={16} />;
                            iconBg = "bg-[var(--color-success)]";
                            colorClass = "text-[var(--color-success)]";
                        } else if (activity.status === 'rejected') {
                            icon = <AlertCircle size={16} />;
                            iconBg = "bg-[var(--color-danger)]";
                            colorClass = "text-[var(--color-danger)]";
                        } else if (activity.action === 'updated') {
                            icon = <RefreshCw size={16} />;
                            iconBg = "bg-[var(--color-info)]";
                            colorClass = "text-[var(--color-info)]";
                        }

                        return (
                            <div key={activity._id} className="relative flex items-start gap-4 pl-8 group">
                                <div className={`absolute left-0 top-1 p-1.5 rounded-full ${iconBg} text-white z-10 transition-transform group-hover:scale-110`}>
                                    {icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[var(--color-text-main)] leading-snug">
                                        <span className="font-semibold text-[var(--color-text-main)]">{activity.user}</span> {activity.action}{" "}
                                        <span className={`font-semibold ${colorClass}`}>{activity.target}</span>
                                    </p>
                                    <p className="text-[var(--color-text-muted)] text-xs mt-1.5 font-medium">{new Date(activity.time).toLocaleString()}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;
