import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import AuthInput from './AuthInput';
import logo from "../../assets/Saylani.png"
import { useLoginMutation } from '../../features/auth/authServiceApi';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const LoginCard = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login({ email, password }).unwrap();
            console.log("Login Successfully: ", response);

            // The backend returns user data in response.data
            const user = response.data;

            dispatch(loginSuccess(user));
            toast.success(`Logged in as ${user.role}`);

            // Navigate based on role from the API
            if (user.role === 'admin') navigate('/');
            else if (user.role === 'teacher') navigate('/teacher');
            else if (user.role === 'student') navigate('/student');
            else navigate('/'); // Fallback

        } catch (err) {
            toast.error(err?.data?.message || err?.message || "Login failed");
            console.error("Login failed: ", err?.data?.message || err?.message);
        }
    }

    return (
        <div className="w-full max-w-[440px] p-6 sm:p-8 md:p-12 bg-white/70 backdrop-blur-xl rounded-[30px] md:rounded-[40px] shadow-2xl border border-white/50 text-center mx-auto">

            <div className="mb-6">
                <img className="mx-auto" width="120" src={logo} alt="Saylani Logo" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Sign in with email</h1>

            <form onSubmit={handleLogin} className="w-full text-left">
                <AuthInput
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <AuthInput
                    label="Password"
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    hasViewIcon={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="text-right mb-6 px-1">
                    <button
                        type='button'
                        onClick={() => navigate('/forgot-password')}
                        className="text-xs font-semibold text-[var(--color-primary)] hover:underline active:opacity-70 transition-opacity">
                        Forgot password?
                    </button>
                </div>

                <Button
                    type='submit'
                    variant="solid"
                    isLoading={isLoading}
                    className="w-full py-3.5 md:py-4 mt-2"
                >
                    Log In
                </Button>
            </form>
        </div>
    );
};

export default LoginCard;
