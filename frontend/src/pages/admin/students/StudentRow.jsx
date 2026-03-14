import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, UserX, UserMinus, Pencil, UserCircle, KeyRound } from 'lucide-react';

const StudentRow = ({ _id: id, name, email, studentStatus: status, studentBootcampId: bootcamp, domainId: domain, createdAt, onEdit, onToggleStatus, onDelete, onResetPassword }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isDroppedOut = status === 'dropout' || status === 'suspended';

    const statusLabels = {
        'enrolled': 'Active',
        'completed': 'Graduated',
        'dropout': 'Dropped Out',
    };

    const statusColors = {
        'enrolled': 'bg-green-100 text-green-800',
        'completed': 'bg-blue-100 text-blue-800',
        'dropout': 'bg-red-100 text-red-800',
    };

    const joinedDate = new Date(createdAt).toLocaleDateString();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-slate-400">
                            {name.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">{name}</span>
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-slate-600 font-medium truncate max-w-[180px]">{email}</td>
            <td className="px-4 py-3 text-sm text-slate-600 font-medium truncate max-w-[200px]">{bootcamp?.name || 'N/A'}</td>
            <td className="px-4 py-3 text-sm text-slate-600 font-medium">{domain?.name || 'N/A'}</td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${statusColors[status] || 'bg-slate-100 text-slate-800'}`}>
                    {statusLabels[status] || status}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-slate-600 font-medium whitespace-nowrap">{joinedDate}</td>
            <td className="px-4 py-3 text-right relative">
                <div ref={menuRef} className="inline-block">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-1.5 rounded-md transition-all ${isMenuOpen ? 'bg-primary text-white' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={18} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-6 top-12 z-[100] w-40 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={() => { onEdit(); setIsMenuOpen(false); }}
                                className="w-full px-4 py-2 flex items-center gap-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <Pencil size={14} className="text-slate-400" />
                                Edit Student
                            </button>
                            <button
                                onClick={() => { onToggleStatus(status); setIsMenuOpen(false); }}
                                className={`w-full px-4 py-2 flex items-center gap-3 text-xs font-bold transition-colors ${isDroppedOut ? 'text-green-600 hover:bg-green-50' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                {isDroppedOut ? (
                                    <>
                                        <UserCircle size={14} className="text-green-500" />
                                        Activate Student
                                    </>
                                ) : (
                                    <>
                                        <UserMinus size={14} className="text-slate-400" />
                                        Drop Out
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => { onResetPassword && onResetPassword(); setIsMenuOpen(false); }}
                                className="w-full px-4 py-2 flex items-center gap-3 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                                <KeyRound size={14} />
                                Reset Password
                            </button>
                            <div className="my-1 border-t border-slate-100"></div>
                            <button
                                onClick={() => { onDelete(); setIsMenuOpen(false); }}
                                className="w-full px-4 py-2 flex items-center gap-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <UserX size={14} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default StudentRow;
