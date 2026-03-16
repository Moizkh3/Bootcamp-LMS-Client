import React, { useState } from 'react';
import { Plus, Megaphone, Clock, Trash2, Filter, Search } from 'lucide-react';
import Button from '../../../components/common/Button';
import AnnouncementModal from '../../teacher/dashboard/AnnouncementModal';
import { 
    useGetAnnouncementsQuery, 
    useCreateAnnouncementMutation, 
    useDeleteAnnouncementMutation 
} from '../../../features/announcement/announcementApi';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import LoadingScreen from '../../../components/common/LoadingScreen';

export default function Announcements() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [bootcampFilter, setBootcampFilter] = useState('all');
    
    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: announcementsResponse, isLoading } = useGetAnnouncementsQuery({});
    const { data: bootcampsData } = useGetAllBootcampsQuery();
    const { data: domainsData } = useGetAllDomainsQuery();
    
    const [createAnnouncement] = useCreateAnnouncementMutation();
    const [deleteAnnouncement] = useDeleteAnnouncementMutation();

    const announcements = announcementsResponse?.data || [];
    const bootcamps = bootcampsData?.data || [];
    const domains = domainsData?.data || [];

    const handlePost = async (formData) => {
        try {
            // If targetGroup is 'all', it means no specific domainId
            const submissionData = {
                title: formData.title,
                description: formData.description,
                bootcampId: formData.bootcampId === 'all' ? undefined : formData.bootcampId,
                domainId: formData.targetGroup === 'all' ? undefined : formData.targetGroup
            };

            await createAnnouncement(submissionData).unwrap();
            toast.success('Announcement posted successfully');
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || 'Failed to post announcement');
        }
    };

    const triggerDelete = (id) => {
        setAnnouncementToDelete(id);
        setIsDeleteModalOpen(true);
    };
    
    const confirmDelete = async () => {
        if (!announcementToDelete) return;
        
        setIsDeleting(true);
        try {
            await deleteAnnouncement(announcementToDelete).unwrap();
            toast.success('Announcement deleted');
            setIsDeleteModalOpen(false);
            setAnnouncementToDelete(null);
        } catch (err) {
            toast.error(err.data?.message || 'Failed to delete');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredAnnouncements = announcements.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            a.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBootcamp = bootcampFilter === 'all' || a.bootcampId === bootcampFilter;
        return matchesSearch && matchesBootcamp;
    });

    return (
        <div className="max-w-[1440px] mx-auto pb-10">
            <Breadcrumbs />
            
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Announcements Management</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Create and target messages for specific bootcamps, domains, or all users.
                    </p>
                </div>
                <Button 
                    variant="solid" 
                    icon={<Plus size={18} />} 
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Announcement
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-medium appearance-none"
                        value={bootcampFilter}
                        onChange={(e) => setBootcampFilter(e.target.value)}
                    >
                        <option value="all">All Bootcamps</option>
                        {bootcamps.map(b => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <LoadingScreen variant="contained" text="Loading announcements..." />
                ) : filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map((a) => (
                        <div key={a._id} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm hover:border-[#cbd5e1] transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                        <Megaphone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0f172a]">{a.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-[#64748b] mt-1 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(a.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                a.creatorRole === 'admin'
                                                    ? 'bg-purple-50 text-purple-600'
                                                    : 'bg-blue-50 text-blue-600'
                                            }`}>
                                                {a.creatorRole === 'admin' ? '🛡️ Admin' : '🎓 Mentor'}
                                            </span>
                                            <span>— {a.creatorName || a.createdBy?.name || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => triggerDelete(a._id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            
                            <p className="text-[#475569] leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                                {a.description}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                    a.bootcampId ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                }`}>
                                    {a.bootcampId ? `Bootcamp: ${bootcamps.find(b => b._id === a.bootcampId)?.name || 'Unknown'}` : 'Global Announcement'}
                                </span>
                                {a.domainId && (
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                        Domain: {domains.find(d => d._id === a.domainId)?.name || 'Unknown'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 bg-white border border-dashed border-[#e2e8f0] rounded-2xl text-center">
                        <Megaphone size={48} className="mx-auto mb-4 opacity-20 text-[#64748b]" />
                        <h3 className="text-lg font-bold text-[#0f172a]">No announcements found</h3>
                        <p className="text-sm text-[#64748b] mt-1 font-medium">Get started by creating your first announcement.</p>
                    </div>
                )}
            </div>

            <AnnouncementModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPost={handlePost}
                isAdmin={true}
            />

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setAnnouncementToDelete(null);
                }}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
                title="Delete Announcement"
                message="Are you sure you want to delete this announcement? This action cannot be undone."
            />
        </div>
    );
}
