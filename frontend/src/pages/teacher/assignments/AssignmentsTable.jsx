import React from 'react';
import { Calendar, MoreVertical, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

const AssignmentsTable = ({ assignments, onViewDetails, onEdit, onDelete }) => {
    const [openMenuId, setOpenMenuId] = React.useState(null);
    const [menuPosition, setMenuPosition] = React.useState({ top: 0, right: 0 });
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 7;
    const totalPages = Math.max(1, Math.ceil(assignments.length / itemsPerPage));

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = React.useState(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Close menu on scroll
    React.useEffect(() => {
        const handleScroll = () => setOpenMenuId(null);
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    const handleMenuToggle = (e, itemId) => {
        e.stopPropagation();
        if (openMenuId === itemId) {
            setOpenMenuId(null);
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right
        });
        setOpenMenuId(itemId);
    };

    const paginatedAssignments = assignments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDeleteClick = (assignment) => {
        setAssignmentToDelete(assignment);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(assignmentToDelete._id);
            setIsDeleteModalOpen(false);
            setAssignmentToDelete(null);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm min-h-[400px]">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                            <th className="px-4 py-4 w-12 text-center">#</th>
                            <th className="px-6 py-4">Assignment Title</th>
                            <th className="px-6 py-4">Domain</th>
                            <th className="px-6 py-4">Deadline Date</th>
                            <th className="px-6 py-4">Submissions</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {paginatedAssignments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-20 text-center">
                                    <p className="text-[var(--color-text-muted)] font-medium italic text-sm">No assignments found matching filters.</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedAssignments.map((item, index) => {
                                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                                return (
                                    <tr
                                        key={item._id || globalIndex}
                                        onClick={() => onViewDetails(item)}
                                        className="hover:bg-[var(--color-primary)]/5 transition-all duration-300 group cursor-pointer"
                                    >
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-xs font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                                                {String(globalIndex + 1).padStart(2, '0')}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 min-w-[240px]">
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors mb-0.5 truncate max-w-[200px]" title={item.title}>
                                                    {item.title}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/5 px-1.5 py-0.5 rounded">
                                                        {item.module || 'N/A'}
                                                    </span>
                                                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest truncate max-w-[120px]">
                                                        {item.description || 'No Description'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${(item.domain?.name || item.domain) === 'Frontend' ? 'bg-[var(--color-info-bg)] text-[var(--color-info)]' :
                                                (item.domain?.name || item.domain) === 'Backend' ? 'bg-indigo-50 text-indigo-600' :
                                                    (item.domain?.name || item.domain) === 'Database' ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]' :
                                                        'bg-purple-50 text-purple-600'
                                                }`}>
                                                {item.domain?.name || (item.domain ? 'Deleted Domain' : 'General')}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 min-w-[140px] whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`p-1.5 rounded-lg border ${item.isOverdue ? 'bg-[var(--color-danger-bg)] border-[var(--color-danger)]/20 text-[var(--color-danger)]' : 'bg-[var(--color-surface-alt)] border-[var(--color-border)] text-[var(--color-text-muted)]'}`}>
                                                    <Calendar size={14} />
                                                </div>
                                                <div>
                                                    <p className={`text-[12px] font-semibold ${item.isOverdue ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-main)]'}`}>
                                                        {new Date(item.deadline).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 min-w-[160px]">
                                            <div className="space-y-2">
                                                <div className="flex items-end justify-between">
                                                    <p className="text-xs font-semibold text-[var(--color-primary)]">
                                                        {item.submissionsCount || 0}/{item.totalStudentsCount || 0}
                                                    </p>
                                                    <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
                                                        {item.totalStudentsCount ? Math.round(((item.submissionsCount || 0) / item.totalStudentsCount) * 100) : 0}%
                                                    </p>
                                                </div>
                                                <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${item.status === 'Closed' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-primary)] shadow-[0_0_8px_rgba(37,99,235,0.3)]'
                                                            }`}
                                                        style={{ width: `${item.totalStudentsCount ? ((item.submissionsCount || 0) / item.totalStudentsCount) * 100 : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${(item.status === 'Active' || item.status === 'published') ? 'bg-[var(--color-success-bg)] border-[var(--color-success)]/20 text-[var(--color-success)]' : 'bg-[var(--color-danger-bg)] border-[var(--color-danger)]/20 text-[var(--color-danger)]'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${(item.status === 'Active' || item.status === 'published') ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-danger)]'}`} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{item.status}</span>
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={(e) => handleMenuToggle(e, item._id)}
                                                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-lg transition-all"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-[var(--color-surface-alt)] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-border)]">
                <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
                    Showing {paginatedAssignments.length} of {assignments.length} Assignments
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all border ${page === currentPage ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={assignmentToDelete?.title}
                isDeleting={isDeleting}
                message="Are you sure you want to delete this assignment? It will be removed for all students in the assigned cohort."
            />

            {/* Fixed-position action dropdown — escapes overflow clipping */}
            {openMenuId && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenuId(null)}
                    />
                    {/* Menu */}
                    <div
                        className="fixed z-50 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200"
                        style={{ top: menuPosition.top, right: menuPosition.right }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                const item = paginatedAssignments.find(a => a._id === openMenuId);
                                setOpenMenuId(null);
                                if (item) onViewDetails(item);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] transition-all flex items-center gap-3"
                        >
                            View Details
                        </button>
                        <button
                            onClick={() => {
                                const item = paginatedAssignments.find(a => a._id === openMenuId);
                                setOpenMenuId(null);
                                if (item) onEdit(item);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] transition-all flex items-center gap-3"
                        >
                            Edit Task
                        </button>
                        <div className="h-px bg-[var(--color-border)] mx-1" />
                        <button
                            onClick={() => {
                                const item = paginatedAssignments.find(a => a._id === openMenuId);
                                setOpenMenuId(null);
                                if (item) handleDeleteClick(item);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-all flex items-center gap-3"
                        >
                            Delete Task
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AssignmentsTable;
