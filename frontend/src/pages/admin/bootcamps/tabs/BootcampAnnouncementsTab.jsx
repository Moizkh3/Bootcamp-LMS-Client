import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Megaphone, Clock } from 'lucide-react';
import Button from '../../../../components/common/Button';
import AnnouncementModal from '../../../teacher/dashboard/AnnouncementModal';

import {
    useGetAnnouncementsQuery,
    useCreateAnnouncementMutation,
    useDeleteAnnouncementMutation
} from '../../../../features/announcement/announcementApi';
import toast from 'react-hot-toast';

export default function BootcampAnnouncementsTab({ bootcampId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const { data: announcementsResponse, isLoading, error } = useGetAnnouncementsQuery({ bootcampId });
    const [createAnnouncement] = useCreateAnnouncementMutation();
    const [deleteAnnouncement] = useDeleteAnnouncementMutation();

    const announcements = announcementsResponse?.data || [];

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await deleteAnnouncement(id).unwrap();
                toast.success('Announcement deleted');
            } catch (err) {
                toast.error(err.data?.message || 'Failed to delete');
            }
        }
    };

    const handlePost = async (formData) => {
        try {
            if (selectedAnnouncement) {
                // Update mutation to be added if needed, for now just create
                toast.error('Update not implemented yet');
            } else {
                await createAnnouncement({ ...formData, bootcampId }).unwrap();
                toast.success('Announcement posted');
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || 'Failed to post');
        }
    };

    const openCreateModal = () => {
        setSelectedAnnouncement(null);
        setIsModalOpen(true);
    };

    const openEditModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-[#0f172a]">Announcements</h3>
                    <p className="text-sm text-[#64748b]">Broadcast messages to all students and mentors in this bootcamp.</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={openCreateModal}>
                    New Announcement
                </Button>
            </div>

            <AnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPost={handlePost}
                announcement={selectedAnnouncement}
            />

            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 text-center shadow-sm">Loading announcements...</div>
                ) : error ? (
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 text-center shadow-sm text-red-500">Error loading announcements</div>
                ) : announcements.length > 0 ? (
                    announcements.map((announcement) => (
                        <div key={announcement._id} className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm hover:border-[#cbd5e1] transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                                        <Megaphone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0f172a]">{announcement.title}</h4>
                                        <div className="flex items-center gap-1.5 text-xs text-[#64748b] mt-0.5">
                                            <Clock size={12} />
                                            <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(announcement)}
                                        className="p-1.5 text-[#94a3b8] hover:text-[#1111d4] hover:bg-[#1111d4]/5 rounded transition-all"
                                        title="Edit Announcement"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(announcement._id)}
                                        className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded transition-all"
                                        title="Delete Announcement"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-[#475569] leading-relaxed ml-12">
                                {announcement.description}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 text-center shadow-sm">
                        <Megaphone size={48} className="text-[#cbd5e1] mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-[#0f172a] mb-2">No Announcements</h4>
                        <p className="text-sm text-[#64748b]">There are currently no announcements for this bootcamp.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
