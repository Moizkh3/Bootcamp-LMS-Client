import React from 'react';
import { Mail, Shield, Briefcase, Layers, Users, Calendar, TrendingUp } from 'lucide-react';
import StatCard from '../../../../components/common/StatCard';

export default function TeacherOverviewTab({ teacher }) {
    if (!teacher) return null;

    const domains = teacher.teacherDomainIds || [];
    const bootcamps = teacher.teacherBootcampIds || [];
    
    // In a real app, these counts might come from a specialized stats endpoint
    // For now we'll use what's available in the user object
    const stats = [
        {
            label: 'Assigned Bootcamps',
            value: bootcamps.length,
            icon: Briefcase,
            color: 'blue'
        },
        {
            label: 'Mentored Domains',
            value: domains.length,
            icon: Layers,
            color: 'indigo'
        },
        {
            label: 'Member Since',
            value: new Date(teacher.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
            icon: Calendar,
            color: 'green'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className={`size-12 rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-black text-[#0f172a]">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Profile Info Card */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#e2e8f0] bg-[#f8fafc]">
                    <h2 className="text-lg font-bold text-[#0f172a]">Teacher Information</h2>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <p className="text-base font-bold text-[#0f172a]">{teacher.name}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <p className="text-base font-bold text-[#0f172a]">{teacher.email}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role</label>
                                <div className="flex">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 uppercase">
                                        {teacher.role}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account Status</label>
                                <div className="flex">
                                    <span className={`px-3 py-1 ${teacher.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-600 border-slate-100'} text-xs font-bold rounded-lg border uppercase`}>
                                        {teacher.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Distribution/Activity Placeholder if needed */}
        </div>
    );
}
