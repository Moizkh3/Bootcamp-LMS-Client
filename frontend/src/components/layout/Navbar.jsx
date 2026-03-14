import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSelectors';
import NotificationDropdown from '../common/NotificationDropdown';
import { useGetNotificationsQuery } from '../../features/notifications/notificationApi';

export default function Navbar({ onToggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationsOpen]);

    const user = useSelector(selectCurrentUser);
    const isTeacher = location.pathname === '/teacher' || location.pathname.startsWith('/teacher/');
    const isStudent = location.pathname === '/student' || location.pathname.startsWith('/student/');
    const role = isTeacher ? 'Teacher' : isStudent ? 'Student' : 'Admin';

    const { data: notificationResponse } = useGetNotificationsQuery(null, {
        pollingInterval: 30000, // Poll every 30 seconds
    });
    const unreadCount = notificationResponse?.unreadCount || 0;

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-[#e2e8f0] h-16 flex items-center shrink-0">
            <div className="w-full flex justify-between items-center px-4 md:px-8 h-full">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden text-[#64748b] p-2 hover:bg-[#f1f5f9] rounded-lg transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative" ref={notificationsRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={`relative p-2 rounded-lg transition-colors ${isNotificationsOpen ? 'bg-[#f1f5f9] text-[#1111d4]' : 'text-[#64748b] hover:bg-[#f1f5f9]'}`}
                        >
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationsOpen && (
                            <NotificationDropdown 
                                onClose={() => setIsNotificationsOpen(false)} 
                                notifications={notificationResponse?.data || []}
                                unreadCount={unreadCount}
                            />
                        )}
                    </div>

                    <div className="hidden sm:block h-8 w-px bg-[#e2e8f0] mx-2"></div>

                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-semibold text-[var(--color-text-main)] leading-none">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[0.75rem] text-[var(--color-text-muted)] mt-1">
                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : role}
                            </p>
                        </div>
                        <div className="relative w-10 h-10">
                            <img
                                src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || 'User')}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]/30 shadow-md"
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--color-success)] rounded-full border-2 border-white" />
                        </div>
                    </button>
                </div>
            </div>
        </header>

    );
}

