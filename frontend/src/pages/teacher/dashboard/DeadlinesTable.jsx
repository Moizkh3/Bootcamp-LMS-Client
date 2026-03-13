import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeadlinesTable = ({ deadlines = [] }) => {
    const navigate = useNavigate();

    // Remove the hardcoded deadlines array

    return (
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)]">
                <h3 className="text-lg font-bold text-[var(--color-text-main)] tracking-tight">Upcoming Deadlines</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[var(--color-surface)] text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                            <th className="px-6 py-4">Assignment Name</th>
                            <th className="px-6 py-4">Domain</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Submissions</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {deadlines.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-[var(--color-text-muted)]">
                                    No upcoming deadlines found.
                                </td>
                            </tr>
                        ) : deadlines.map((item) => (
                            <tr key={item._id} className="hover:bg-[var(--color-primary)]/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <span className="text-sm font-semibold text-[var(--color-text-main)]">{item.title}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm text-[var(--color-text-muted)] font-medium">
                                        {item.domain?.name || (typeof item.domain === 'string' ? item.domain : 'Deleted Domain')}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-sm text-[var(--color-text-muted)] font-medium">
                                    {new Date(item.deadline).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1.5 w-32">
                                        <div className="h-2 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-tighter">
                                            {item.submissionsCount} / {item.totalStudents} students
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button
                                        onClick={() => navigate(`/teacher/grading`)}
                                        className="text-[var(--color-primary)] font-semibold text-sm hover:underline"
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeadlinesTable;
