import React from 'react';
import { X, Users, Mail, User as UserIcon } from 'lucide-react';
import { useGetAllUsersQuery } from '../../../features/user/userApi';

const DomainStudentsPanel = ({ isOpen, onClose, domain }) => {
    // We only fetch when the panel is open and we have a domain
    const { data: usersResponse, isLoading } = useGetAllUsersQuery(
        { role: 'student', domainId: domain?._id },
        { skip: !isOpen || !domain?._id }
    );

    const students = usersResponse?.users || [];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Slide-over Panel */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{domain?.name}</h2>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                            <Users size={14} />
                            {students.length} Student{students.length !== 1 ? 's' : ''} Enrolled
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                            <div className="w-8 h-8 border-4 border-[#1111d4]/20 border-t-[#1111d4] rounded-full animate-spin" />
                            <p className="font-medium text-sm text-slate-500">Loading students...</p>
                        </div>
                    ) : students.length > 0 ? (
                        <div className="space-y-3">
                            {students.map(student => (
                                <div 
                                    key={student._id}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#1111d4]/30 hover:shadow-sm bg-white transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-[#1111d4]/10 text-[#1111d4] flex items-center justify-center font-bold text-lg shrink-0">
                                        {student.name ? student.name.charAt(0).toUpperCase() : <UserIcon size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h4 className="font-bold text-slate-800 truncate pr-2">{student.name}</h4>
                                            {student.studentStatus === 'enrolled' ? (
                                                <span className="shrink-0 px-2 py-0.5 bg-green-50 text-green-600 font-bold text-[10px] uppercase rounded-full">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-500 font-bold text-[10px] uppercase rounded-full">
                                                    {student.studentStatus || 'Inactive'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-xs font-medium text-slate-500">Roll: {student.rollNo}</p>
                                            <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                                <Mail size={12} />
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-60 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                                <Users size={32} />
                            </div>
                            <h3 className="text-base font-bold text-slate-700">No students found</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1 max-w-[250px]">
                                There are currently no students enrolled in the '{domain?.name}' domain.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DomainStudentsPanel;
