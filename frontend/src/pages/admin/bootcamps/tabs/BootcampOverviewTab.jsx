import React from 'react';
import { Calendar, Layers, Users, ShieldAlert } from 'lucide-react';

export default function BootcampOverviewTab({ bootcamp }) {
    if (!bootcamp) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-[#64748b]">
                        <Calendar size={18} />
                        <span className="text-sm font-medium">Start Date</span>
                    </div>
                    <p className="text-lg font-bold text-[#0f172a]">{new Date(bootcamp.startDate).toLocaleDateString()}</p>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-[#64748b]">
                        <Calendar size={18} />
                        <span className="text-sm font-medium">End Date</span>
                    </div>
                    <p className="text-lg font-bold text-[#0f172a]">{new Date(bootcamp.endDate).toLocaleDateString()}</p>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-[#64748b]">
                        <Layers size={18} />
                        <span className="text-sm font-medium">Domains</span>
                    </div>
                    <p className="text-lg font-bold text-[#0f172a]">{bootcamp.domains?.length || 0}</p>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-[#64748b]">
                        <Users size={18} />
                        <span className="text-sm font-medium">Students Enrolled</span>
                    </div>
                    <p className="text-lg font-bold text-[#0f172a]">{bootcamp.studentCount || 0}</p>
                </div>
            </div>

            {/* Additional Info Section (Placeholder for future expansion) */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#e2e8f0]">
                    <h2 className="text-lg font-bold text-[#0f172a]">Configuration</h2>
                </div>
                <div className="p-6">
                    <p className="text-[#64748b] text-sm">
                        Basic settings and configuration for this bootcamp. More granular settings can be added here in the future.
                    </p>
                </div>
            </div>
        </div>
    );
}
