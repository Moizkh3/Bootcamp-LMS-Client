import React, { useState, useMemo, useRef } from 'react';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { Users, Search, Clock, ChevronDown, LayoutGrid, List as ListIcon, Calendar } from 'lucide-react';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import { format } from 'date-fns';
import { progressApi } from '../../../features/progress/progressApi';
import LoadingScreen from '../../../components/common/LoadingScreen';

const adminProgressApi = progressApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllStandups: builder.query({
            query: (params) => ({
                url: '/progress/all',
                params
            }),
            providesTags: ['Progress']
        })
    }),
    overrideExisting: true
});

const { useGetAllStandupsQuery } = adminProgressApi;

export default function AdminStandups() {
    const [selectedDomain, setSelectedDomain] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [range, setRange] = useState('1 Day');
    const [view, setView] = useState('table');
    const [customRange, setCustomRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date()
    });
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const { data: domainsData } = useGetAllDomainsQuery();
    const domains = domainsData?.data || [];

    const { data: progressResponse, isLoading } = useGetAllStandupsQuery({
        domainId: selectedDomain === 'all' ? undefined : selectedDomain
    });

    const allProgress = progressResponse?.data || [];

    // Time range filtering
    const filteredByTime = useMemo(() => {
        return allProgress.filter(p => {
            const date = new Date(p.createdAt || p.date);
            const now = new Date();
            if (range === '1 Day') {
                const start = new Date(now); start.setHours(0, 0, 0, 0);
                return date >= start;
            } else if (range === '3 Days') {
                return date >= new Date(new Date().setDate(now.getDate() - 3));
            } else if (range === '7 Days') {
                return date >= new Date(new Date().setDate(now.getDate() - 7));
            } else if (range === '10 Days') {
                return date >= new Date(new Date().setDate(now.getDate() - 10));
            } else if (range === '20 Days') {
                return date >= new Date(new Date().setDate(now.getDate() - 20));
            } else if (range === '1 Month') {
                return date >= new Date(new Date().setMonth(now.getMonth() - 1));
            } else if (range === 'Custom') {
                const start = new Date(customRange.start).setHours(0, 0, 0, 0);
                const end = new Date(customRange.end).setHours(23, 59, 59, 999);
                return date >= start && date <= end;
            }
            return true;
        });
    }, [allProgress, range, customRange]);

    // Search filter
    const filteredProgress = filteredByTime.filter(p =>
        p.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.studentId?.rollNo?.toString().includes(searchTerm)
    );

    const handleDateChange = (e, type) => {
        const newDate = new Date(e.target.value);
        if (!isNaN(newDate)) {
            setCustomRange(prev => ({ ...prev, [type]: newDate }));
        }
    };

    const domainOptions = [
        { value: 'all', label: 'All Domains' },
        ...domains.map(d => ({ value: d._id, label: d.name }))
    ];

    return (
        <div className="max-w-[1440px] mx-auto pb-10">
            <Breadcrumbs />

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Standups Monitoring</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Monitor daily progress reports across all domains and bootcamps.
                    </p>
                </div>
            </div>

            {/* Filters Row 1: Search + Domain */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by student name or roll number..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <select
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="w-full appearance-none bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all cursor-pointer"
                    >
                        {domainOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Filters Row 2: Time Range + View Toggle */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Time Range Dropdown */}
                <div className="relative">
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="appearance-none bg-[var(--color-surface)] h-[46px] pl-4 pr-10 text-xs font-bold text-[var(--color-text-main)] rounded-xl border border-[var(--color-border)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 cursor-pointer transition-all"
                    >
                        <option value="1 Day">Last 24 Hours</option>
                        <option value="3 Days">Last 3 Days</option>
                        <option value="7 Days">Last 7 Days</option>
                        <option value="10 Days">Last 10 Days</option>
                        <option value="20 Days">Last 20 Days</option>
                        <option value="1 Month">Last Month</option>
                        <option value="Custom">Custom Range</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" size={16} />
                </div>

                {/* View Toggle */}
                <div className="flex bg-[var(--color-surface)] p-1 rounded-xl shadow-sm border border-[var(--color-border)] h-[46px]">
                    <button
                        onClick={() => setView('card')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'card' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
                    >
                        <LayoutGrid size={14} />
                        Cards
                    </button>
                    <button
                        onClick={() => setView('table')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'table' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
                    >
                        <ListIcon size={14} />
                        Table
                    </button>
                </div>

                {/* Custom Date Pickers */}
                {range === 'Custom' && (
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="date"
                                ref={startDateRef}
                                onChange={(e) => handleDateChange(e, 'start')}
                                className="absolute opacity-0 pointer-events-none"
                                value={format(customRange.start, 'yyyy-MM-dd')}
                            />
                            <Button
                                onClick={() => startDateRef.current.showPicker()}
                                variant="secondary"
                                className="bg-[var(--color-surface)] h-[46px] px-3"
                                icon={<Calendar size={16} />}
                            >
                                <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 mr-1">From:</span>
                                <span className="text-xs">{format(customRange.start, 'MMM d, yyyy')}</span>
                            </Button>
                        </div>
                        <div className="relative">
                            <input
                                type="date"
                                ref={endDateRef}
                                onChange={(e) => handleDateChange(e, 'end')}
                                className="absolute opacity-0 pointer-events-none"
                                value={format(customRange.end, 'yyyy-MM-dd')}
                            />
                            <Button
                                onClick={() => endDateRef.current.showPicker()}
                                variant="secondary"
                                className="bg-[var(--color-surface)] h-[46px] px-3"
                                icon={<Calendar size={16} />}
                            >
                                <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 mr-1">To:</span>
                                <span className="text-xs">{format(customRange.end, 'MMM d, yyyy')}</span>
                            </Button>
                        </div>
                    </div>
                )}

                <span className="text-xs text-[var(--color-text-muted)] font-medium ml-auto">
                    {filteredProgress.length} standup{filteredProgress.length !== 1 ? 's' : ''} found
                </span>
            </div>

            {/* Card View */}
            {view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading ? (
                         <div className="col-span-full">
                            <LoadingScreen variant="contained" text="Loading standups..." />
                         </div>
                    ) : filteredProgress.length > 0 ? (
                        filteredProgress.map(p => (
                            <div key={p._id} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                                        {p.studentId?.name?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-[#0f172a] truncate">{p.studentId?.name}</p>
                                        <p className="text-[10px] text-[#64748b] font-medium">Roll: {p.studentId?.rollNo}</p>
                                    </div>
                                    <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.grade ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {p.grade ? `${p.grade}` : 'Pending'}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-[#475569] line-clamp-2">
                                        <span className="font-bold text-[#0f172a]">Did: </span>{p.yesterdayWork}
                                    </p>
                                    <p className="text-xs text-[#475569] line-clamp-2">
                                        <span className="font-bold text-[#0f172a]">Plan: </span>{p.todayPlan}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e2e8f0]">
                                    <div className="flex items-center gap-1 text-xs font-bold text-[#0f172a]">
                                        <Clock size={12} className="text-[#64748b]" />
                                        {p.hoursWorked}h logged
                                    </div>
                                    <span className="text-[10px] text-[#64748b] font-medium">{new Date(p.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-[#e2e8f0]">
                            <Users size={48} className="mx-auto mb-4 opacity-20 text-[#64748b]" />
                            <p className="font-bold text-[#0f172a]">No standups found</p>
                            <p className="text-sm text-[#64748b] mt-1">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Table View */
                <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Bootcamp / Domain</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Progress Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Hours</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2e8f0]">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12">
                                            <LoadingScreen variant="contained" text="Loading standups..." />
                                        </td>
                                    </tr>
                                ) : filteredProgress.length > 0 ? (
                                    filteredProgress.map((p) => (
                                        <tr key={p._id} className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm">
                                                        {p.studentId?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#0f172a]">{p.studentId?.name}</p>
                                                        <p className="text-xs text-[#64748b] font-medium">Roll: {p.studentId?.rollNo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-[#0f172a]">{p.bootcampId?.name}</p>
                                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-[#475569] text-[10px] font-bold rounded uppercase tracking-wider">
                                                        {domains.find(d => d._id === p.studentId?.domainId)?.name || 'General'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-[#475569] line-clamp-1">
                                                        <span className="font-bold text-[#0f172a]">Did:</span> {p.yesterdayWork}
                                                    </p>
                                                    <p className="text-sm text-[#475569] line-clamp-1">
                                                        <span className="font-bold text-[#0f172a]">Plan:</span> {p.todayPlan}
                                                    </p>
                                                    {p.blockers && (
                                                        <p className="text-[11px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md inline-block mt-1">
                                                            Blockers: {p.blockers}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-[#0f172a] font-bold">
                                                    <Clock size={14} className="text-[#64748b]" />
                                                    <span>{p.hoursWorked}h</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-[#0f172a]">{new Date(p.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[10px] text-[#64748b] font-medium">{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.grade ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {p.grade ? `Graded: ${p.grade}` : 'Pending Review'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-[#64748b]">
                                            <Users size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-lg font-bold text-[#0f172a]">No standups found</p>
                                            <p className="text-sm mt-1 font-medium">Try adjusting your filters or search term.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
