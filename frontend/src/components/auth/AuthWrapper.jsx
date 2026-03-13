import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from '../../features/user/userApi';
import { loginSuccess, logout } from '../../features/auth/authSlice';
import { selectCurrentUser } from '../../features/auth/authSelectors';
import ForcePasswordModal from './ForcePasswordModal';
import { useEffect } from 'react';


const AuthWrapper = ({ children }) => {
    const dispatch = useDispatch();
    const { data: profileResponse, isLoading, isError } = useGetProfileQuery();

    useEffect(() => {
        if (profileResponse?.success && profileResponse?.data) {
            dispatch(loginSuccess(profileResponse.data));
        } else if (isError) {
            // Only logout if it's a 401/403 or specific auth error
            // dispatch(logout()); 
        }
    }, [profileResponse, isError, dispatch]);

    const userFromState = useSelector(selectCurrentUser);
    const user = userFromState || profileResponse?.data;
    const isFirstLogin = user?.isFirstLogin;

    if (isLoading && !userFromState) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3636e2] border-t-transparent shadow-md"></div>
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Initializing Session...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {user && isFirstLogin && <ForcePasswordModal />}
            {children}
        </>
    );
};

export default AuthWrapper;
