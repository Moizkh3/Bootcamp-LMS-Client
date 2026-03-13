import { Download, Plus, Search } from 'lucide-react';
import DomainItemCard from './DomainItemCard';
import AddDomainForm from './AddDomainForm';
import AddDomainModal from './AddDomainModal';
import QuickAddModal from './QuickAddModal';
import EditDomainModal from './EditDomainModal';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Select from '../../../components/common/Select';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import DomainStudentsPanel from './DomainStudentsPanel';
import {
    useGetAllDomainsQuery,
    useAddDomainMutation,
    useEditDomainMutation,
    useDeleteDomainMutation
} from '../../../features/domain/domainApi';
import { useGetAllBootcampsQuery } from '../../../features/bootcamp/bootcampApi';
import { toast } from 'react-hot-toast';
import { useState } from 'react';


const DomainManagement = () => {
    const { data: domainsResponse, isLoading, error } = useGetAllDomainsQuery();
    const [addDomain] = useAddDomainMutation();
    const [editDomain] = useEditDomainMutation();
    const [deleteDomain] = useDeleteDomainMutation();
    const { data: bootcampsResponse } = useGetAllBootcampsQuery();
    const bootcamps = bootcampsResponse?.data || [];

    // Note: Delete is not yet implemented in the backend/API slice, I will add it or mock it for now.
    // For now, I'll just mock the delete success on the UI side as it was before, or add it to API.

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [bootcampContext, setBootcampContext] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // State for the slide-over panel
    const [selectedDomainForStudents, setSelectedDomainForStudents] = useState(null);
    const [isStudentsPanelOpen, setIsStudentsPanelOpen] = useState(false);

    const domainsList = domainsResponse?.data || [];

    const filteredDomains = domainsList.filter(domain => {
        // Bootcamp Context Filter - handle both ID (new) and Name (legacy string)
        const matchesContext = bootcampContext === 'All' ||
            domain.bootcamp === bootcampContext ||
            (domain.bootcamp?._id === bootcampContext);

        // Search Filter
        const matchesSearch = domain.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            domain.mentorName?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesContext && matchesSearch;
    });

    const handleEdit = (domain) => {
        setSelectedDomain(domain);
        setIsEditModalOpen(true);
    };

    const handleAddDomain = async (newDomain) => {
        try {
            await addDomain(newDomain).unwrap();
            toast.success('Domain created successfully');
            setIsAddModalOpen(false);
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to create domain');
        }
    };

    const handleUpdate = async (updatedDomain) => {
        try {
            await editDomain({ id: updatedDomain._id, ...updatedDomain }).unwrap();
            toast.success('Domain updated successfully');
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update domain');
        }
    };

    const handleDeleteClick = (domain) => {
        setSelectedDomain(domain);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedDomain?._id) return;
        setIsDeleting(true);
        try {
            let res = await deleteDomain(selectedDomain._id).unwrap();
            console.log(res);
            toast.success('Domain deleted successfully');
            setIsDeleteModalOpen(false);
            setSelectedDomain(null);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete domain');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDomainCardClick = (domain) => {
        setSelectedDomainForStudents(domain);
        setIsStudentsPanelOpen(true);
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]">Loading domains...</div>;
    if (error) return <div className="text-red-500 text-center py-10">Error loading domains: {error?.data?.message || error.message}</div>;

    return (
        <div className="max-w-[1280px] mx-auto">
            <Breadcrumbs />
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-8">
                    {/* Header Area */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">Domain Management</h1>
                            <p className="text-[var(--color-text-muted)] mt-1">Configure and assign mentors to educational domains.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="primary"
                                icon={<Plus size={18} />}
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                New Domain
                            </Button>
                            <Button
                                variant="secondary"
                                icon={<Download size={16} />}
                            >
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Filters Area */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <Input
                            className="flex-1 max-w-md"
                            placeholder="Search domains or mentors..."
                            icon={<Search size={20} />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Select
                            className="w-56"
                            placeholder="Bootcamp Context"
                            value={bootcampContext}
                            onChange={(e) => setBootcampContext(e.target.value)}
                            options={[
                                { label: 'All Bootcamps', value: 'All' },
                                ...bootcamps.map(b => ({ label: b.name, value: b._id }))
                            ]}
                        />
                    </div>

                    {/* Grid of Domain Cards */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {filteredDomains.map((domain) => (
                            <div 
                                key={domain._id} 
                                onClick={() => handleDomainCardClick(domain)}
                                className="cursor-pointer"
                            >
                                <DomainItemCard
                                    {...domain}
                                    onEdit={(e) => { e.stopPropagation(); handleEdit(domain); }}
                                    onDelete={(e) => { e.stopPropagation(); handleDeleteClick(domain); }}
                                />
                            </div>
                        ))}

                        {/* Quick Add Domain Placeholder */}
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-xl flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:bg-slate-100/50 hover:border-[#1111d4]/30 transition-all min-h-[220px]"
                        >
                            <div className="size-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#1111d4] transition-colors">
                                <Plus size={28} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 group-hover:text-slate-700">Quick Add Domain</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddDomainModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddDomain}
            />

            {/* Quick Add Modal */}
            <QuickAddModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddDomain}
            />

            {/* Edit Modal */}
            <EditDomainModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdate}
                domainData={selectedDomain}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedDomain?.name}
                isDeleting={isDeleting}
                message="Are you sure you want to delete this domain? Mentors assigned to this track will be unlinked, and student distribution settings for this domain will be reset."
            />

            {/* Students Slide-over Panel */}
            <DomainStudentsPanel 
                isOpen={isStudentsPanelOpen}
                onClose={() => setIsStudentsPanelOpen(false)}
                domain={selectedDomainForStudents}
            />
        </div>
    );
};

export default DomainManagement;
