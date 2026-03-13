import React, { useState } from 'react';
import { useChangePasswordMutation, useGetProfileQuery } from '../../../features/user/userApi';
import { toast } from 'react-hot-toast';
import { KeyRound, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const { refetch } = useGetProfileQuery();
    const [changePassword, { isLoading }] = useChangePasswordMutation();
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
            
            toast.success("Password updated successfully!");
            await refetch();
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setRequirements({ length: false, uppercase: false, special: false, match: false });
            navigate('/');
        } catch (error) {
            toast.error(error?.data?.message || "Failed to change password");
        }
    };

    const RequirementItem = ({ fulfilled, text }) => (
        <div className={`flex items-center gap-2 text-sm transition-colors ${fulfilled ? 'text-green-600' : 'text-gray-400'}`}>
            {fulfilled ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{text}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <KeyRound size={32} />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Security Update</h2>
                    <p className="text-gray-500 text-center mb-8 text-sm">
                        For your protection, please update your temporary password to a strong, personal one.
                    </p>

                    <form onSubmit={handleSubmit} className="p-1 space-y-6">
                        <Input
                            label="Current Password"
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter current password"
                        />

                        <Input
                            label="New Password"
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter new password"
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Repeat new password"
                        />

                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-tight mb-2">Password Requirements</p>
                            <RequirementItem fulfilled={requirements.length} text="At least 8 characters" />
                            <RequirementItem fulfilled={requirements.uppercase} text="At least one uppercase letter" />
                            <RequirementItem fulfilled={requirements.special} text="At least one special character (!@#$%^&*)" />
                            <RequirementItem fulfilled={requirements.match} text="Passwords must match" />
                        </div>

                        <Button
                            type="submit"
                            variant="solid"
                            isLoading={isLoading}
                            className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100"
                        >
                            Complete Setup
                        </Button>
                    </form>
                </div>
                
                <div className="bg-amber-50 p-4 border-t border-amber-100 flex items-start gap-3">
                    <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-amber-800 leading-relaxed">
                        Access to all other system features is restricted until this mandatory security setup is complete.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
