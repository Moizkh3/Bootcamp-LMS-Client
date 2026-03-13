import React from 'react';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import Button from '../../../../components/common/Button';

export default function BootcampProgressTab({ bootcampId }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-[#1111d4]" size={24} />
                    <div>
                        <h3 className="text-lg font-bold text-[#0f172a]">Bootcamp Health</h3>
                        <p className="text-sm text-[#64748b]">Overall metrics and performance indicators</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-[#f8fafc] rounded-lg border border-[#f1f5f9]">
                        <div className="flex items-center gap-2 text-[#64748b] mb-2">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Avg. Attendance</span>
                        </div>
                        <p className="text-2xl font-bold text-[#0f172a]">--%</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Awaiting data</p>
                    </div>

                    <div className="p-4 bg-[#f8fafc] rounded-lg border border-[#f1f5f9]">
                        <div className="flex items-center gap-2 text-[#64748b] mb-2">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Assignment Completion</span>
                        </div>
                        <p className="text-2xl font-bold text-[#0f172a]">--%</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Awaiting data</p>
                    </div>

                    <div className="p-4 bg-[#f8fafc] rounded-lg border border-[#f1f5f9]">
                        <div className="flex items-center gap-2 text-[#64748b] mb-2">
                            <TrendingUp size={16} />
                            <span className="text-sm font-medium">Average Grade</span>
                        </div>
                        <p className="text-2xl font-bold text-[#0f172a]">--/10</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Awaiting data</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                    <h4 className="font-bold text-[#0f172a] mb-4">Recent Activity</h4>
                    <div className="flex flex-col items-center justify-center py-8 text-[#64748b]">
                        <Clock size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No recent activity found</p>
                    </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                    <h4 className="font-bold text-[#0f172a] mb-4">At Risk Students</h4>
                    <div className="flex flex-col items-center justify-center py-8 text-[#64748b]">
                        <Users size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No students at risk</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
