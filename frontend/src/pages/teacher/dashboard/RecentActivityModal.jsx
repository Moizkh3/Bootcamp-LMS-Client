import React from 'react';
import { Upload, AlertCircle, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

const RecentActivityModal = ({ isOpen, onClose, activities = [] }) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="All Recent Activity"
            size="md"
        >
            <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[13px] top-2 bottom-2 w-px bg-[var(--color-border)]" />

                    <div className="space-y-8">
                        {activities.length === 0 ? (
                            <p className="text-sm text-[var(--color-text-muted)] text-center py-4">No recent activity found.</p>
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
                            } else if (activity.action?.includes('join')) {
                                icon = <Clock size={16} />;
                                iconBg = "bg-purple-500";
                                colorClass = "text-slate-800";
                            }

                            return (
                                <div key={activity._id} className="relative flex items-start gap-4 pl-8 group">
                                    <div className={`absolute left-0 top-1 p-1.5 rounded-full ${iconBg} text-white z-10 transition-transform group-hover:scale-110 shadow-sm`}>
                                        {icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[var(--color-text-main)] leading-snug">
                                            <span className="font-bold">{activity.user}</span> <span className="text-[var(--color-text-muted)]">{activity.action}</span>{" "}
                                            <span className={`font-bold ${colorClass}`}>{activity.target}</span>
                                        </p>
                                        <p className="text-[var(--color-text-muted)] text-[10px] mt-1.5 font-bold uppercase tracking-wider">
                                            {new Date(activity.time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-[var(--color-surface-alt)] border-t border-[var(--color-border)] flex justify-end">
                <Button
                    onClick={onClose}
                    variant="secondary"
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default RecentActivityModal;
