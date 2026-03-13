import React from 'react';
import { Edit3, Trash2, Users } from 'lucide-react';

const DomainItemCard = ({ name, bootcamp, status, type, mentorName, mentorIds = [], studentsCount = 0, onEdit, onDelete, onClick }) => {
    // Determine display name for mentor
    let displayMentorName = 'Not Assigned';
    let additionalMentors = 0;

    if (mentorIds && mentorIds.length > 0) {
        const firstMentor = mentorIds[0];
        displayMentorName = firstMentor.name || firstMentor; // Handle populated or ID
        additionalMentors = mentorIds.length - 1;
    } else if (mentorName) {
        displayMentorName = mentorName;
    }

    return (
        <div 
            onClick={onClick}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#1111d4]/40 hover:shadow-md hover:translate-y-[-2px] hover:bg-slate-50/50 transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{bootcamp?.name || bootcamp} • {status}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${type === 'Core Track' ? 'bg-[#1111d4]/10 text-[#1111d4]' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {type}
                </span>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full border-2 border-[#1111d4]/20 overflow-hidden bg-[#1111d4]/5 flex items-center justify-center shrink-0">
                        <span className="text-[#1111d4] font-bold text-sm uppercase">
                            {displayMentorName.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Mentors</p>
                        <p className="text-sm font-bold text-slate-700">
                            {displayMentorName}
                            {additionalMentors > 0 && <span className="ml-1 text-[#1111d4]">+{additionalMentors} more</span>}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">Students</p>
                    <div className="flex items-center gap-1 justify-end">
                        <span className="text-lg font-bold text-[#1111d4]">{studentsCount}</span>
                        <Users size={16} className="text-slate-300" />
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(e); }}
                    className="p-2 text-slate-400 hover:text-[#1111d4] hover:bg-[#1111d4]/5 rounded-lg transition-colors border border-transparent hover:border-[#1111d4]/10"
                >
                    <Edit3 size={18} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default DomainItemCard;
