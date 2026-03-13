import React, { useEffect, useRef } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { authApi, useLazyLogoutUserQuery } from '../../features/auth/authServiceApi';
import { toast } from 'react-hot-toast';
import {
    LayoutDashboard,
    Terminal,
    Layers,
    BadgeCheck,
    Users,
    LineChart,
    LogOut,
    CheckSquare,
    BookOpen,
    MessageSquare
} from 'lucide-react';
import logo from '../../assets/images/logo.png';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const isTeacher = location.pathname === '/teacher' || location.pathname.startsWith('/teacher/');
    const isStudent = location.pathname === '/student' || location.pathname.startsWith('/student/');


    const adminMenuItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Bootcamps', href: '/bootcamps', icon: Terminal },
        { name: 'Domains', href: '/domains', icon: Layers },
        { name: 'Teachers', href: '/teachers', icon: BadgeCheck },
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Standups', href: '/admin/standups', icon: LineChart },
        { name: 'Announcements', href: '/admin/announcements', icon: MessageSquare },
        { name: 'Analytics', href: '/analytics', icon: LayoutDashboard },
    ];

    const teacherMenuItems = [
        { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
        { name: 'Students', href: '/teacher/students', icon: Users },
        { name: 'Standups', href: '/teacher/standups', icon: Users },
        { name: 'Assignments', href: '/teacher/assignments', icon: Layers },
        { name: 'Grading', href: '/teacher/grading', icon: CheckSquare },
        { name: 'Submissions', href: '/teacher/submissions', icon: BookOpen },
    ];

    const studentMenuItems = [
        { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
        { name: 'My Progress', href: '/student/progress', icon: LineChart },
        { name: 'Assignments', href: '/student/assignments', icon: Layers },
        { name: 'Feedback', href: '/student/feedback', icon: MessageSquare },
    ];

    let role = 'Admin';
    let menuItems = adminMenuItems;

    if (isTeacher) {
        role = 'Teacher';
        menuItems = teacherMenuItems;
    } else if (isStudent) {
        role = 'Student';
        menuItems = studentMenuItems;
    }

    const bottomItems = [
        { name: 'Logout', href: '#logout', icon: LogOut },
    ];

    const sidebarRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [triggerLogout] = useLazyLogoutUserQuery();

    const handleLogout = async () => {
        try {
            await triggerLogout().unwrap();
            dispatch(logout());
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (err) {
            console.error("Logout failed:", err);
            // Even if API fails, we should clear client state
            dispatch(logout());
            navigate('/login');
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        }

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSidebarOpen, setIsSidebarOpen]);

    return (
        <div
            ref={sidebarRef}
            className={`fixed md:sticky top-0 left-0 z-[100] md:z-10 bg-white w-64 flex flex-col h-screen border-r border-[#e2e8f0] flex-shrink-0 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            {/* Logo Area */}
            <div className="px-4 py-5 border-b border-[#e2e8f0]">
                <img
                    src={logo}
                    alt="BMS Logo"
                    className="h-auto object-contain max-h-23 w-auto"
                />
            </div>

            {/* Main Navigation */}
            <div className='flex-1 overflow-y-auto no-scrollbar flex flex-col px-4 py-4'>
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        return (
                            <NavLink
                                to={item.href}
                                end={item.href === '/' || item.name === 'Dashboard' || item.name === 'Assignments'}
                                key={item.name}
                                onClick={() => {
                                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                                }}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-colors font-bold ${isActive
                                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-main)]'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                <span className='text-sm font-medium'>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="p-4 mt-auto border-t border-[#e2e8f0]">
                <div className="space-y-1">
                    {bottomItems.map((item) => (
                        <NavLink
                            to={item.href}
                            key={item.name}
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-colors font-bold ${isActive && item.href !== '#logout'
                                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                    : item.name === 'Logout'
                                        ? 'text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-600'
                                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-main)]'
                                }`
                            }
                            onClick={(e) => {
                                if (item.name === 'Logout') {
                                    e.preventDefault();
                                    handleLogout();
                                }
                                if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                        >
                            <item.icon size={20} />
                            <span className='text-sm font-medium'>{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
