import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MoreVertical, Clock, Link as LinkIcon, AlertCircle, CheckCircle2, User, MessageSquare } from 'lucide-react';

const StandupsTable = ({ standups = [], onMarkRead, onFeedback }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const navigate = useNavigate();

    const handleAction = (e, standup, label) => {
        e.stopPropagation();
        setActiveMenu(null);
        if (label === "View Profile") {
            if (!standup.studentId) {
                toast.error("Student ID not found");
                return;
            }
            navigate(`/teacher/students/${standup.studentId}`);
        } else if (label === "Give Feedback") {
            onFeedback(standup);
        }
    };

    const menuItems = [
        { icon: <User size={14} />, label: "View Profile" },
        { icon: <MessageSquare size={14} />, label: "Give Feedback" },
    ];

    return (
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[var(--color-surface)] text-[var(--color-text-muted)] text-[10px] font-semibold uppercase tracking-wider border-b border-[var(--color-border)]">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Updates</th>
                            <th className="px-6 py-4 text-center">Time Logged</th>
                            <th className="px-6 py-4 text-center">Blockers</th>
                            <th className="px-6 py-4 text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {standups.map((item, index) => (
                            <tr 
                                key={item.id} 
                                onClick={() => onFeedback(item)}
                                className="hover:bg-[var(--color-primary)]/5 transition-colors group cursor-pointer"
                            >
                                <td className="px-6 py-5 min-w-[200px] relative text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-[var(--color-border)] shadow-sm">
                                            <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--color-text-main)] leading-tight line-clamp-1">{item.name}</p>
                                            <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">{item.role}</p>
                                        </div>
                                        {item.isRead && (
                                            <div className="text-[var(--color-success)] ml-auto" title="already read">
                                                <CheckCircle2 size={16} fill="white" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 max-w-xs xl:max-w-md text-left">
                                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                                        {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Updates"}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-main)] font-semibold line-clamp-2">{item.today}</p>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 bg-[var(--color-background)] px-2.5 py-1 rounded-lg text-xs font-semibold text-[var(--color-text-main)] border border-[var(--color-border)]">
                                        <Clock size={12} className="text-[var(--color-text-muted)]" />
                                        {item.timeLogged}h
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    {item.blocker ? (
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/10 text-[var(--color-danger)] rounded-full">
                                            <AlertCircle size={12} />
                                            <span className="text-[10px] font-semibold uppercase tracking-widest">Blocked</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--color-success-bg)] border border-[var(--color-success)]/10 text-[var(--color-success)] rounded-full">
                                            <CheckCircle2 size={12} />
                                            <span className="text-[10px] font-semibold uppercase tracking-widest">Clear</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-right relative">
                                    <div className="flex justify-end relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenu(activeMenu === index ? null : index);
                                            }}
                                            className={`p-2 rounded-lg transition-all ${activeMenu === index ? 'bg-[var(--color-background)] text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-background)]'}`}
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {activeMenu === index && (
                                            <>
                                                <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)} />
                                                <div className="absolute right-0 mt-10 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-30 py-2 animate-in fade-in zoom-in-95 duration-100 text-left">
                                                    {menuItems.map((menuItem, idx) => (
                                                        <button
                                                            key={idx}
                                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] transition-colors group/item"
                                                            onClick={(e) => handleAction(e, item, menuItem.label)}
                                                        >
                                                            <span className="text-[var(--color-text-muted)] group-hover/item:text-[var(--color-primary)]">{menuItem.icon}</span>
                                                            <span className="font-medium">{menuItem.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StandupsTable;
