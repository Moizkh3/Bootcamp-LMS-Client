import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function TeacherLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Initial sidebar state based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Call on mount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const [assignments, setAssignments] = useState([
        {
            id: 1,
            title: "Advanced React Patterns",
            module: "Module 4",
            domain: "Frontend",
            deadline: "Oct 24, 2023",
            status: "Active",
            submissions: 42,
            totalStudents: 50,
            isOverdue: true,
            batch: "Fall 2023 Cohort"
        },
        {
            id: 2,
            title: "Fullstack Capstone Proposal",
            module: "Module 2",
            domain: "Architecture",
            deadline: "Oct 25, 2023",
            status: "Active",
            submissions: 15,
            totalStudents: 50,
            isOverdue: false,
            batch: "Spring 2024 Cohort"
        },
        {
            id: 3,
            title: "UI/UX Component Library",
            module: "Module 1",
            domain: "Frontend",
            deadline: "Oct 30, 2023",
            status: "Closed",
            submissions: 50,
            totalStudents: 50,
            isOverdue: false,
            batch: "Winter 2023 Cohort"
        }
    ]);

    const handleAddAssignmentGlobal = (data) => {
        setAssignments(prev => [...prev, { ...data, id: Date.now() }]);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-50 md:hidden"
                />
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-5 md:p-8">
                    <Outlet context={{ assignments, setAssignments, handleAddAssignmentGlobal }} />
                </main>
            </div>
        </div>
    );
}
