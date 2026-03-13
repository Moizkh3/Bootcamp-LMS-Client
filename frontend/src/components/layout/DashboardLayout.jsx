import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
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
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
