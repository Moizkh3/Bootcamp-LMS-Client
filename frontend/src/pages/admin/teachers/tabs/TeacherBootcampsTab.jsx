import React from 'react';
import { Briefcase, Layers, GraduationCap, Users } from 'lucide-react';

export default function TeacherBootcampsTab({ teacher }) {
    if (!teacher) return null;

    const domains = teacher.teacherDomainIds || [];
    const bootcamps = teacher.teacherBootcampIds || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header / Summary */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    Assigned Programs & Domains
                </h2>
            </div>

            {/* Bootcamps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bootcamps List */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
                        <div className="flex items-center gap-2">
                            <Briefcase size={20} className="text-[#1111d4]" />
                            <h2 className="text-[17px] font-bold text-[#0f172a]">Active Bootcamps</h2>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                            {bootcamps.length} Assigned
                        </span>
                    </div>
                    <div className="p-6">
                        {bootcamps.length > 0 ? (
                            <div className="space-y-4">
                                {bootcamps.map((bootcamp) => (
                                    <div key={bootcamp._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#1111d4]/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="size-10 rounded-lg flex items-center justify-center font-bold text-sm"
                                                style={{ backgroundColor: `${bootcamp.color}15`, color: bootcamp.color }}
                                            >
                                                {bootcamp.name?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#1111d4] transition-colors">{bootcamp.name}</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">ID: {bootcamp._id}</p>
                                            </div>
                                        </div>
                                        <div className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100 uppercase">
                                            {bootcamp.status || 'Active'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                <p className="font-medium text-sm">No bootcamps assigned to this teacher.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Domains List */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
                        <div className="flex items-center gap-2">
                            <Layers size={20} className="text-[#1111d4]" />
                            <h2 className="text-[17px] font-bold text-[#0f172a]">Mentored Domains</h2>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
                            {domains.length} Assigned
                        </span>
                    </div>
                    <div className="p-6">
                        {domains.length > 0 ? (
                            <div className="space-y-4">
                                {domains.map((domain) => (
                                    <div key={domain._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#1111d4]/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <Layers size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#1111d4] transition-colors">{domain.name}</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">{domain.description ? domain.description.substring(0, 40) + '...' : 'Domain Mentorship'}</p>
                                            </div>
                                        </div>
                                        <div className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100 uppercase">
                                            Mentoring
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                <p className="font-medium text-sm">No specific domains assigned to this teacher.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
