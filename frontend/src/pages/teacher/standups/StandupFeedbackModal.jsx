import React, { useState } from 'react';
import { Star, MessageSquare, Send, Loader2, Calendar, Clock, AlertCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

const StandupFeedbackModal = ({ isOpen, onClose, standup, onAction, isLoading }) => {
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [activeTab, setActiveTab] = useState('standups');

    if (!standup) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAction({ id: standup.id, grade, feedback });
    };

    const formattedDate = new Date(standup.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showTitle={false}
            size="2xl"
            padding="none"
        >
            <div className="bg-white max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Header Section */}
                <div className="p-4 sm:p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 overflow-hidden shadow-sm shrink-0">
                                {standup.avatar ? (
                                    <img src={standup.avatar} alt={standup.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl sm:text-2xl font-bold">{standup.name?.[0]}</span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight truncate">{standup.name}</h3>
                                <p className="text-gray-500 font-medium tracking-tight text-xs sm:text-base truncate">
                                    Roll No: {standup.rollNo} <span className="hidden sm:inline">•</span> <span className="sm:inline block">{standup.email}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-xl sm:rounded-2xl border border-gray-100 shadow-inner w-full lg:w-auto">
                            <button
                                onClick={() => setActiveTab('standups')}
                                className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                                    activeTab === 'standups'
                                        ? 'bg-blue-700 text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Daily Standups
                            </button>
                            <button
                                onClick={() => setActiveTab('assignments')}
                                className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                                    activeTab === 'assignments'
                                        ? 'bg-blue-700 text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Assignments
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-8 pb-10">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Left Side: Standup Details */}
                        <div className="flex-1 space-y-6 lg:space-y-8">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 text-blue-700 mb-6">
                                    <Calendar size={18} className="sm:size-5 stroke-[2.5px]" />
                                    <span className="text-base sm:text-lg font-bold tracking-tight">{formattedDate}</span>
                                    {standup.grade && (
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] sm:text-xs font-bold border border-amber-100">
                                            <Star size={12} fill="currentColor" />
                                            Grade: {standup.grade}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Yesterday's Work</h4>
                                        <p className="text-sm sm:text-[15px] font-semibold text-gray-700 leading-relaxed capitalize whitespace-pre-wrap">{standup.yesterday || 'Any'}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Today's Plan</h4>
                                        <p className="text-sm sm:text-[15px] font-semibold text-gray-700 leading-relaxed capitalize whitespace-pre-wrap">{standup.today || 'Any'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-50/50 rounded-2xl p-5 sm:p-6 border border-red-100 shadow-sm">
                                <h4 className="text-[10px] sm:text-[11px] font-black text-red-600 uppercase tracking-[0.15em] mb-3">Blockers</h4>
                                <p className="text-sm sm:text-[15px] font-semibold text-red-700 capitalize leading-relaxed whitespace-pre-wrap">{standup.blocker || 'Any'}</p>
                            </div>
                        </div>

                        {/* Right Side: Feedback Form */}
                        <div className="w-full lg:w-[360px] bg-gray-50/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-6 tracking-tight">Provide Feedback</h4>
                            
                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Grade (e.g. A, B, 9/10)</label>
                                    <input
                                        type="text"
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        placeholder="Grade"
                                        className="w-full bg-white border border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Comments</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Write your feedback..."
                                        className="w-full bg-white border border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-sm min-h-[140px] sm:min-h-[160px] resize-none leading-relaxed"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-sm shadow-indigo-100"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Submit Feedback'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default StandupFeedbackModal;
