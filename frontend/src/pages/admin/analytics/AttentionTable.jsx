import React from 'react';

const AttentionTable = ({ students = [] }) => {
    // For now, let's filter students who have some "risk" indicators
    // Since we don't have missedReports/missedAssignments in the model yet, 
    // let's show all for now or a subset.
    const attentionStudents = students.slice(0, 5); // Limit to top 5 for "attention"

    return (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Need Attention</h3>
                    <p className="text-sm text-slate-500">Students who might need additional support</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Domain</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {attentionStudents.length > 0 ? (
                            attentionStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                                        {student.domainId?.title || 'General'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold ${student.studentStatus === 'enrolled' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'} px-2 py-0.5 rounded-full border border-current opacity-80`}>
                                            {student.studentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                        {new Date(student.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right leading-none">
                                        <a
                                            href={`mailto:${student.email}`}
                                            className="text-[#3636e2] hover:text-blue-700 text-xs font-black transition-colors underline decoration-dotted"
                                        >
                                            Contact Student
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">
                                    No students requiring attention found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AttentionTable;
