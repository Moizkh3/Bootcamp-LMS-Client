import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole, selectCurrentUser } from '../features/auth/authSelectors';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/admin/dashboard/Dashboard';
import Analytics from '../pages/admin/analytics/Analytics';
import DomainManagement from '../pages/admin/domain/DomainManagement';
import StudentDirectory from '../pages/admin/students/StudentDirectory';
import TeacherDirectory from '../pages/admin/teachers/TeacherDirectory';
import BootcampList from '../pages/admin/bootcamps/BootcampList';
import CreateBootcamp from '../pages/admin/bootcamps/CreateBootcamp';
import BootcampOverview from '../pages/admin/bootcamps/BootcampOverview';
import AdminProfile from '../pages/admin/profile/AdminProfile';
import AdminStandups from '../pages/admin/standups/AdminStandups';
import Announcements from '../pages/admin/announcements/Announcements';
// Auth Pages
import TeacherLayout from '../components/layout/TeacherLayout';
import TeacherDashboard from '../pages/teacher/dashboard/Dashboard';
import StandupsDashboard from '../pages/teacher/standups/StandupsDashboard';
import AssignmentsDashboard from '../pages/teacher/assignments/AssignmentsDashboard';
import GradingList from '../pages/teacher/grading/GradingList';
import GradingDashboard from '../pages/teacher/grading/GradingDashboard';
import SubmissionsDashboard from '../pages/teacher/submissions/SubmissionsDashboard';
import StudentProfile from '../pages/teacher/students/StudentProfile';
import TeacherStudentDirectory from '../pages/teacher/students/TeacherStudentDirectory';
import StudentProgressDetails from '../pages/teacher/students/StudentProgressDetails';
import TeacherProfile from '../pages/teacher/profile/TeacherProfile';

import StudentLayout from '../components/layout/StudentLayout';
import StudentDashboard from '../pages/student/dashboard/Dashboard';
import DailyProgress from '../pages/student/dailyProgress/DailyProgress';
import MyAssignments from '../pages/student/myAssignment/MyAssignments';
import FeedbackDetail from '../pages/student/feedbackDetail/Feedbackdetail.jsx';
import StudentPersonalProfile from '../pages/student/setting/StudentProfile.jsx';
import ProgressHistory from '../pages/student/progressHistory/ProgressHistory.jsx';
import SubmitAssignment from '../pages/student/submitAssignment/SubmitAssignment.jsx';

// Auth Pages
import LoginPage from '../pages/auth/Login';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import SetPasswordPage from '../pages/auth/SetPassword';
import ChangePasswordPage from '../pages/shared/profile/ChangePasswordPage';

const AppRoutes = () => {
    const user = useSelector(selectCurrentUser);
    const userRole = useSelector(selectUserRole);
    const isFirstLogin = user?.isFirstLogin;

    return (
        <Routes>
            {/* Auth Routes - only accessible if not logged in */}
            {!userRole ? (
                <>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/set-password" element={<SetPasswordPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            ) : (
                <>
                    {/* Common Authenticated Routes */}
                    <Route path="/change-password" element={<ChangePasswordPage />} />

                    {/* Admin Routes */}
                    {userRole === 'admin' && (
                        <Route element={<DashboardLayout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/domains" element={<DomainManagement />} />
                            <Route path="/teachers" element={<TeacherDirectory />} />
                            <Route path="/students" element={<StudentDirectory />} />
                            <Route path="/students/:id" element={<StudentProfile />} />
                            <Route path="/bootcamps" element={<BootcampList />} />
                            <Route path="/bootcamps/create" element={<CreateBootcamp />} />
                            <Route path="/bootcamps/:id" element={<BootcampOverview />} />
                            <Route path="/admin/standups" element={<AdminStandups />} />
                            <Route path="/admin/announcements" element={<Announcements />} />
                            <Route path="/profile" element={<AdminProfile />} />
                            {/* Fallback route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    )}

                    {/* Teacher Routes */}
                    {userRole === 'teacher' && (
                        <Route path="/teacher" element={<TeacherLayout />}>
                            <Route index element={<TeacherDashboard />} />
                            <Route path="standups" element={<StandupsDashboard />} />
                            <Route path="assignments" element={<AssignmentsDashboard />} />
                            <Route path="grading" element={<GradingList />} />
                            <Route path="grading/:id" element={<GradingDashboard />} />
                            <Route path="submissions" element={<SubmissionsDashboard />} />
                            <Route path="students" element={<TeacherStudentDirectory />} />
                            <Route path="students/:studentId" element={<StudentProgressDetails />} />
                            <Route path="profile" element={<TeacherProfile />} />
                            {/* Inner fallback within teacher path */}
                            <Route path="*" element={<Navigate to="/teacher" replace />} />
                        </Route>
                    )}

                    {/* Student Routes */}
                    {userRole === 'student' && (
                        <Route path="/student" element={<StudentLayout />}>
                            <Route index element={<StudentDashboard />} />
                            <Route path="progress" element={<DailyProgress />} />
                            <Route path="progress/history" element={<ProgressHistory />} />
                            <Route path="assignments" element={<MyAssignments />} />
                            <Route path="feedback" element={<FeedbackDetail />} />
                            <Route path="assignments/:id/feedback" element={<FeedbackDetail />} />
                            <Route path="assignments/:id/submit" element={<SubmitAssignment />} />
                            <Route path="profile" element={<StudentPersonalProfile />} />
                            {/* Inner fallback within student path */}
                            <Route path="*" element={<Navigate to="/student" replace />} />
                        </Route>
                    )}

                    {/* Global profile redirect */}
                    <Route path="/profile" element={
                        userRole === 'admin' ? <AdminProfile /> :
                        userRole === 'teacher' ? <Navigate to="/teacher/profile" replace /> :
                        userRole === 'student' ? <Navigate to="/student/profile" replace /> :
                        <Navigate to="/login" replace />
                    } />

                    {/* Global fallback for logged in users to their respective home */}
                    <Route path="/login" element={<Navigate to={userRole === 'admin' ? '/' : userRole === 'teacher' ? '/teacher' : '/student'} replace />} />
                    <Route path="*" element={<Navigate to={userRole === 'admin' ? '/' : userRole === 'teacher' ? '/teacher' : '/student'} replace />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;