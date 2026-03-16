import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from '../../features/user/userApi';
import { loginSuccess, logout } from '../../features/auth/authSlice';
import { selectCurrentUser } from '../../features/auth/authSelectors';
import ForcePasswordModal from './ForcePasswordModal';
import { useEffect } from 'react';
import LoadingScreen from '../common/LoadingScreen';


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

    // Wait if loading OR if we have data but state haven't updated yet
    const isReady = !isLoading && (!profileResponse?.success || (profileResponse?.success && userFromState));

    if (!isReady && !isError) {
        return <LoadingScreen />;
    }

    return (
        <>
            {user && isFirstLogin && <ForcePasswordModal />}
            {children}
        </>
    );
};

export default AuthWrapper;
