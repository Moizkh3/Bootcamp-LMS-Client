import { useState, useRef } from 'react';
import {
    User, Mail, Phone, Shield, Edit3, Camera,
    BookOpen, Users, ClipboardList, Award, Bell, LogOut, Save, Briefcase, Lock
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
import { useGetTeacherStatsQuery } from '../../../features/teacher/teacherApi';
import { useUpdateProfileMutation } from '../../../features/user/userApi';
import { useGetNotificationsQuery } from '../../../features/notifications/notificationApi';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Teacher&background=4f46e5&color=fff';

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

export default function TeacherProfile() {
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
        role: user?.role || 'Teacher',
        bio: user?.bio || '',
        avatar: user?.avatar || DEFAULT_AVATAR,
    });
    const [saved, setSaved] = useState(false);
    const [notifications, setNotifications] = useState({
        assignments: true,
        standups: true,
        reports: false,
    });
    const { data: teacherStats, isLoading: isStatsLoading } = useGetTeacherStatsQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const { data: notificationData } = useGetNotificationsQuery();

    const stats = [
        { label: 'Active Cohorts', value: teacherStats?.data?.activeBootcampsCount ?? '0', icon: BookOpen, color: 'var(--color-primary)' },
        { label: 'Total Students', value: teacherStats?.data?.totalEnrolled ?? '0', icon: Users, color: '#059669' },
        { label: 'Pending Reviews', value: teacherStats?.data?.pendingReviewsCount ?? '0', icon: ClipboardList, color: '#d97706' },
        { label: 'Graded Assignments', value: teacherStats?.data?.gradedSubmissionsCount ?? '0', icon: Award, color: '#7c3aed' },
    ];

    const recentActivity = notificationData?.data?.slice(0, 5).map(n => {
        const dateObj = new Date(n.createdAt || n.time);
        return {
            message: n.message,
            time: isNaN(dateObj.getTime()) ? 'Just now' : dateObj.toLocaleDateString(),
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

    const handleCancel = () => {
        setIsEditing(false);
        setForm({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            location: user?.location || '',
            role: user?.role || 'Teacher',
            bio: user?.bio || '',
            avatar: user?.avatar || DEFAULT_AVATAR,
        });
    };

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

            {/* Hero Banner + Avatar */}
            <div className="relative mb-6">
                <div className="rounded-2xl h-36 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    <div className="absolute top-4 right-4">
                        <Button variant="secondary" onClick={() => isEditing ? handleCancel() : setIsEditing(true)} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30" icon={<Edit3 size={15} />}>
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>
                </div>
                <div className="absolute left-6 -bottom-10 flex items-end gap-4">
                    <div className="relative">
                        <img src={form.avatar} alt={form.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl" onError={e => { e.target.src = DEFAULT_AVATAR; }} />
                    </div>
                </div>
            </div>

            {/* Name & Role */}
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
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-border-soft)] flex items-center gap-2">
                            <User size={18} className="text-[var(--color-primary)]" />
                            <h2 className="font-bold text-[var(--color-text-main)]">Instructor Profile</h2>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <Field icon={User} label="Full Name" value={form.name} disabled={!isEditing} onChange={e => setForm({ ...form, name: e.target.value })} />
                                <Field icon={Mail} label="Email Address" value={form.email} disabled={!isEditing} onChange={e => setForm({ ...form, email: e.target.value })} />
                                <Field icon={Briefcase} label="Designation" value={form.role} disabled={!isEditing} onChange={e => setForm({ ...form, role: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Bio & Expertise</label>
                                <textarea
                                    className={`w-full rounded-xl px-4 py-3 border text-sm font-semibold text-[var(--color-text-main)] outline-none resize-none transition-colors ${!isEditing ? 'bg-[var(--color-surface-alt)] border-[var(--color-border)] text-[var(--color-text-muted)]' : 'bg-white border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20'}`}
                                    rows={3}
                                    value={form.bio}
                                    disabled={!isEditing}
                                    onChange={e => setForm({ ...form, bio: e.target.value })}
                                    placeholder="Tell students about your clinical or technical background..."
                                />
                            </div>
                            {isEditing && (
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                                    <Button variant="primary" type="submit" icon={<Save size={15} />}>Save Profile</Button>
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

                <div className="space-y-6">
                    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-border-soft)] flex items-center gap-2">
                            <Bell size={18} className="text-[var(--color-primary)]" />
                            <h2 className="font-bold text-[var(--color-text-main)]">Teacher Alerts</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { label: 'Student Submissions', key: 'assignments' },
                                { label: 'Daily Standups', key: 'standups' },
                                { label: 'Grading Reminders', key: 'reports' },
                            ].map(n => (
                                <div key={n.label} className="flex items-center justify-between gap-4">
                                    <Toggle checked={notifications[n.key]} onChange={() => toggleNotif(n.key)} label={n.label} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-border-soft)] flex items-center gap-2">
                            <ClipboardList size={18} className="text-[var(--color-primary)]" />
                            <h2 className="font-bold text-[var(--color-text-main)]">Recent Activity</h2>
                        </div>
                        <div className="p-6">
                            {recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-[var(--color-text-main)] leading-relaxed">{activity.message}</p>
                                                <p className="text-[10px] text-[var(--color-text-muted)] font-medium mt-0.5">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-[var(--color-text-muted)] text-center py-4">No recent activity</p>
                            )}
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
