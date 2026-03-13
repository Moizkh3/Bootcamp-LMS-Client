import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Edit3,
    Trash2,
    Calendar,
    Users,
    Layers,
    AlertTriangle,
    ShieldAlert
} from 'lucide-react';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import EditBootcampModal from './EditBootcampModal';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { useGetBootcampByIdQuery } from '../../../features/bootcamp/bootcampApi';

// Import Tab Components
import BootcampOverviewTab from './tabs/BootcampOverviewTab';
import BootcampMentorsTab from './tabs/BootcampMentorsTab';
import BootcampStudentsTab from './tabs/BootcampStudentsTab';
import BootcampDomainsTab from './tabs/BootcampDomainsTab';
import BootcampAssignmentsTab from './tabs/BootcampAssignmentsTab';
import BootcampAnnouncementsTab from './tabs/BootcampAnnouncementsTab';
import BootcampProgressTab from './tabs/BootcampProgressTab';

// Mock data removed

export default function BootcampOverview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: bootcampResponse, isLoading, error } = useGetBootcampByIdQuery(id);
    const bootcamp = bootcampResponse?.data;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Tab state
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'domains', label: 'Domains' },
        { id: 'mentors', label: 'Mentors' },
        { id: 'students', label: 'Students' },
        { id: 'assignments', label: 'Assignments' },
        { id: 'announcements', label: 'Announcements' },
        { id: 'progress', label: 'Progress' }
    ];

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]">Loading bootcamp details...</div>;

    if (!bootcamp) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertTriangle size={48} className="text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Bootcamp Not Found</h2>
                <p className="text-slate-500 mb-6">The bootcamp you are looking for does not exist or has been removed.</p>
                <Button variant="primary" onClick={() => navigate('/bootcamps')}>
                    Back to Bootcamps
                </Button>
            </div>
        );
    }

    const handleUpdate = (updatedData) => {
        setBootcamp({ ...bootcamp, ...updatedData });
    };

    const handleConfirmDelete = () => {
        setIsDeleting(true);
        // Simulate API call
        setTimeout(() => {
            setIsDeleteModalOpen(false);
            setIsDeleting(false);
            navigate('/bootcamps');
        }, 600);
    };

    return (
        <div className="flex flex-col">
            <Breadcrumbs />

            <div className="mb-6 flex items-center">
                <button
                    onClick={() => navigate('/bootcamps')}
                    className="flex items-center text-sm font-medium text-[#64748b] hover:text-[#1111d4] transition-colors"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Bootcamps
                </button>
            </div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div
                        className="w-14 h-14 flex items-center justify-center rounded-xl font-bold text-xl shrink-0"
                        style={{ backgroundColor: `${bootcamp.color}15`, color: bootcamp.color }}
                    >
                        {bootcamp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">
                            {bootcamp.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[var(--color-text-muted)] text-sm">
                                ID: {bootcamp._id}
                            </span>
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${bootcamp.status === 'Active'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : bootcamp.status === 'Completed'
                                        ? 'bg-slate-50 text-slate-600 border-slate-200'
                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}
                            >
                                {bootcamp.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        icon={<Edit3 size={18} />}
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Details
                    </Button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-2 h-11 px-4 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto no-scrollbar border-b border-[#e2e8f0] mb-8">
                <div className="flex gap-8 px-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-sm font-bold whitespace-nowrap transition-colors relative ${activeTab === tab.id
                                ? 'text-[#1111d4]'
                                : 'text-[#64748b] hover:text-[#0f172a]'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1111d4] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && <BootcampOverviewTab bootcamp={bootcamp} />}
                {activeTab === 'domains' && <BootcampDomainsTab bootcamp={bootcamp} />}
                {activeTab === 'mentors' && <BootcampMentorsTab bootcampId={bootcamp._id} />}
                {activeTab === 'students' && <BootcampStudentsTab bootcampId={bootcamp._id} />}
                {activeTab === 'assignments' && <BootcampAssignmentsTab bootcampId={bootcamp._id} />}
                {activeTab === 'announcements' && <BootcampAnnouncementsTab bootcampId={bootcamp._id} />}
                {activeTab === 'progress' && <BootcampProgressTab bootcampId={bootcamp._id} />}
            </div>

            {/* Edit Modal */}
            <EditBootcampModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdate}
                bootcamp={bootcamp}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={bootcamp?.name}
                isDeleting={isDeleting}
                message="Are you sure you want to delete this bootcamp? All associated student records and domain assignments will be permanently removed."
            />
        </div>
    );
}
