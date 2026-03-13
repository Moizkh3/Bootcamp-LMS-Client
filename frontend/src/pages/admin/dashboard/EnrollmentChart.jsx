import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useGetEnrollmentByDomainsQuery } from '../../../features/admin/adminApi';

const COLORS = [
    'var(--color-info)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
    '#8884d8',
    '#82ca9d'
];

export default function EnrollmentChart() {
    const navigate = useNavigate();
    const { data: enrollmentResponse, isLoading, error } = useGetEnrollmentByDomainsQuery();

    if (isLoading) return <div className="h-full flex items-center justify-center">Loading...</div>;
    if (error) return null;

    const enrollmentData = enrollmentResponse?.data || [];
    const totalStudents = enrollmentResponse?.totalStudents || 0;

    const chartData = enrollmentData.map((domain, index) => ({
        name: domain.name,
        value: domain.students,
        percentage: totalStudents > 0 ? Math.round((domain.students / totalStudents) * 100) : 0,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <div className="p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[1.125rem] font-bold text-[var(--color-text-main)]">
                    Enrollment by Domain
                </h2>
                <button
                    onClick={() => navigate('/domains')}
                    className="text-xs font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                    View All
                </button>
            </div>

            <div className="relative w-full h-[240px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none" isAnimationActive={true} animationBegin={200} animationDuration={1200} animationEasing="ease-out" startAngle={90} endAngle={-270}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.45} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-[var(--color-text-main)] leading-tight">
                        {totalStudents.toLocaleString()}
                    </p>
                    <p className="text-[0.65rem] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Students</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {chartData.map((domain) => (
                    <div key={domain.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domain.color, opacity: 0.45 }} />
                            <p className="text-[var(--color-text-muted)]">{domain.name}</p>
                        </div>
                        <p className="font-bold text-[var(--color-text-main)]">{domain.percentage}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
