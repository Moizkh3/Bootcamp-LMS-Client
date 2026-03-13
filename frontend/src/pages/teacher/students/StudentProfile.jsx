import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Github,
    Linkedin,
    Mail,
    MapPin,
    Calendar,
    Clock,
    AlertCircle,
    ExternalLink,
    ChevronLeft,
    Share2,
    MessageSquare,
    Globe
} from 'lucide-react';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Button from '../../../components/common/Button';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data
    const studentData = {
        id: id || "1",
        name: "Alex Johnson",
        role: "Front-end Developer",
        cohort: "WebDev-Fall-2023",
        status: "Active",
        avatar: "https://i.pravatar.cc/150?u=alex",
        email: "alex.johnson@example.com",
        location: "New York, USA",
        github: "github.com/alexj",
        linkedin: "linkedin.com/in/alexj",
        history: [
            {
                date: "Today, Oct 24",
                today: "Starting User Profile dashboard UI implementation.",
                blocker: "Stuck on the Tailwind dark mode transition bug with framer motion.",
                timeLogged: "6.5"
            },
            {
                date: "Oct 23",
                today: "Auth API layout and state management setup.",
                blocker: null,
                timeLogged: "7.8"
            },
            {
                date: "Oct 22",
                today: "Defining the core design system and utility classes.",
                blocker: "Missing design assets for the landing page.",
                timeLogged: "5.2"
            }
        ]
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto mb-10 px-4 md:px-6">
            <div className="flex items-center justify-between">
                <Breadcrumbs items={[
                    { label: 'Teacher Dashboard', path: '/teacher/dashboard' },
                    { label: 'Students', path: '/teacher/students' },
                    { label: studentData.name }
                ]} />
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" icon={<Share2 size={16} />}>Share</Button>
                    <Button variant="ghost" size="sm" icon={<MessageSquare size={16} />}>Message</Button>
                </div>
            </div>

            {/* Simplified Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12 border-b border-[var(--color-border)] pb-12 text-center md:text-left">
                <div className="relative group">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[var(--color-primary)]/10 border-4 border-[var(--color-surface)] shrink-0 bg-[var(--color-surface)] relative z-10">
                        <img src={studentData.avatar} alt={studentData.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-[var(--color-primary)] rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                </div>

                <div className="flex-grow w-full pt-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4 justify-center md:justify-start">
                        <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-text-main)] tracking-tight">{studentData.name}</h1>
                        <span className="bg-[var(--color-success-bg)] text-[var(--color-success)] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[var(--color-success)]/10">
                            {studentData.status}
                        </span>
                    </div>

                    <p className="text-lg md:text-xl font-semibold text-[var(--color-primary)] mb-8 flex items-center justify-center md:justify-start gap-3">
                        {studentData.role}
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)]" />
                        <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest">{studentData.cohort}</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 max-w-3xl">
                        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Location</p>
                                <p className="text-sm font-semibold text-[var(--color-text-main)]">{studentData.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Email Address</p>
                                <p className="text-sm font-semibold text-[var(--color-text-main)] truncate max-w-[150px]">{studentData.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                                <Globe size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Portfolio</p>
                                <p className="text-sm font-semibold text-[var(--color-text-main)]">alexj.dev</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4">
                        <Button
                            variant="solid"
                            size="lg"
                            icon={<Github size={18} />}
                        >
                            GitHub Profile
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            icon={<Linkedin size={18} />}
                        >
                            LinkedIn
                        </Button>
                    </div>
                </div>
            </div>

            {/* Simplified Standup History */}
            <div>
                <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-10 flex items-center gap-4">
                    Daily History
                    <span className="h-px flex-grow bg-[var(--color-border)] opacity-60" />
                </h3>

                <div className="space-y-10">
                    {studentData.history.map((item, idx) => (
                        <div key={idx} className="group">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-lg font-semibold text-[var(--color-text-main)] tracking-tight">{item.date}</p>
                                <div className="h-px flex-grow mx-6 bg-[var(--color-border)] group-hover:bg-[var(--color-primary)]/20 transition-colors" />
                                <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider bg-[var(--color-background)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg shadow-sm">
                                    {item.timeLogged}h Logged
                                </span>
                            </div>

                            <div className="bg-[var(--color-surface)] p-1 rounded-2xl group-hover:bg-[var(--color-primary)]/5 transition-all duration-500 shadow-sm border border-[var(--color-border)]">
                                <div className="p-8 border border-[var(--color-border)] group-hover:border-[var(--color-primary)]/30 rounded-xl transition-all bg-[var(--color-surface)]">
                                    <p className="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-4">Update</p>
                                    <p className="text-[var(--color-text-main)] font-semibold leading-relaxed mb-6 text-lg">
                                        {item.today}
                                    </p>

                                    {item.blocker && (
                                        <div className="flex items-start gap-4 p-5 bg-[var(--color-danger-bg)] rounded-xl border border-[var(--color-danger)]/20">
                                            <AlertCircle className="text-[var(--color-danger)] shrink-0 mt-1" size={20} />
                                            <div>
                                                <p className="text-[10px] font-semibold text-[var(--color-danger)] uppercase tracking-wider mb-1">Blocker</p>
                                                <p className="text-sm text-[var(--color-danger)]/80 font-semibold leading-relaxed italic">
                                                    "{item.blocker}"
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    variant="secondary"
                    className="w-full mt-12 py-8 bg-[var(--color-surface)] border-dashed"
                    icon={<Clock size={18} />}
                >
                    View Compressed Activity History
                </Button>
            </div>
        </div>
    );
};

export default StudentProfile;
