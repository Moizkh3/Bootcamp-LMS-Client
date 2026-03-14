import React from 'react';
import { X, FileText, Calendar, Link as LinkIcon, User as UserIcon } from 'lucide-react';
import { useGetTeacherAssignmentsQuery } from '../../../features/teacher/teacherApi';
import { ensureAbsoluteUrl } from '../../../utils/helpers';

const TeacherAssignmentsPanel = ({ isOpen, onClose, teacher }) => {
    // Only fetch if panel is open and a teacher is selected
    const { data: assignmentsResponse, isLoading } = useGetTeacherAssignmentsQuery(
        { teacherId: teacher?._id },
        { skip: !isOpen || !teacher?._id }
    );

    const assignments = assignmentsResponse?.data || [];

    const getStatusColor = (deadline) => {
        const isPast = new Date(deadline) < new Date();
        return isPast ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600";
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Slide-over Panel */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{teacher?.name}'s Assignments</h2>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                            <FileText size={14} />
                            {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''} Created
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                            <div className="w-8 h-8 border-4 border-[#1111d4]/20 border-t-[#1111d4] rounded-full animate-spin" />
                            <p className="font-medium text-sm text-slate-500">Loading assignments...</p>
                        </div>
                    ) : assignments.length > 0 ? (
                        <div className="space-y-4">
                            {assignments.map(assignment => (
                                <div 
                                    key={assignment._id}
                                    className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-[#1111d4]/30 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-[#1111d4] transition-colors line-clamp-1 pr-4">
                                            {assignment.title}
                                        </h4>
                                        <span className={`shrink-0 px-2.5 py-1 font-bold text-[10px] uppercase rounded-lg ${getStatusColor(assignment.deadline)}`}>
                                            {new Date(assignment.deadline) < new Date() ? 'Past Due' : 'Active'}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2">
                                        {assignment.description}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-slate-50 rounded-lg p-2.5">
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Bootcamp</p>
                                            <p className="text-xs font-bold text-slate-700 truncate">{assignment.bootcamp?.name || 'N/A'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-2.5">
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Domain</p>
                                            <p className="text-xs font-bold text-slate-700 truncate">{assignment.domain?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            <Calendar size={14} className="text-[#1111d4]" />
                                            Due: {new Date(assignment.deadline).toLocaleDateString()}
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            <span className="font-bold text-slate-700">{assignment.submissionsCount || 0}</span> / {assignment.totalStudentsCount || 0} Submissions
                                        </div>
                                    </div>

                                    {/* Optional attachment link */}
                                    {assignment.documentUrl && (
                                        <div className="mt-3">
                                            <a 
                                                href={ensureAbsoluteUrl(assignment.documentUrl)} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-[#1111d4] hover:underline"
                                            >
                                                <LinkIcon size={12} />
                                                View Resource Doc
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-60 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-base font-bold text-slate-700">No assignments found</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1 max-w-[250px]">
                                {teacher?.name} has not created any assignments yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TeacherAssignmentsPanel;
