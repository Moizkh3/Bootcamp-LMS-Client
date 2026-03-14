import React from 'react';
import { FileText, Calendar, Link as LinkIcon, Briefcase, Layers } from 'lucide-react';
import { useGetTeacherAssignmentsQuery } from '../../../../features/teacher/teacherApi';
import { ensureAbsoluteUrl } from '../../../../utils/helpers';

export default function TeacherAssignmentsTab({ teacherId }) {
    const { data: assignmentsResponse, isLoading } = useGetTeacherAssignmentsQuery(
        { teacherId },
        { skip: !teacherId }
    );

    const assignments = assignmentsResponse?.data || [];

    const getStatusColor = (deadline) => {
        const isPast = new Date(deadline) < new Date();
        return isPast ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100";
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                <div className="w-10 h-10 border-4 border-[#1111d4]/20 border-t-[#1111d4] rounded-full animate-spin" />
                <p className="font-bold text-slate-500">Loading assignments...</p>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
                    <FileText size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-700">No Assignments Yet</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                    This teacher hasn't created any assignments for their assigned bootcamps.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    Recent Assignments
                    <span className="text-sm font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">
                        {assignments.length}
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.map(assignment => (
                    <div 
                        key={assignment._id}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1111d4]/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-slate-800 text-lg group-hover:text-[#1111d4] transition-colors line-clamp-1 pr-4">
                                {assignment.title}
                            </h4>
                            <span className={`shrink-0 px-2.5 py-1 font-bold text-[10px] uppercase rounded-lg border ${getStatusColor(assignment.deadline)}`}>
                                {new Date(assignment.deadline) < new Date() ? 'Past Due' : 'Active'}
                            </span>
                        </div>
                        
                        <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                            {assignment.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                                    <Briefcase size={12} />
                                    Bootcamp
                                </div>
                                <p className="text-xs font-bold text-slate-700 truncate">{assignment.bootcamp?.name || 'N/A'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                                    <Layers size={12} />
                                    Domain
                                </div>
                                <p className="text-xs font-bold text-slate-700 truncate">{assignment.domain?.name || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <Calendar size={14} className="text-[#1111d4]" />
                                Due: {new Date(assignment.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1111d4]">
                                <span className="px-2 py-0.5 bg-blue-50 rounded-md">
                                    {assignment.submissionsCount || 0} / {assignment.totalStudentsCount || 0} Submissions
                                </span>
                            </div>
                        </div>

                        {assignment.documentUrl && (
                            <div className="mt-4 flex justify-end">
                                <a 
                                    href={ensureAbsoluteUrl(assignment.documentUrl)} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1111d4] hover:underline"
                                >
                                    <LinkIcon size={14} />
                                    View Resource Doc
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
