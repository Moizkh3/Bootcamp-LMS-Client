import React from 'react';
import { Megaphone } from 'lucide-react';

const BroadcastAnnouncement = () => {
  return (
    <div className="bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-200 p-8 flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">
        <Megaphone size={28} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-3">Broadcast Announcement</h3>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-[260px] mx-auto">
        Keep your students updated with the latest news, deadline changes, or resource links.
      </p>

      <div className="w-full relative mb-6">
        <textarea
          placeholder="Type your announcement here..."
          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none shadow-sm"
        ></textarea>
      </div>

      <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
        Post to Dashboard
      </button>
    </div>
  );
};

export default BroadcastAnnouncement;
