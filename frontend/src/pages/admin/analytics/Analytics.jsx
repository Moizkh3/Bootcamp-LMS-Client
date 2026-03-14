import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import DailyActivity from './DailyActivity';
import OverallHealth from './OverallHealth';
import DomainCard from './DomainCard';
import PerformanceChart from './PerformanceChart';
import AttentionTable from './AttentionTable';
import EnrollmentChart from './EnrollmentChart';
import { useGetEnrollmentByDomainsQuery, useGetKpisQuery } from '../../../features/admin/adminApi';
import { useGetAllUsersQuery } from '../../../features/user/userApi';

const Analytics = () => {
    const [activeTab, setActiveTab] = useState('assignment');
    const navigate = useNavigate();

    const { data: domainsResponse, isLoading: domainsLoading } = useGetEnrollmentByDomainsQuery();
    const domains = domainsResponse?.data || [];

    const { data: kpisResponse, isLoading: kpisLoading } = useGetKpisQuery();
    const kpis = kpisResponse?.data;

    const { data: usersResponse, isLoading: usersLoading } = useGetAllUsersQuery({ role: 'student' });
    const students = usersResponse?.users || [];

    const renderContent = () => {
        if (domainsLoading || usersLoading || kpisLoading) {
            return <div className="p-8 text-center text-slate-500">Loading analytics data...</div>;
        }

        switch (activeTab) {
            case 'health':
                return <OverallHealth domains={domains} kpis={kpis} />;

            case 'assignment':
            default:
                return (
                    <div className="space-y-10">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Domain Performance</h3>
                                <button
                                    onClick={() => navigate('/domains')}
                                    className="text-[#3636e2] text-sm font-bold hover:underline"
                                >
                                    View All Domains
                                </button>
                            </div>
                            {/* Domain Performance Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {domains.length > 0 ? (
                                    domains.map((domain, index) => (
                                        <DomainCard key={domain._id} domain={domain} index={index} />
                                    ))
                                ) : (
                                    <div className="col-span-4 py-8 text-center bg-white border border-dashed border-slate-200 rounded-xl text-slate-400">
                                        No domains found.
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Performance Chart */}
                            <div className="lg:col-span-2">
                                <PerformanceChart />
                            </div>

                            {/* Enrollment Chart */}
                            <div className="lg:col-span-1">
                                <EnrollmentChart domains={domains} />
                            </div>
                        </div>

                        {/* Bottom Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <DailyActivity />
                        </div>

                        {/* Attention Table */}
                        <AttentionTable students={students} />
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col min-h-full">
            <Breadcrumbs />
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-main)] leading-tight">
                    Bootcamp Performance Reports
                </h2>
            </div>

            <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setActiveTab('health')}
                    className={`py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'health'
                        ? 'text-[#3636e2] border-[#3636e2]'
                        : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                >
                    Overall Health
                </button>
                <button
                    onClick={() => setActiveTab('assignment')}
                    className={`py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'assignment'
                        ? 'text-[#3636e2] border-[#3636e2]'
                        : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                >
                    Assignment Completion
                </button>

            </div>

            <div className="pb-10">
                {renderContent()}
            </div>
        </div>
    );
};

export default Analytics;
