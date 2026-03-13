import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetNotificationsQuery } from '../../../features/notifications/notificationApi';

export default function ActivityLogs() {
    const navigate = useNavigate();
    const { data: notificationResponse } = useGetNotificationsQuery();
    
    const logs = notificationResponse?.data?.slice(0, 5).map(n => ({
        activity: n.title || 'System Update',
        user: n.sender?.name || 'System',
        domain: n.context || 'General',
        status: n.type === 'success' ? 'Success' : n.type === 'warning' ? 'Alert' : 'Info',
        statusColor: n.type === 'success' ? 'var(--color-success)' : n.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)',
        statusBg: n.type === 'success' ? 'var(--color-success-bg)' : n.type === 'warning' ? 'var(--color-warning-bg)' : 'var(--color-primary-bg)',
        time: n.time && !isNaN(new Date(n.time)) ? new Date(n.time).toLocaleString() : 'Just now'
    })) || [];

    return (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col h-full overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--color-border-soft)] flex items-center justify-between">
                <h2 className="text-[1.125rem] font-bold text-[var(--color-text-main)]">
                    Recent Activity Logs
                </h2>
                <button
                    onClick={() => navigate('/analytics')}
                    className="text-sm font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                    View All
                </button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-[var(--color-surface-alt)]">
                        <tr>
                            {['Activity', 'User', 'Domain', 'Status', 'Timestamp'].map((head) => (
                                <th key={head} className="px-6 py-4 text-[0.75rem] font-bold text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border-soft)]">
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-soft)]">
                        {logs.map((row, index) => (
                            <tr key={index} className="hover:bg-[var(--color-surface-alt)] transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-[var(--color-text-main)]">
                                    {row.activity}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                                    {row.user}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-1 bg-[var(--color-border-soft)] text-[var(--color-text-muted)] rounded-lg text-[0.75rem] font-medium">
                                        {row.domain}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-semibold"
                                        style={{ backgroundColor: row.statusBg, color: row.statusColor }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.statusColor }} />
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--color-text-muted)] italic">
                                    {row.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
