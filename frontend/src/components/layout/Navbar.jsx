import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Search, Command, Sun, Moon, Coffee, ExternalLink, User as UserIcon, Terminal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSelectors';
import NotificationDropdown from '../common/NotificationDropdown';
import { useGetNotificationsQuery } from '../../features/notifications/notificationApi';
import { useGetAllBootcampsQuery } from '../../features/bootcamp/bootcampApi';
import { useGetAllUsersQuery, useGetUsersByRoleQuery } from '../../features/user/userApi';

export default function Navbar({ onToggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const notificationsRef = useRef(null);
    const searchInputRef = useRef(null);
    const searchDropdownRef = useRef(null);

    // Keyboard shortcut for search (Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
    const firstName = user?.name?.split(' ')[0] || 'User';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: `Good Morning, ${firstName}!`, icon: <Coffee className="text-amber-500" size={18} /> };
        if (hour < 18) return { text: `Good Afternoon, ${firstName}!`, icon: <Sun className="text-orange-500" size={18} /> };
        return { text: `Good Evening, ${firstName}!`, icon: <Moon className="text-indigo-400" size={18} /> };
    };

    const greeting = getGreeting();

    // Search Logic
    const { data: bootcampResults } = useGetAllBootcampsQuery(
        { search: searchQuery },
        { skip: !searchQuery || !isSearchFocused }
    );
    
    // Admins can search all users, Teachers search students
    const { data: adminUserResults } = useGetAllUsersQuery(
        { search: searchQuery },
        { skip: !searchQuery || !isSearchFocused || user?.role !== 'admin' }
    );

    const { data: teacherStudentResults } = useGetUsersByRoleQuery(
        { role: 'student', search: searchQuery },
        { skip: !searchQuery || !isSearchFocused || user?.role !== 'teacher' }
    );

    const filteredBootcamps = bootcampResults?.data?.slice(0, 3) || [];
    const filteredUsers = (user?.role === 'admin' ? adminUserResults?.users : teacherStudentResults?.users)?.slice(0, 3) || [];

    const quickLinks = [
        { label: 'My Profile', path: '/profile' },
        { label: 'Announcements', path: `/${user?.role || 'admin'}/announcements` },
    ].filter(link => link.label.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[var(--color-border-soft)] h-16 flex items-center shrink-0">
            <div className="w-full flex justify-between items-center px-4 md:px-8 h-full gap-8">
                {/* Left Side: Toggle & Greeting */}
                <div className="flex items-center gap-4 min-w-max">
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden text-[#64748b] p-2 hover:bg-[#f1f5f9] rounded-lg transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    
                    <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-[var(--color-background)] rounded-full border border-[var(--color-border-soft)]">
                        {greeting.icon}
                        <span className="text-sm font-bold text-[var(--color-text-main)]">
                            {greeting.text}
                        </span>
                    </div>
                </div>

                {/* Center: Stylized Search */}
                <div className="hidden md:flex flex-1 max-w-md relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors">
                        <Search size={18} />
                    </div>
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Search bootcamps, students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="w-full h-10 pl-10 pr-12 bg-[var(--color-background)] border border-transparent focus:border-[var(--color-primary)]/20 focus:bg-white rounded-xl text-sm transition-all outline-hidden font-medium placeholder:text-[var(--color-text-light)] shadow-xs focus:shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-text-muted)] bg-white border border-[var(--color-border)] rounded-md shadow-xs uppercase tracking-tighter">
                            <Command size={10} /> K
                        </kbd>
                    </div>

                    {/* Search Results Dropdown */}
                    {isSearchFocused && searchQuery && (
                        <div 
                            ref={searchDropdownRef}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[var(--color-border-soft)] shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                            <div className="max-h-[400px] overflow-y-auto p-2 space-y-4">
                                {/* Section: Quick Links */}
                                {quickLinks.length > 0 && (
                                    <div>
                                        <p className="px-3 py-1 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Quick Links</p>
                                        <div className="mt-1 space-y-1">
                                            {quickLinks.map((link, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => { navigate(link.path); setIsSearchFocused(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--color-background)] text-left transition-colors group"
                                                >
                                                    <ExternalLink size={16} className="text-[var(--color-text-light)] group-hover:text-[var(--color-primary)]" />
                                                    <span className="text-sm font-semibold text-[var(--color-text-main)]">{link.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Section: Bootcamps */}
                                {filteredBootcamps.length > 0 && (
                                    <div>
                                        <p className="px-3 py-1 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Bootcamps</p>
                                        <div className="mt-1 space-y-1">
                                            {filteredBootcamps.map((bc) => (
                                                <button
                                                    key={bc._id}
                                                    onClick={() => { navigate(`/bootcamps/${bc._id}`); setIsSearchFocused(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--color-background)] text-left transition-colors group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                                        <Terminal size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[var(--color-text-main)]">{bc.name}</p>
                                                        <p className="text-[10px] text-[var(--color-text-muted)] font-bold">{bc.domains?.length || 0} Domains • {bc.status}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Section: Users */}
                                {filteredUsers.length > 0 && (
                                    <div>
                                        <p className="px-3 py-1 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Users</p>
                                        <div className="mt-1 space-y-1">
                                            {filteredUsers.map((u) => (
                                                <button
                                                    key={u._id}
                                                    onClick={() => { navigate(`/students/${u._id}`); setIsSearchFocused(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--color-background)] text-left transition-colors group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <UserIcon size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[var(--color-text-main)]">{u.name}</p>
                                                        <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">{u.role}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {quickLinks.length === 0 && filteredBootcamps.length === 0 && filteredUsers.length === 0 && (
                                    <div className="p-8 text-center">
                                        <Search size={24} className="mx-auto text-[var(--color-text-light)] mb-2 opacity-20" />
                                        <p className="text-sm text-[var(--color-text-muted)] font-medium">No results found for "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                            <div className="bg-[var(--color-background)] p-3 border-t border-[var(--color-border-soft)]">
                                <p className="text-[10px] text-center text-[var(--color-text-muted)] font-bold uppercase tracking-wider">
                                    Tip: Type a name or bootcamp to search
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 md:gap-5">
                    <div className="relative" ref={notificationsRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={`relative p-2.5 rounded-xl transition-all ${isNotificationsOpen ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[#64748b] hover:bg-[var(--color-background)] hover:text-[var(--color-text-main)]'}`}
                        >
                            <Bell size={22} className={unreadCount > 0 ? 'animate-pulse' : ''} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
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

                    <div className="hidden sm:block h-6 w-px bg-[var(--color-border-soft)] mx-1"></div>

                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-3 p-1 pr-3 rounded-xl hover:bg-[var(--color-background)] transition-all cursor-pointer group"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full p-0.5 bg-linear-to-tr from-[var(--color-primary)] to-[var(--color-accent)] group-hover:rotate-12 transition-transform duration-500">
                                <img
                                    src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || 'User')}
                                    alt="User Avatar"
                                    className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            </div>
                            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[var(--color-success)] rounded-full border-2 border-white shadow-xs" />
                        </div>
                        
                        <div className="hidden lg:block text-left">
                            <p className="text-sm font-bold text-[var(--color-text-main)] leading-none group-hover:text-[var(--color-primary)] transition-colors">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-1 opacity-70">
                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : role}
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </header>

    );
}

