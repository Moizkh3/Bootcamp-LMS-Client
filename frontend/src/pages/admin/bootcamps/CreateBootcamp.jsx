import React, { useState } from 'react';
import {
    ChevronRight,
    Info,
    Calendar as CalendarIcon,
    ChevronLeft,
    Plus,
    Trash2,
    Layers,
    X,
    Lightbulb
} from 'lucide-react';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay
} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
    useCreateBootcampMutation
} from '../../../features/bootcamp/bootcampApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { useGetUsersByRoleQuery } from '../../../features/user/userApi';
import { toast } from 'react-hot-toast';

const Calendar = ({ label, selectedDate, onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));

    const handleMonthChange = (direction) => {
        setCurrentMonth(direction === 'next' ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    return (
        <div className="flex-1 min-w-[300px]">
            <p className="text-sm font-bold text-[#334155] mb-4 text-center">
                {label}
            </p>
            <div className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                <div className="flex items-center mb-4 justify-between">
                    <button
                        onClick={() => handleMonthChange('prev')}
                        className="p-1.5 hover:bg-[#e2e8f0] rounded-lg transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <p className="font-bold text-sm text-[#0f172a]">
                        {format(currentMonth, 'MMMM yyyy')}
                    </p>
                    <button
                        onClick={() => handleMonthChange('next')}
                        className="p-1.5 hover:bg-[#e2e8f0] rounded-lg transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-7 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                        <div
                            key={`${day}-${idx}`}
                            className="text-center text-[0.7rem] font-bold text-[#94a3b8]"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isSelected = isSameDay(day, selectedDate);

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => onDateSelect(day)}
                                className={`w-full aspect-square flex items-center justify-center text-[0.75rem] font-bold rounded-lg transition-all ${isSelected
                                    ? 'bg-[#1111d4] text-white shadow-md'
                                    : isCurrentMonth
                                        ? 'text-[#1e293b] hover:bg-[#e2e8f0]'
                                        : 'text-[#94a3b8] hover:bg-[#e2e8f0]/50'
                                    }`}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default function CreateBootcamp() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('active');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 3)));
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);

    const { data: domainsResponse, isLoading: isLoadingDomains } = useGetAllDomainsQuery();
    const { data: teachersResponse, isLoading: isLoadingTeachers } = useGetUsersByRoleQuery('teacher');
    const [createBootcamp, { isLoading: isCreating }] = useCreateBootcampMutation();

    const availableDomains = domainsResponse?.data || [];
    const availableTeachers = teachersResponse?.data || [];

    const handleCreateBootcamp = async () => {
        if (!name) {
            toast.error('Please enter a bootcamp name');
            return;
        }

        const payload = {
            name,
            description,
            status,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            domains: selectedDomains,
            teachers: selectedTeachers
        };

        try {
            await createBootcamp(payload).unwrap();
            toast.success('Bootcamp created successfully');
            navigate('/bootcamps');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to create bootcamp');
        }
    };

    const toggleDomain = (domainId) => {
        if (selectedDomains.includes(domainId)) {
            setSelectedDomains(selectedDomains.filter(id => id !== domainId));
        } else {
            setSelectedDomains([...selectedDomains, domainId]);
        }
    };

    const toggleTeacher = (teacherId) => {
        if (selectedTeachers.includes(teacherId)) {
            setSelectedTeachers(selectedTeachers.filter(id => id !== teacherId));
        } else {
            setSelectedTeachers([...selectedTeachers, teacherId]);
        }
    };

    if (isLoadingDomains || isLoadingTeachers) return <div className="flex items-center justify-center min-h-[400px]">Loading resources...</div>;

    return (
        <div className="max-w-[1000px] mx-auto pb-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 mb-6 text-[#64748b]">
                <button
                    onClick={() => navigate('/bootcamps')}
                    className="text-sm font-medium hover:text-[#1111d4] transition-colors"
                >
                    Bootcamps
                </button>
                <ChevronRight size={14} />
                <span className="text-sm font-bold text-[#0f172a]">Create New Bootcamp</span>
            </nav>

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2">
                    Create New Bootcamp
                </h1>
                <p className="text-[#64748b] max-w-[600px]">
                    Configure the details of your new training program. You can assign teachers and define domains now, or skip and add them later during editing.
                </p>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-2xl border border-[#e2e8f0] shadow-sm">
                <div className="flex flex-col gap-10">
                    {/* General Information */}
                    <section>
                        <h2 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                            <Info size={20} className="text-[#1111d4]" /> General Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                className="md:col-span-2"
                                label="Bootcamp Name"
                                required
                                placeholder="e.g. Full Stack Web Development 2024"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                className="md:col-span-2"
                                label="Description"
                                placeholder="Brief description of the bootcamp..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Select
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                options={[
                                    { value: "active", label: "Active" },
                                    { value: "archived", label: "Archived" },
                                    { value: "draft", label: "Draft" }
                                ]}
                            />
                        </div>
                    </section>

                    {/* Duration & Schedule */}
                    <section className="pt-10 border-t border-[#f1f5f9]">
                        <h2 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                            <CalendarIcon size={20} className="text-[#1111d4]" /> Duration & Schedule
                        </h2>
                        <div className="flex flex-col lg:flex-row gap-10 md:gap-20">
                            <Calendar label="Start Date" selectedDate={startDate} onDateSelect={setStartDate} />
                            <Calendar label="End Date" selectedDate={endDate} onDateSelect={setEndDate} />
                        </div>
                    </section>

                    {/* Teachers Selection */}
                    <section className="pt-10 border-t border-[#f1f5f9]">
                        <h2 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-[#1111d4]" /> Assign Teachers
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {availableTeachers.map((teacher) => (
                                <button
                                    key={teacher._id}
                                    onClick={() => toggleTeacher(teacher._id)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${selectedTeachers.includes(teacher._id)
                                        ? 'bg-[#1111d4] text-white border-[#1111d4]'
                                        : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1111d4]/50'
                                        }`}
                                >
                                    {teacher.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Domains Selection */}
                    <section className="pt-10 border-t border-[#f1f5f9]">
                        <h2 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                            <Layers size={20} className="text-[#1111d4]" /> Available Domains
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {availableDomains.map((domain) => (
                                <button
                                    key={domain._id}
                                    onClick={() => toggleDomain(domain._id)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${selectedDomains.includes(domain._id)
                                        ? 'bg-[#1111d4] text-white border-[#1111d4]'
                                        : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1111d4]/50'
                                        }`}
                                >
                                    {domain.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="pt-10 border-t border-[#f1f5f9] flex justify-end gap-4">
                        <button
                            onClick={() => navigate('/bootcamps')}
                            className="px-6 py-2 text-[#64748b] font-bold hover:text-[#0f172a] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isCreating}
                            onClick={handleCreateBootcamp}
                            className={`bg-[#1111d4] hover:bg-[#0e0eb1] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-[#1111d4]/20 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isCreating ? 'Creating...' : 'Create Bootcamp'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Pro Tip */}
            <div className="mt-8 p-4 bg-[#1111d4]/5 border border-[#1111d4]/10 rounded-xl flex gap-3">
                <Lightbulb size={20} className="text-[#1111d4] shrink-0" />
                <p className="text-sm text-[#475569]">
                    <span className="font-bold text-[#1111d4]">Pro Tip:</span> Once the bootcamp is created, you can bulk import students from a CSV file in the 'Students' management tab.
                </p>
            </div>

            {/* Page Footer */}
            <footer className="py-12 text-center">
                <p className="text-[0.75rem] text-[#94a3b8]">
                    © 2024 BMS Admin Dashboard. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
