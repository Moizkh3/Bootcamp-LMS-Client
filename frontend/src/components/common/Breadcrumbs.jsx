import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items, customLabel }) => {
    const location = useLocation();
    
    // Use provided items OR generate from pathname
    const breadcrumbItems = items || (location.pathname
        .split('/')
        .filter((x) => x && !['student', 'admin', 'teacher'].includes(x.toLowerCase()))
        .map((value, index, array) => {
            const isLast = index === array.length - 1;
            const path = `/${array.slice(0, index + 1).join('/')}`;
            
            // Regex to detect MongoDB ObjectIds
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(value);
            
            let label = value.charAt(0).toUpperCase() + value.slice(1);
            if (isMongoId) {
                label = customLabel || 'Loading...';
            }
            
            return { label, path, isLast, isMongoId };
        })
        .filter(item => !item.isMongoId || customLabel) // Only show if we have a label or it's Not an ID
    );

    return (
        <nav className="flex items-center space-x-2 text-xs font-semibold mb-6">
            <Link
                to="/"
                className="flex items-center gap-1.5 text-slate-400 hover:text-[#3636e2] transition-colors"
            >
                <Home size={14} />
                <span>BMS</span>
            </Link>

            {breadcrumbItems.map((item, index) => (
                <div key={item.path || index} className="flex items-center space-x-2">
                    <ChevronRight size={14} className="text-slate-300" />
                    {item.isLast ? (
                        <span className="text-slate-600 font-bold max-w-[200px] truncate">
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            to={item.path}
                            className="text-slate-400 hover:text-[#3636e2] transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
