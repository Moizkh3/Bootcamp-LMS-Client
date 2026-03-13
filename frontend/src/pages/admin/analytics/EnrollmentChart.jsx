import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EnrollmentChart = ({ domains = [] }) => {
    const data = domains.map(d => ({
        name: d.name,
        value: d.students || 0
    })).filter(d => d.value > 0);

    const COLORS = ['#3636e2', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 font-medium italic">No enrollment data to display</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight mb-6">Enrollment by Domain</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EnrollmentChart;
