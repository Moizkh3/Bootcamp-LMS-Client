import React, { useEffect } from 'react';
// Add Bell import for empty state
import { Bell, ClipboardListIcon, ClockIcon, StarIcon, InfoIcon, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { useMarkNotificationsReadMutation } from '../../features/notifications/notificationApi';
import { formatDistanceToNow } from 'date-fns';

const getIcon = (type) => {
    switch (type) {
        case 'announcement': return <InfoIcon size={18} className="text-blue-500" />;
        case 'feedback': return <StarIcon size={18} className="text-green-500" />;
        case 'submission': return <ClipboardListIcon size={18} className="text-orange-500" />;
        default: return <InfoIcon size={18} className="text-gray-400" />;
    }
};

const getIconBg = (type) => {
    switch (type) {
        case 'announcement': return 'bg-blue-100';
        case 'feedback': return 'bg-green-100';
        case 'submission': return 'bg-orange-100';
        default: return 'bg-gray-100';
    }
};

export default function NotificationDropdown({ onClose, notifications = [], unreadCount = 0 }) {
    const [markAllRead] = useMarkNotificationsReadMutation();

    // Mark as read when opening (optional, but requested by unread dot logic)
    useEffect(() => {
        if (unreadCount > 0) {
            // We could mark as read here or wait for "Mark all as read" button
        }
    }, [unreadCount]);

    const handleMarkAllRead = async () => {
        try {
            await markAllRead().unwrap();
        } catch (err) {
            console.error('Failed to mark notifications as read', err);
        }
    };

    return (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} NEW
                        </span>
                    )}
                </div>
                <button 
                    onClick={handleMarkAllRead}
                    className="text-blue-500 text-xs font-bold hover:underline"
                >
                    Mark all as read
                </button>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${n.unread ? 'bg-blue-50/30' : ''}`}
                        >
                            <div className={`w-9 h-9 rounded-full ${getIconBg(n.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[10px] text-gray-400">
                                            {n.time && !isNaN(new Date(n.time)) 
                                                ? formatDistanceToNow(new Date(n.time), { addSuffix: true }) 
                                                : 'Just now'}
                                        </span>
                                        {n.unread && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-0.5">
                                    {n.message}
                                    {n.grade && (
                                        <span className="text-blue-600 font-bold ml-1">[{n.grade}]</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-5 py-10 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                            <Bell size={24} />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No notifications yet</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100">
                <button 
                    onClick={onClose}
                    className="w-full py-3 text-gray-400 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                    Close Panel
                </button>
            </div>
        </div>
    );
}