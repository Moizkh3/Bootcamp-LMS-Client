import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { KeyRound, RefreshCcw } from 'lucide-react';
import { useUpdateUserMutation } from '../../features/user/userApi';
import toast from 'react-hot-toast';

const ResetPasswordModal = ({ isOpen, onClose, user }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const generateSecurePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(password);
        setConfirmPassword(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            await updateUser({ id: user._id, password: newPassword }).unwrap();
            toast.success(`Password reset successfully for ${user.name}`);
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to reset password');
        }
    };

    const handleClose = () => {
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Reset Password"
            icon={<KeyRound size={20} />}
            size="sm"
        >
            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <div className="p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)] font-medium">
                        Resetting password for: <span className="font-bold text-[var(--color-text-main)]">{user?.name}</span>
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{user?.email}</p>
                </div>

                <div className="space-y-4">
                    <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />

                    <button
                        type="button"
                        onClick={generateSecurePassword}
                        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                    >
                        <RefreshCcw size={13} />
                        Generate Secure Password
                    </button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                    <Button variant="secondary" onClick={handleClose} className="flex-1" disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ResetPasswordModal;
