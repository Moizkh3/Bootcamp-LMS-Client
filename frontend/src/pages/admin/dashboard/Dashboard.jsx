import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Users, UserCheck, ClipboardList } from 'lucide-react';
import StatCard from './StatCard';
import ActivityLogs from './ActivityLogs';
import EnrollmentChart from './EnrollmentChart';
import { useGetKpisQuery } from '../../../features/admin/adminApi';
import LoadingScreen from '../../../components/common/LoadingScreen';

export default function Dashboard() {
    const navigate = useNavigate();
    const { data: kpiResponse, isLoading, error } = useGetKpisQuery();

    if (isLoading) return <LoadingScreen variant="contained" text="Loading dashboard..." />;
    if (error) return <div className="text-red-500">Error loading dashboard: {error?.data?.message || error.message}</div>;

    const kpis = kpiResponse?.data || {};

    return (
        <div className="max-w-[1440px] mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--color-text-main)] leading-tight">
                    Dashboard Overview
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Welcome back, here's what's happening today.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                    title="Total Bootcamps"
                    value={kpis.totalBootcamps?.toString() || "0"}
                    icon={<Terminal size={20} />}
                    variant="info"
                    onClick={() => navigate('/bootcamps')}
                />
                <StatCard
                    title="Total Students"
                    value={kpis.totalStudents?.toString() || "0"}
                    icon={<Users size={20} />}
                    variant="accent"
                    onClick={() => navigate('/students')}
                />
                <StatCard
                    title="Total Mentors"
                    value={kpis.totalTeachers?.toString() || "0"}
                    icon={<UserCheck size={20} />}
                    variant="success"
                    onClick={() => navigate('/teachers')}
                />
                <StatCard
                    title="Active Assignments"
                    value={kpis.activeassignments?.toString() || "0"}
                    icon={<ClipboardList size={20} />}
                    variant="warning"
                    onClick={() => navigate('/analytics')}
                />
                <StatCard
                    title="Pending Reviews"
                    value={kpis.pendingSubmissions?.toString() || "0"}
                    icon={<ClipboardList size={20} />}
                    variant="danger"
                    onClick={() => navigate('/analytics')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ActivityLogs />
                </div>
                <div>
                    <EnrollmentChart />
                </div>
            </div>
        </div>
    );
}
