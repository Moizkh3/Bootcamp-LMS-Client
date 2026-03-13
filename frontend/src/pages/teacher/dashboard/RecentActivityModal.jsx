import React from 'react';
import { Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

const RecentActivityModal = ({ isOpen, onClose }) => {
    const activities = [
        {
            id: 1,
            user: "Sarah Jenkins",
            action: "submitted",
            target: "React Hooks Assignment",
            time: "2 minutes ago",
            icon: <Upload size={16} />,
            iconBg: "bg-blue-600",
            color: "text-blue-600"
        },
        {
            id: 2,
            user: "Alex Rivera",
            action: "requested an extension for",
            target: "Project Phase 1",
            time: "15 minutes ago",
            icon: <AlertCircle size={16} />,
            iconBg: "bg-orange-500",
            color: "text-slate-800"
        },
        {
            id: 3,
            user: "You",
            action: "graded",
            target: "Javascript Fundamentals Quiz",
            time: "1 hour ago",
            icon: <CheckCircle size={16} />,
            iconBg: "bg-emerald-500",
            color: "text-indigo-600"
        },
        {
            id: 4,
            user: "Michael Chen",
            action: "joined the cohort",
            target: "Full Stack Web Dev",
            time: "3 hours ago",
            icon: <Clock size={16} />,
            iconBg: "bg-purple-500",
            color: "text-slate-800"
        },
    ];

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
                        {activities.map((activity) => (
                            <div key={activity.id} className="relative flex items-start gap-4 pl-8 group">
                                <div className={`absolute left-0 top-1 p-1.5 rounded-full ${activity.iconBg} text-white z-10 transition-transform group-hover:scale-110 shadow-sm`}>
                                    {activity.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[var(--color-text-main)] leading-snug">
                                        <span className="font-bold">{activity.user}</span> <span className="text-[var(--color-text-muted)]">{activity.action}</span>{" "}
                                        <span className={`font-bold ${activity.color}`}>{activity.target}</span>
                                    </p>
                                    <p className="text-[var(--color-text-muted)] text-xs mt-1.5 font-bold uppercase tracking-wider">{activity.time}</p>
                                </div>
                            </div>
                        ))}
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
