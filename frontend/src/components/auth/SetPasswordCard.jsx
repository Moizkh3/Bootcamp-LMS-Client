import React, { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import AuthInput from './AuthInput';
import OTPInput from '../common/OTPInput';
import PasswordChecklist from '../common/PasswordChecklist';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOtpMutation } from '../../features/auth/authServiceApi';
import Button from '../common/Button';

const SetPasswordCard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const userEmail = location.state?.email;

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match!");
      return;
    }

    console.log(userEmail, otp, newPassword);
    console.log(typeof otp);

    try {
      await verifyOtp({
        email: userEmail,
        otp: otp.toString(),
        newPassword: newPassword
      }).unwrap();

      console.log("Password Updated Successfully!");
      navigate('/login');
    } catch (err) {
      console.error(err?.data?.message || "Verification Failed");
    }
  };

  return (
    <div className="relative z-10 w-full max-w-[440px] p-6 sm:p-8 md:p-12 bg-white/70 backdrop-blur-xl rounded-[30px] md:rounded-[40px] shadow-2xl border border-white/50 mx-auto">

      <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center mb-6 border border-gray-100">
        <ShieldCheck className="text-[var(--color-primary)] w-6 h-6 md:w-8 md:h-8" />
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Set New Password</h1>
        <p className="text-gray-500 text-xs md:text-sm mt-2 leading-relaxed">
          Resetting password for: <b>{userEmail}</b>
        </p>
      </div>

      <form onSubmit={handleUpdatePassword} className="w-full text-left">
        <div className="mb-4">
          <label className="text-[10px] md:text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest ml-1 mb-3 block">
            Verification Code
          </label>
          <OTPInput onChange={(val) => setOtp(val)} />
        </div>

        <div className="space-y-4 md:space-y-6">
          <AuthInput
            label="New Password"
            icon={Lock}
            type="password"
            placeholder="New Password"
            hasViewIcon={true}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordChecklist />

          <AuthInput
            label="Confirm Password"
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            hasViewIcon={true}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="solid"
          isLoading={isLoading}
          className="w-full mt-8 py-3.5 md:py-4"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
};

export default SetPasswordCard;
