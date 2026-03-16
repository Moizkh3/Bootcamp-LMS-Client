import {
    Plus,
    Edit3,
    Trash2,
    ChevronRight, Search, Filter, ChevronLeft, Download
} from 'lucide-react';
import EditBootcampModal from './EditBootcampModal';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    useGetAllBootcampsQuery,
    useDeleteBootcampMutation
} from '../../../features/bootcamp/bootcampApi';
import { toast } from 'react-hot-toast';
import LoadingScreen from '../../../components/common/LoadingScreen';



export default function BootcampList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');

    const { data: bootcampResponse, isLoading, error } = useGetAllBootcampsQuery({
        search: searchQuery,
        status: statusFilter === 'All Status' ? undefined : statusFilter.toLowerCase()
    });

    const [deleteBootcamp] = useDeleteBootcampMutation();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBootcamp, setSelectedBootcamp] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const bootcampsList = bootcampResponse?.data || [];

    const handleEdit = (bootcamp) => {
        setSelectedBootcamp(bootcamp);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (updatedData) => {
        // Redux handles state update automatically via invalidation
        setIsEditModalOpen(false);
    };

    const handleDeleteClick = (bootcamp) => {
        setSelectedBootcamp(bootcamp);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedBootcamp?._id) return;
        setIsDeleting(true);
        try {
            await deleteBootcamp(selectedBootcamp._id).unwrap();
            toast.success('Bootcamp deleted successfully');
            setIsDeleteModalOpen(false);
            setSelectedBootcamp(null);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete bootcamp');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) return <LoadingScreen variant="contained" text="Loading bootcamps..." />;
    if (error) return <div className="text-red-500 text-center py-10">Error loading bootcamps: {error?.data?.message || error.message}</div>;

    return (
        <div className="flex flex-col">
            <Breadcrumbs />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">
                        Bootcamps
                    </h1>
                    <p className="text-[var(--color-text-muted)] text-sm md:text-base">
                        Manage and monitor all active training programs.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        icon={<Plus size={18} />}
                        onClick={() => navigate('/bootcamps/create')}
                    >
                        Create Bootcamp
                    </Button>
                </div>
            </div>

            {/* Filters Area */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input
                    className="flex-1 max-w-md"
                    icon={<Search size={20} />}
                    placeholder="Search bootcamps by name, cohort, or teacher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Select
                    className="w-44"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                        "All Status",
                        "Active",
                        "Completed",
                        "Scheduled"
                    ]}
                />

            </div>

            {/* Table Area */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Bootcamp Name</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Start Date</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">End Date</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9] text-center">Domains</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9] text-center">Students</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">Status</th>
                                <th className="px-6 py-4 text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                            {bootcampsList.map((row) => (
                                <tr
                                    key={row._id}
                                    className="hover:bg-[#f8fafc] transition-colors group cursor-pointer"
                                    onClick={() => navigate(`/bootcamps/${row._id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 flex items-center justify-center rounded-lg font-bold text-xs shrink-0"
                                                style={{ backgroundColor: `${row.color || '#1111d4'}15`, color: row.color || '#1111d4' }}
                                            >
                                                {row.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0f172a] hover:text-[#1111d4] transition-colors">{row.name}</p>
                                                <p className="text-[0.7rem] text-[#64748b]">ID: {row._id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#475569]">{new Date(row.startDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-[#475569]">{new Date(row.endDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-[#0f172a] font-semibold text-center">{row.domainCount || 0}</td>
                                    <td className="px-6 py-4 text-sm text-[#0f172a] font-semibold text-center">{row.studentCount || 0}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[0.7rem] font-bold border ${row.status === 'active'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : row.status === 'completed'
                                                    ? 'bg-slate-50 text-slate-600 border-slate-200'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}
                                        >
                                            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(row);
                                                }}
                                                className="p-1.5 text-[#94a3b8] hover:text-[#1111d4] hover:bg-[#1111d4]/5 rounded transition-all"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(row);
                                                }}
                                                className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-[#f1f5f9]">
                    <p className="text-sm text-[#64748b]">
                        Showing <span className="font-bold text-[#0f172a]">{bootcampsList.length > 0 ? `1 to ${bootcampsList.length}` : '0'}</span> of <span className="font-bold text-[#0f172a]">{bootcampsList.length}</span> bootcamps
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-[#94a3b8] hover:text-[#1111d4] disabled:opacity-50" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 rounded-lg bg-[#1111d4] text-white text-sm font-bold">1</button>
                            <button className="w-8 h-8 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] text-sm font-medium">2</button>
                            <button className="w-8 h-8 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] text-sm font-medium">3</button>
                        </div>
                        <button className="p-2 text-[#64748b] hover:text-[#1111d4]">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 text-center">
                <p className="text-[0.75rem] text-[#94a3b8]">
                    © 2024 Bootcamp Management System. All rights reserved.
                </p>
            </footer>

            {/* Edit Modal */}
            <EditBootcampModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdate}
                bootcamp={selectedBootcamp}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedBootcamp?.name}
                isDeleting={isDeleting}
                message="Are you sure you want to delete this bootcamp? All associated student records and domain assignments will be permanently removed."
            />
        </div>
    );
}
