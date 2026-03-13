import React, { useState, useRef } from 'react';
import { PlusCircle, Search, X, Info, Plus, Camera, User } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';

const AddDomainForm = () => {
    const [mentorPhoto, setMentorPhoto] = useState(null);
    const fileInputRef = useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setMentorPhoto(url);
        }
    };

    return (
        <aside className="w-full md:w-[380px]">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden sticky top-8">
                <div className="bg-[#1111d4] px-6 py-6 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <PlusCircle size={24} />
                        Add New Domain
                    </h2>
                    <p className="text-blue-100 text-xs font-medium mt-1">Expand the educational reach of BMS</p>
                </div>

                <form className="p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <Input
                        label="Domain Name"
                        placeholder="e.g. Cyber Security Essentials"
                    />

                    <Select
                        label="Select Bootcamp"
                        options={[
                            "Bootcamp 4.0 (Current)",
                            "Bootcamp 5.0 (Upcoming)",
                            "Specialized Series 2024"
                        ]}
                    />

                    <Input
                        label="Assign Mentor"
                        placeholder="Search available mentors..."
                        icon={<Search size={18} />}
                    />
                    <div className="flex flex-col items-center gap-4 py-2 border-b border-slate-100 pb-6 mb-2">
                        <div className="relative group/avatar">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-[#1111d4]/10 shadow-lg bg-gray-50 flex items-center justify-center border border-slate-200">
                                {mentorPhoto ? (
                                    <img src={mentorPhoto} alt="mentor photo" className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110 duration-500" />
                                ) : (
                                    <User size={32} className="text-gray-300" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1111d4] text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all hover:scale-110 active:scale-95"
                            >
                                <Camera size={14} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-700">Mentor Photo</p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current.click()}
                                className="text-[#1111d4] font-bold text-xs mt-1"
                            >
                                Upload Photo
                            </Button>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
                            <img
                                className="size-4 rounded-full"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTv9xs9AUPGVCHTH97L6Ukl3m8l0JAm02QX_ZHD6tezp4CnvVn_l26PxxaWkYs5dYxVr5zGovSOX_UvK8TqyV0r4V1pBD4HCUBY0ewCzsEC6smrulDdpr-pgV_puiTj6exvFFcLCgELT0PKu0dOICZ2kbE06iJjquzSsFuCpZwJaAPHxYgdjCB0jLieuvzvel7lCzUbubqE6_gStXtE6JToZ_Xs8awQYevwLyYjTmpnFPgr3HszLCj9N_6DUgC7vb1F7tv1s2NZQ"
                                alt="Mentor"
                            />
                            Sarah Chen
                            <X size={12} className="cursor-pointer hover:text-red-500" />
                        </span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <label className="text-sm font-bold text-slate-700">Visibility</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input defaultChecked className="text-[#1111d4] focus:ring-[#1111d4] h-4 w-4 border-slate-300" name="visibility" type="radio" />
                                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Public</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input className="text-[#1111d4] focus:ring-[#1111d4] h-4 w-4 border-slate-300" name="visibility" type="radio" />
                                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Draft</span>
                            </label>
                        </div>
                    </div>

                    <button className="w-full bg-[#1111d4] hover:bg-[#0e0eb1] text-white font-bold py-3.5 rounded-lg shadow-lg shadow-[#1111d4]/20 transition-all flex items-center justify-center gap-2 mt-4" type="submit">
                        <Plus size={18} />
                        Create Domain
                    </button>

                    <p className="text-center text-[10px] text-slate-400 font-medium px-4 leading-relaxed">
                        Newly created domains will be automatically added to the current bootcamp curriculum schedule.
                    </p>
                </form>
            </div>

            <div className="mt-6 bg-[#1111d4]/5 border border-[#1111d4]/10 rounded-xl p-4 flex gap-3">
                <Info size={20} className="text-[#1111d4] shrink-0" />
                <div>
                    <p className="text-sm font-bold text-slate-800">Domain Quotas</p>
                    <p className="text-xs text-slate-600 mt-0.5">You have 12 domains active. Your plan allows for up to 20 domains per bootcamp context.</p>
                </div>
            </div>
        </aside>
    );
};

export default AddDomainForm;
