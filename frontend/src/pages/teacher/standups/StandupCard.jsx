import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Clock, Link as LinkIcon, AlertCircle, CheckCircle2, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const StandupCard = ({ id, studentId, name, role, avatar, yesterday, today, timeLogged, blocker, isRead, onMarkRead, onFeedback, date }) => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleAction = (e, label) => {
        e.stopPropagation();
        setShowMenu(false);
        if (label === "View Profile") {
            if (!studentId) {
                toast.error("Student ID not found");
                return;
            }
            navigate(`/teacher/students/${studentId}`);
        } else if (label === "Give Feedback") {
            onFeedback();
        }
    };

    const menuItems = [
        { icon: <User size={14} />, label: "View Profile" },
        { icon: <MessageSquare size={14} />, label: "Give Feedback" },
    ];

    return (
        <div 
            onClick={() => onFeedback()}
            className="bg-[var(--color-surface)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] flex flex-col h-full hover:border-[var(--color-primary)]/50 hover:shadow-md transition-all group relative cursor-pointer"
        >
            {/* Read Status Tick */}
            {isRead && (
                <div
                    className="absolute -top-2 -right-2 bg-[var(--color-success)] text-white p-1 rounded-full shadow-lg border-2 border-[var(--color-surface)] z-10 animate-in zoom-in"
                >
                    <CheckCircle2 size={14} fill="currentColor" className="text-[var(--color-success)] fill-[var(--color-surface)]" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm relative">
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-main)] leading-none mb-1.5 line-clamp-1">{name}</h3>
                        <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">{role}</p>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className={`p-2 rounded-lg transition-colors ${showMenu ? 'bg-[var(--color-background)] text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-background)]'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-20"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-30 py-2 animate-in fade-in zoom-in-95 duration-100">
                                {menuItems.map((item, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] transition-colors group/item"
                                        onClick={(e) => handleAction(e, item.label)}
                                    >
                                        <span className="text-[var(--color-text-muted)] group-hover/item:text-[var(--color-primary)]">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow mb-6">
                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
                    {date ? `${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} Update` : "Update"}
                </p>
                <p className="text-sm text-[var(--color-text-main)] leading-relaxed font-semibold">{today}</p>
            </div>

            {/* Status Badge */}
            {blocker ? (
                <div className="bg-[var(--color-danger-bg)] rounded-xl p-3.5 border border-[var(--color-danger)]/10 flex gap-3 mt-auto">
                    <AlertCircle size={14} className="text-[var(--color-danger)] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[var(--color-danger)] font-semibold leading-tight line-clamp-2">{blocker}</p>
                </div>
            ) : (
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2 py-1 px-2.5 bg-emerald-50 w-fit rounded-lg border border-emerald-100">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">No Blockers</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                        <Clock size={12} />
                        <span className="text-[10px] font-semibold">{timeLogged}h</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StandupCard;
