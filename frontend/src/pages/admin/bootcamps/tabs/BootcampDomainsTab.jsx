import React, { useState } from 'react';
import { Plus, Search, Layers, Trash2 } from 'lucide-react';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import QuickAddModal from '../../domain/QuickAddModal';
import AddDomainModal from '../../domain/AddDomainModal';

export default function BootcampDomainsTab({ bootcamp }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // domains are populated by the backend in getBootcampById
    const domains = bootcamp.domains || [];

    const filteredDomains = domains.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.mentorName && d.mentorName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleRemoveDomain = (id) => {
        console.log('Remove domain', id);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Input
                    className="flex-1 max-w-sm"
                    icon={<Search size={20} />}
                    placeholder="Search domains..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsAddModalOpen(true)}>
                    New Domain
                </Button>
            </div>

            <AddDomainModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={() => { }} // Redux invalidates
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDomains.length > 0 ? (
                    filteredDomains.map((domain) => (
                        <div key={domain._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                    <Layers size={24} />
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${domain.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                                    }`}>
                                    {domain.status}
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{domain.name}</h3>
                            <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed h-8">{domain.description || 'No description provided.'}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                                        {domain.mentorAvatar ? (
                                            <img src={domain.mentorAvatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-600">
                                                {domain.mentorName 
                                                    ? domain.mentorName.substring(0, 2).toUpperCase() 
                                                    : '??'}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-800">
                                            {domain.mentorName || 'Unassigned'}
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-medium">Mentor</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveDomain(domain._id)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                        <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
                            <Layers size={32} />
                        </div>
                        <p className="text-slate-500 font-bold">No Domains Found</p>
                        <p className="text-slate-400 text-sm mt-1">Add domains to this bootcamp to get started.</p>
                        <Button
                            variant="primary"
                            size="sm"
                            className="mt-6"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Create First Domain
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
