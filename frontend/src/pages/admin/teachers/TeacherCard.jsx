import React from 'react';
import { Pencil, UserMinus } from 'lucide-react';

const TeacherCard = ({ _id: id, name, email, teacherDomainIds: domains = [], domainId, teacherBootcampIds: bootcamps, onEdit, onDelete, onClick }) => {
    // If domains is empty but domainId exists, use domainId in an array
    const displayDomains = domains.length > 0 ? domains : (domainId ? [domainId] : []);
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md hover:translate-y-[-2px] hover:bg-slate-50/50 hover:border-[#1111d4]/30 border border-transparent transition-all relative group cursor-pointer"
        >
            {/* Action Buttons (Visible on hover) */}
            <div className="absolute top-5 right-5 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-2.5 bg-white shadow-sm hover:bg-slate-50 border border-slate-100 rounded-xl text-black hover:text-primary transition-colors"
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-2.5 bg-white shadow-sm hover:bg-red-50 border border-slate-100 rounded-xl text-black hover:text-red-500 transition-colors"
                >
                    <UserMinus size={16} />
                </button>
            </div>

            <div className="flex flex-col items-center text-center">
                {/* Avatar Container */}
                <div className="size-24 rounded-full p-1 bg-primary/10 mb-5 relative flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-slate-400">
                            {name.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Basic Info */}
                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-1">{name}</h3>
                <p className="text-sm text-[var(--color-text-muted)] font-medium">{email}</p>

                {/* Spacing */}
                <div className="my-6"></div>

                {/* Details Section */}
                <div className="w-full text-left space-y-5">
                    <div>
                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Assigned Domains</p>
                        <div className="flex flex-wrap gap-2">
                            {displayDomains.length > 0 ? (
                                displayDomains.map(d => (
                                    <span key={d._id || d} className="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-[10px] font-bold rounded-lg border border-[var(--color-primary)]/10">
                                        {d.name || 'Domain'}
                                    </span>
                                ))
                            ) : (
                                <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100">
                                    No Domain
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Active Bootcamps</p>
                        <ul className="space-y-2.5">
                            {bootcamps && bootcamps.length > 0 ? (
                                bootcamps.map((bootcamp) => (
                                    <li key={bootcamp._id || bootcamp} className="flex items-center gap-3 text-xs text-[var(--color-text-main)] font-medium group/item hover:text-[var(--color-primary)] transition-colors cursor-default">
                                        <span className="size-1.5 rounded-full bg-[var(--color-success)]"></span>
                                        {bootcamp.name || 'Bootcamp'}
                                    </li>
                                ))
                            ) : (
                                <li className="text-xs text-[var(--color-text-muted)]">No bootcamps assigned</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherCard;
