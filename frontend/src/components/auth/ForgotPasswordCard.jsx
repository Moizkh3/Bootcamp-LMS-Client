import React, { useState } from 'react';
import { Mail, ChevronLeft, KeyRound } from 'lucide-react';
import AuthInput from './AuthInput';
import { useForgotPasswordMutation, useVerifyOtpMutation } from '../../features/auth/authServiceApi';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const ForgotPasswordCard = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await forgotPassword(email).unwrap();
      console.log(res);
      navigate('/set-password', { state: { email } });
    } catch (err) {
      console.error(err?.data?.message || "Failed to send email");
    }
  };

  return (
    <div className="relative z-10 w-full max-w-[440px] p-6 sm:p-8 md:p-12 bg-white/70 backdrop-blur-xl rounded-[30px] md:rounded-[40px] shadow-2xl border border-white/50 text-center mx-auto">

      <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl shadow-inner flex items-center justify-center mb-6 md:mb-8 border border-gray-100 group">
        <KeyRound className="text-[var(--color-primary)] w-8 h-8 md:w-10 md:h-10 group-hover:rotate-12 transition-transform duration-300" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 tracking-tight">Forgot password?</h1>
      <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed px-2 md:px-4">
        No worries, we'll send you reset instructions. Please enter the email address linked to your account.
      </p>

      <form onSubmit={handleForgotSubmit} className="text-left">
        <AuthInput
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="forgot@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          variant="solid"
          isLoading={isLoading}
          className="w-full py-3.5 md:py-4 mt-4"
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 md:mt-8">
        <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 hover:text-[var(--color-primary)] transition-colors group p-2">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordCard;
