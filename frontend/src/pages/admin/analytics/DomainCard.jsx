import { Code, Brain, Palette, Shield } from 'lucide-react';

const DomainCard = ({ domain, index }) => {
    const icons = [<Code size={20} />, <Brain size={20} />, <Palette size={20} />, <Shield size={20} />];
    const colors = [
        { text: 'text-blue-600', bg: 'bg-blue-50' },
        { text: 'text-purple-600', bg: 'bg-purple-50' },
        { text: 'text-pink-600', bg: 'bg-pink-50' },
        { text: 'text-cyan-600', bg: 'bg-cyan-50' }
    ];

    const color = colors[index % colors.length];
    const Icon = icons[index % icons.length];

    // Status based on students count or activity if we had it
    const status = domain.students > 0 ? 'Active' : 'Empty';

    const statusColors = {
        'Active': 'bg-green-100 text-green-700',
        'Empty': 'bg-yellow-100 text-yellow-700',
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm h-full">
            <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${color.bg} ${color.text} rounded-lg flex items-center justify-center`}>
                    {Icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[status]}`}>
                    {status}
                </span>
            </div>
            <div>
                <h4 className="font-bold text-slate-800 line-clamp-1 uppercase tracking-tight">{domain.name}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{domain.bootcamp?.name || domain.bootcamp || 'General'}</p>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-600 font-medium">Enrolled Students</span>
                    <span className="font-bold text-slate-800">{domain.students || 0}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                        className="bg-[#3636e2] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (domain.students || 0) * 5)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DomainCard;
