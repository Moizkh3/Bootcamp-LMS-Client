import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * DeleteConfirmationModal Component
 * 
 * Props:
 * - isOpen {boolean}: Controls visibility
 * - onClose {function}: Callback when modal should close
 * - onConfirm {function}: Callback when user confirms deletion
 * - title {string}: Title of the modal
 * - message {string}: Detailed warning message
 * - itemName {string}: Name of the item being deleted (optional)
 * - isDeleting {boolean}: Loading state for the confirm button
 */
const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item? This action is permanent and cannot be undone.",
    itemName,
    isDeleting = false
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={<AlertTriangle size={22} className="text-red-500" />}
            size="sm"
        >
            <div className="p-6">
                <div className="space-y-4">
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                        {message}
                        {itemName && (
                            <span className="block mt-2 font-bold text-[var(--color-text-main)] italic">
                                "{itemName}"
                            </span>
                        )}
                    </p>
                    <div className="flex gap-3 w-full mt-2">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 flex-grow"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            isLoading={isDeleting}
                            className="flex-1 flex-grow"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;
