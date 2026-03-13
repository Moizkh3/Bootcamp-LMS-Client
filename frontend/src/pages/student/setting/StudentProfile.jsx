import { useState, useRef } from "react";
import { UserIcon, CameraIcon, CheckIcon, ClipboardList, BellIcon, LogOut, Lock } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from "../../../features/auth/authSelectors";
import { logout } from '../../../features/auth/authSlice';
import { useLazyLogoutUserQuery } from '../../../features/auth/authServiceApi';
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { useGetStudentStatsQuery } from "../../../features/student/studentApi";
import { useUpdateProfileMutation } from "../../../features/user/userApi";
import { useGetNotificationsQuery } from "../../../features/notifications/notificationApi";
import { toast } from "react-hot-toast";

export default function StudentProfile() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [triggerLogout] = useLazyLogoutUserQuery();

  const { data: studentStats } = useGetStudentStatsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { data: notificationData } = useGetNotificationsQuery();

  const stats = [
    { label: "Avg. Grade", value: studentStats?.averageGrade ? `${studentStats.averageGrade}%` : "N/A", icon: UserIcon, color: "var(--color-primary)" },
    { label: "Attendance", value: studentStats?.attendance ? `${studentStats.attendance}%` : "N/A", icon: ClipboardList, color: "var(--color-success)" },
    { label: "Assignments", value: studentStats?.assignmentsCompleted || "0", icon: CheckIcon, color: "var(--color-warning)" },
  ];

  const recentActivity = notificationData?.data?.slice(0, 5).map(n => {
    const dateObj = new Date(n.createdAt || n.time);
    return {
      message: n.message,
      time: isNaN(dateObj.getTime()) ? 'Just now' : dateObj.toLocaleDateString(),
    };
  }) || [];

  const [profile, setProfile] = useState({
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ').slice(1).join(' ') || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    avatar: user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`,
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
      }).unwrap();
      setSaved(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
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
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">My Profile</h1>
        <p className="text-[var(--color-text-muted)] font-medium text-sm mt-1">Manage your professional identity and track your bootcamp progress.</p>
      </div>

      {saved && (
        <div className="fixed top-8 right-8 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-main)] text-sm font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-lg flex items-center justify-center">
            <CheckIcon size={18} />
          </div>
          Changes saved successfully
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
              <div className="relative group shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[var(--color-background)] shadow-xl bg-[var(--color-background)]">
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border-soft)]">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-muted)] mb-2">{stat.label}</p>
                    <div className="flex items-center gap-2">
                       <stat.icon size={14} style={{ color: stat.color }} />
                       <p className="text-lg font-black text-[var(--color-text-main)] leading-none">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-8 flex items-center gap-2">
              <UserIcon size={20} className="text-[var(--color-primary)]" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3">First Name</label>
                <Input value={profile.firstName} onChange={(e) => setProfile(p => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3">Last Name</label>
                <Input value={profile.lastName} onChange={(e) => setProfile(p => ({ ...p, lastName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3">Email Address</label>
                <Input value={profile.email} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3">Phone Number</label>
                <Input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-[var(--color-text-main)] mb-3">Bio</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none text-[var(--color-text-main)]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-10 pt-8 border-t border-[var(--color-border)]">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
              <Button onClick={handleSave} variant="solid" className="px-8 py-3" isLoading={isUpdating}>
                Save Profile Changes
              </Button>
            </div>
          </div>
          
          {/* Security Settings */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-8 flex items-center gap-2">
              <Lock size={20} className="text-[var(--color-primary)]" />
              Security Settings
            </h2>
            <div className="flex items-center justify-between bg-[var(--color-background)] p-4 sm:p-6 rounded-xl border border-[var(--color-border-soft)]">
              <div>
                <p className="text-sm font-bold text-[var(--color-text-main)]">Account Password</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium italic">Ensure your account stays protected with a strong password.</p>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/change-password')}
                className="font-bold border-[var(--color-primary)] text-[var(--color-primary)]"
              >
                Change Password
              </Button>
            </div>
          </div>
          
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
            <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
              <ClipboardList size={16} className="text-[var(--color-primary)]" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] shrink-0 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                      <BellIcon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--color-text-main)] leading-snug">{activity.message}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-medium mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--color-text-muted)] text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}