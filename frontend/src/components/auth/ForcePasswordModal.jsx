import React, { useState } from 'react';
import { useChangePasswordMutation, useGetProfileQuery } from '../../features/user/userApi';
import { toast } from 'react-hot-toast';
import { Loader2, KeyRound, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../common/Button';

const ForcePasswordModal = () => {
    const { refetch } = useGetProfileQuery();
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [requirements, setRequirements] = useState({
        length: false,
        uppercase: false,
        special: false,
        match: false
    });

    const validate = (name, value) => {
        const newFormData = { ...formData, [name]: value };
        setRequirements({
            length: newFormData.newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newFormData.newPassword),
            special: /[!@#$%^&*]/.test(newFormData.newPassword),
            match: newFormData.newPassword === newFormData.confirmPassword && newFormData.newPassword !== ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!requirements.length || !requirements.uppercase || !requirements.special) {
            return toast.error("Please meet all password requirements");
        }
        if (!requirements.match) {
            return toast.error("Passwords do not match");
        }

        try {
            await changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            }).unwrap();
            
            toast.success("Security status updated! Access granted.");
            setIsSuccess(true);
            await refetch();
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setRequirements({ length: false, uppercase: false, special: false, match: false });
        } catch (error) {
            toast.error(error?.data?.message || "Failed to change password");
        }
    };

    if (isSuccess) return null;

    const RequirementItem = ({ fulfilled, text }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors ${fulfilled ? 'text-green-600' : 'text-gray-400'}`}>
            {fulfilled ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            <span>{text}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                <div className="p-8 overflow-y-auto">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <KeyRound size={32} />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Mandatory Security Setup</h2>
                    <p className="text-slate-500 text-center mb-8 text-sm font-medium">
                        Welcome to the Bootcamp Tracker! To protect your account, please update your temporary password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Create New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                placeholder="Enter strong password"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                placeholder="Repeat new password"
                            />
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-5 space-y-2.5 border border-slate-100">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">Security Requirements</p>
                            <RequirementItem fulfilled={requirements.length} text="Minimum 8 characters length" />
                            <RequirementItem fulfilled={requirements.uppercase} text="At least one uppercase letter (A-Z)" />
                            <RequirementItem fulfilled={requirements.special} text="Symbol required (!@#$%^&*)" />
                            <RequirementItem fulfilled={requirements.match} text="Passwords match exactly" />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            className="w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
                        >
                            Activate Account
                        </Button>
                    </form>
                </div>
                
                <div className="bg-indigo-50/50 p-5 border-t border-indigo-100/50 flex items-start gap-4">
                    <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                        <ShieldAlert size={18} />
                    </div>
                    <p className="text-[0.7rem] text-indigo-900/70 leading-relaxed font-semibold">
                        Access to student records, assignments, and dashboard features is restricted until this one-time setup is complete.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForcePasswordModal;
