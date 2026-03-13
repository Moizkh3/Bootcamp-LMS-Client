import React from 'react';

const PasswordChecklist = () => {
    return (
        <div className="mt-4 px-1">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password Requirements:</h4>
            <ul className="space-y-1.5">
                <li className="text-[11px] text-gray-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    At least 8 characters long
                </li>
                <li className="text-[11px] text-gray-1000 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                    Must include numbers and symbols
                </li>
            </ul>
        </div>
    );
};

export default PasswordChecklist;
