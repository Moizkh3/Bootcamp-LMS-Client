import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, Link, ChevronDown } from 'lucide-react';
import { useGetAllSubmissionsQuery } from '../../../features/submission/submissionApi';

const DailyActivity = () => {
    const [page, setPage] = useState(1);
    const [allSubmissions, setAllSubmissions] = useState([]);
    const { data: submissionsResponse, isLoading, isFetching } = useGetAllSubmissionsQuery({ page, limit: 10 });
    
    const submissions = submissionsResponse?.submissions || [];
    const pagination = submissionsResponse?.pagination;
    const hasMore = pagination ? pagination.currentPage < pagination.totalPages : false;

    useEffect(() => {
        if (submissions.length > 0) {
            if (page === 1) {
                setAllSubmissions(submissions);
            } else {
                setAllSubmissions(prev => {
                    // Prevent duplicates
                    const existingIds = new Set(prev.map(s => s._id));
                    const newItems = submissions.filter(s => !existingIds.has(s._id));
                    return [...prev, ...newItems];
                });
            }
        }
    }, [submissions, page]);

    const handleLoadMore = () => {
        if (hasMore && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Live Progress Stream</h3>
                    <p className="text-sm text-slate-500">Real-time submission log from active cohorts</p>
                </div>
                <div className="p-0">
                    {isLoading && page === 1 ? (
                        <div className="p-12 text-center text-slate-400">Loading activity...</div>
                    ) : allSubmissions.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {allSubmissions.map((sub) => (
                                <div key={sub._id} className="p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <User size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                                                <h4 className="text-sm font-bold text-slate-800 truncate">
                                                    {sub.student?.name || 'Unknown Student'}
                                                </h4>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                                    <Clock size={10} /> {new Date(sub.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                                                Submitted <span className="font-bold text-blue-600">{sub.assignment?.title || 'an assignment'}</span>
                                            </p>
                                            <div className="flex gap-2">
                                                {sub.frontendGithubUrl && (
                                                    <a href={sub.frontendGithubUrl} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors border border-slate-100 px-2 py-1 rounded-lg hover:border-blue-100 hover:bg-white shadow-sm">
                                                        <Link size={10} /> Frontend Repo
                                                    </a>
                                                )}
                                                {sub.backendGithubUrl && (
                                                    <a href={sub.backendGithubUrl} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors border border-slate-100 px-2 py-1 rounded-lg hover:border-blue-100 hover:bg-white shadow-sm">
                                                        <Link size={10} /> Backend Repo
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Activity size={32} className="mb-2 opacity-20" />
                            <p className="text-xs font-medium">No recent activity detected</p>
                        </div>
                    )}
                </div>
                {hasMore && (
                    <div className="p-4 border-t border-slate-100 text-center">
                        <button 
                            onClick={handleLoadMore}
                            disabled={isFetching}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                        >
                            {isFetching ? 'Loading...' : (
                                <>
                                    <ChevronDown size={14} /> View More Submissions
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyActivity;
