import React from 'react';
import { Activity, Users, CheckCircle, Award, Star } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
        <div className="flex justify-between items-start">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                <Icon size={20} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {change}
            </span>
        </div>
        <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{value}</h3>
        </div>
    </div>
);

const OverallHealth = ({ domains = [], kpis }) => {
    const statusColor = (status) => {
        if (status === 'Excellent' || status === 'Active') return 'bg-green-50 text-green-700';
        if (status === 'At Risk' || status === 'Empty') return 'bg-red-50 text-red-600';
        return 'bg-blue-50 text-blue-700';
    };

    const colors = ['#3636e2', '#a855f7', '#10b981', '#06b6d4'];

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={kpis?.totalStudents || "0"}
                    change="+12%"
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Active Assignments"
                    value={kpis?.activeassignments || "0"}
                    change="+5"
                    icon={CheckCircle}
                    trend="up"
                />
                <StatCard
                    title="Total Bootcamps"
                    value={kpis?.totalBootcamps || "0"}
                    change="Stable"
                    icon={Award}
                    trend="up"
                />
                <StatCard
                    title="Total Teachers"
                    value={kpis?.totalTeachers || "0"}
                    change="+2"
                    icon={Activity}
                    trend="up"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bootcamp Progress */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                    <h3 className="text-base font-bold text-slate-800 mb-6">Bootcamp Health Overview</h3>
                    <div className="space-y-5">
                        {domains.length > 0 ? (
                            domains.map((domain, idx) => {
                                // Calculate completion based on actual students if possible, or use a fixed seed based on ID
                                const seed = domain._id ? parseInt(domain._id.substring(domain._id.length - 2), 16) : idx;
                                const completion = (seed % 20) + 75;

                                return (
                                    <div key={domain._id}>
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{domain.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{domain.bootcamp?.name || domain.bootcamp || 'General'}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor(domain.students > 0 ? 'Active' : 'Empty')}`}>
                                                    {domain.students > 0 ? 'Active' : 'Empty'}
                                                </span>
                                                <span className="text-sm font-extrabold text-slate-800">{domain.students || 0} Students</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${Math.min(100, (domain.students || 0) * 10)}%`, backgroundColor: colors[idx % colors.length] }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-slate-400 text-sm italic">No domain data available</div>
                        )}
                    </div>
                </div>

                {/* Top Performers Placeholder */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" /> Top Performers
                    </h3>
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Award size={32} className="mb-2 opacity-20" />
                        <p className="text-xs font-medium">Coming Soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallHealth;
