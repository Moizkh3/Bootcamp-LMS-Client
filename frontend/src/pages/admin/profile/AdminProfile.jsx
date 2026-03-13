import { useState, useRef } from 'react';
import {
    User, Mail, Phone, MapPin, Shield, Edit3, Camera,
    BookOpen, Users, ClipboardList, Award, Bell, LogOut, Save, Link, Briefcase, Lock
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../features/auth/authSlice';
import { useLazyLogoutUserQuery } from '../../../features/auth/authServiceApi';
import { toast } from 'react-hot-toast';
import { selectCurrentUser } from '../../../features/auth/authSelectors';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Toggle from '../../../components/common/Toggle';
import Button from '../../../components/common/Button';
import { useGetKpisQuery } from '../../../features/admin/adminApi';
import { useUpdateProfileMutation } from '../../../features/user/userApi';
import { useGetNotificationsQuery } from '../../../features/notifications/notificationApi';

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQOFRFzb6wG7mWa0Ie7zEd2YCK3fy1Z9carpLXqmw7d8zyZfTVAYwD9UsbwwamWeEbqrhQh69_DrANC4nDdiW0Z70BtU_XgxI50xOUYtKclOeqGugKRlpeeQpIy1YLsunsdUHiJ6T-K9DCkumcA_vEN1npcRXHCjgnAWYRiUeRKYBSFnQlGH-eiM041m7vHMyNG_meI5K1I-BUCyQRbIRP-AzGMTtT0CuJik0zPMu2ae4xlF10dFqWa9MA9t24JT0dCnw';

const activityColor = {
    success: 'var(--color-success)',
    info: 'var(--color-primary)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    danger: 'var(--color-error)',
};

// Removed static stats array to use dynamic one inside component

// Removed static activity array to use dynamic notifications as activity

function Field({ icon: Icon, label, value, onChange, disabled, type = 'text' }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{label}</label>
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${disabled ? 'bg-[var(--color-surface-alt)] border-[var(--color-border)]' : 'bg-white border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20'}`}>
                <Icon size={16} className="text-[var(--color-text-light)] shrink-0" />
                <input
                    type={type}
                    className="flex-1 bg-transparent text-sm font-semibold text-[var(--color-text-main)] outline-none disabled:text-[var(--color-text-muted)]"
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export default function AdminProfile() {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [triggerLogout] = useLazyLogoutUserQuery();
    
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        role: user?.role || 'Admin',
        bio: user?.bio || '',
        avatar: user?.avatar || DEFAULT_AVATAR,
    });
    const [saved, setSaved] = useState(false);
    const [notifications, setNotifications] = useState({
        enrollment: true,
        assignments: true,
        reports: false,
        mentors: true,
    });
    const { data: kpiData, isLoading: isKpiLoading } = useGetKpisQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const { data: notificationData } = useGetNotificationsQuery();

    const stats = [
        { label: 'Bootcamps Managed', value: kpiData?.data?.totalBootcamps || '0', icon: BookOpen, color: 'var(--color-primary)' },
        { label: 'Total Students', value: kpiData?.data?.totalStudents || '0', icon: Users, color: '#059669' },
        { label: 'Active Assignments', value: kpiData?.data?.activeassignments || '0', icon: ClipboardList, color: '#d97706' },
        { label: 'Pending Reviews', value: kpiData?.data?.pendingSubmissions || '0', icon: ClipboardList, color: '#7c3aed' },
    ];

    const recentActivity = notificationData?.data?.slice(0, 5).map(n => {
        const dateObj = new Date(n.createdAt || n.time);
        return {
            message: n.message,
            time: isNaN(dateObj.getTime()) ? 'Just now' : dateObj.toLocaleString(),
            type: n.type || 'info'
        };
    }) || [];



    const toggleNotif = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(form).unwrap();
            setIsEditing(false);
            setSaved(true);
            toast.success('Profile updated successfully');
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => setIsEditing(false);

    const handleLogout = async () => {
        try {
            await triggerLogout().unwrap();
            dispatch(logout());
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (err) {
            dispatch(logout());
            navigate('/login');
        }
    };

    return (
        <div className="max-w-[1280px] mx-auto">
            <Breadcrumbs />

            {/* Hero Banner + Avatar — structured so avatar overlaps the banner bottom edge */}
            <div className="relative mb-6">
                {/* Banner */}
                <div className="rounded-2xl h-36 bg-gradient-to-br from-[var(--color-primary)] to-[#4f46e5] overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                    />
                    {/* Edit button inside banner */}
                    <div className="absolute top-4 right-4">
                        <Button
                            variant="secondary"
                            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                            icon={<Edit3 size={15} />}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>
                </div>

                {/* Avatar — outside the overflow-hidden banner, overlapping via negative margin */}
                <div className="absolute left-6 -bottom-10 flex items-end gap-4">
                    <div className="relative">
                        <img
                            src={form.avatar}
                            alt={form.name}
                            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
                            onError={e => { e.target.src = DEFAULT_AVATAR; }}
                        />
                    </div>
                </div>
            </div>

            {/* Name & Role — spaced below the avatar overlap */}
            <div className="ml-6 mt-12 mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text-main)]">{form.name}</h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-xs font-bold px-3 py-1 rounded-full">
                        <Shield size={11} /> {form.role}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">{form.email}</span>
                    {saved && (
                        <span className="inline-flex items-center gap-1 bg-[var(--color-success-bg)] text-[var(--color-success)] text-xs font-bold px-3 py-1 rounded-full">
                            ✓ Profile saved
                        </span>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18`, color }}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[var(--color-text-main)]">{value}</p>
                            <p className="text-xs text-[var(--color-text-muted)] font-medium">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info / Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-border-soft)] flex items-center gap-2">
                            <User size={18} className="text-[var(--color-primary)]" />
                            <h2 className="font-bold text-[var(--color-text-main)]">Profile Information</h2>
                            {isEditing && (
                                <span className="ml-auto text-xs text-[var(--color-primary)] font-semibold bg-[var(--color-primary-muted)] px-2 py-0.5 rounded-full">
                                    Editing
                                </span>
                            )}
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <Field icon={User} label="Full Name" value={form.name} disabled={!isEditing} onChange={e => setForm({ ...form, name: e.target.value })} />
                                <Field icon={Mail} label="Email Address" value={form.email} disabled={!isEditing} onChange={e => setForm({ ...form, email: e.target.value })} />
                                <Field icon={Briefcase} label="Designation" value={form.role} disabled={!isEditing} onChange={e => setForm({ ...form, role: e.target.value })} />
                                <div className="space-y-1.5 opacity-60">
                                    <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Profile Picture</label>
                                    <div className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2 border transition-colors bg-[var(--color-surface-alt)] border-[var(--color-border)]`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[var(--color-border)]">
                                                <img src={form.avatar || DEFAULT_AVATAR} alt="preview" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-sm font-semibold text-[var(--color-text-main)]">Avatar Image</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Bio</label>
                                <textarea
                                    className={`w-full rounded-xl px-4 py-3 border text-sm font-semibold text-[var(--color-text-main)] outline-none resize-none transition-colors ${!isEditing ? 'bg-[var(--color-surface-alt)] border-[var(--color-border)] text-[var(--color-text-muted)]' : 'bg-white border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20'}`}
                                    rows={3}
                                    value={form.bio}
                                    disabled={!isEditing}
                                    onChange={e => setForm({ ...form, bio: e.target.value })}
                                />
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        icon={<Save size={15} />}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-border-soft)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lock size={18} className="text-[var(--color-primary)]" />
                                <h2 className="font-bold text-[var(--color-text-main)]">Security Settings</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between bg-[var(--color-surface-alt)] p-4 rounded-xl border border-[var(--color-border)]">
                                <div>
                                    <p className="text-sm font-bold text-[var(--color-text-main)]">Account Password</p>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Change your password to keep your account secure.</p>
                                </div>
                                <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => navigate('/change-password')}
                                    className="font-bold border-[var(--color-primary)] text-[var(--color-primary)]"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-border-soft)] flex items-center gap-2">
                            <Bell size={18} className="text-[var(--color-primary)]" />
                            <h2 className="font-bold text-[var(--color-text-main)]">Notifications</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { label: 'New Enrollment Alerts', key: 'enrollment' },
                                { label: 'Assignment Submissions', key: 'assignments' },
                                { label: 'System Reports', key: 'reports' },
                                { label: 'Mentor Updates', key: 'mentors' },
                            ].map(n => (
                                <div key={n.label} className="flex items-center justify-between gap-4">
                                    <p className="text-sm font-medium text-[var(--color-text-main)]">{n.label}</p>
                                    <Toggle
                                        checked={notifications[n.key]}
                                        onChange={() => toggleNotif(n.key)}
                                        label={n.label}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-border-soft)]">
                            <h2 className="font-bold text-[var(--color-text-main)]">Recent Activity</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {recentActivity.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: activityColor[item.type] }} />
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--color-text-main)] leading-snug">{item.action}</p>
                                        <p className="text-[0.65rem] text-[var(--color-text-muted)] mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="danger"
                        className="w-full"
                        onClick={handleLogout}
                        icon={<LogOut size={18} />}
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
