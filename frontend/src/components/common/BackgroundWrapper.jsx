import React from 'react';

const BackgroundWrapper = ({children}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#F0F4FF] p-4 sm:p-6 md:p-8">
      {/* Responsive Decorative Blobs */}
      <div className="absolute top-[-5%] left-[-10%] w-64 h-64 md:w-96 md:h-96 bg-[#0000FF] rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-10%] w-56 h-56 md:w-80 md:h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-[70px] md:blur-[100px] opacity-20"></div>
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
