import React from 'react';
import { Calendar, Layers, Users, ShieldAlert, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

const COLORS = ['#1111d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function BootcampOverviewTab({ bootcamp }) {
    if (!bootcamp) return null;

    const stats = bootcamp.stats || {};
    const studentsByDomain = stats.studentsByDomain || [];
    const assignmentsByStatus = stats.assignmentsByStatus || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2 text-[#64748b] group-hover:text-[#1111d4] transition-colors">
                        <Calendar size={18} />
                        <span className="text-sm font-medium">Start Date</span>
                    </div>
                    <p className="text-lg font-bold text-[#0f172a]">
                        {bootcamp.startDate ? new Date(bootcamp.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </p>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2 text-[#64748b] group-hover:text-[#1111d4] transition-colors">
                        <Calendar size={18} />
                        <span className="text-sm font-medium">End Date</span>
                    </div>
                    <p className="text-lg font-bold text-[#0f172a]">
                        {bootcamp.endDate ? new Date(bootcamp.endDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </p>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2 text-[#64748b] group-hover:text-[#1111d4] transition-colors">
                        <Layers size={18} />
                        <span className="text-sm font-medium">Domains</span>
                    </div>
                    <p className="text-lg font-bold text-[#0f172a]">{bootcamp.domains?.length || 0}</p>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2 text-[#64748b] group-hover:text-[#1111d4] transition-colors">
                        <Users size={18} />
                        <span className="text-sm font-medium">Students Enrolled</span>
                    </div>
                    <p className="text-lg font-bold text-[#0f172a]">{bootcamp.studentCount || 0}</p>
                </div>
            </div>

            {/* Analytics Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student Distribution - Pie Chart */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
                        <div className="flex items-center gap-2">
                            <GraduationCap size={20} className="text-[#1111d4]" />
                            <h2 className="text-[17px] font-bold text-[#0f172a]">Student Distribution</h2>
                        </div>
                        <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="p-8 h-[360px] flex items-center justify-center">
                        {studentsByDomain.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={studentsByDomain}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={6}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {studentsByDomain.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]} 
                                                className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                                            />
                                        ))}
                                    </Pie>
                                    <ReTooltip 
                                        contentStyle={{ 
                                            borderRadius: '12px', 
                                            border: 'none', 
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px 16px',
                                            fontWeight: '700'
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36} 
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        formatter={(value) => <span className="text-xs font-bold text-slate-600">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                                <Users size={40} className="text-slate-200 mb-3" />
                                <p className="text-slate-400 font-medium">No student data available yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Assignment Status - Bar Chart */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
                        <div className="flex items-center gap-2">
                            <Briefcase size={20} className="text-[#1111d4]" />
                            <h2 className="text-[17px] font-bold text-[#0f172a]">Assignment Overview</h2>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">Real-time</span>
                    </div>
                    <div className="p-8 h-[360px]">
                        {assignmentsByStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={assignmentsByStatus}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <ReTooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ 
                                            borderRadius: '12px', 
                                            border: 'none', 
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px 16px',
                                            fontWeight: '700'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#1111d4" 
                                        radius={[6, 6, 0, 0]} 
                                        barSize={45}
                                    >
                                        {assignmentsByStatus.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.name === 'Active' ? '#1111d4' : '#94a3b8'} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <Briefcase size={40} className="text-slate-200 mb-3" />
                                <p className="text-slate-400 font-medium">No assignment data available yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-[#1111d4]/5 border border-[#1111d4]/10 rounded-2xl flex items-center gap-5 group hover:bg-[#1111d4]/10 transition-colors">
                    <div className="size-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#1111d4] ring-1 ring-[#1111d4]/10">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500">Mentors Assigned</p>
                        <h3 className="text-2xl font-black text-[#0f172a]">{stats.teachersCount || 0}</h3>
                    </div>
                </div>
                <div className="p-6 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-5 group hover:bg-green-100/50 transition-colors">
                    <div className="size-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-green-600 ring-1 ring-green-100">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500">Total Assignments</p>
                        <h3 className="text-2xl font-black text-[#0f172a]">{stats.assignmentsCount || 0}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
