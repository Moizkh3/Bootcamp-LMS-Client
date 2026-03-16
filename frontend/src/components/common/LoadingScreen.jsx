import React from 'react';
import { Loader2 } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const LoadingScreen = ({ text = "Loading...", variant = "full" }) => {
  const isFull = variant === "full";

  return (
    <div className={`flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm transition-all duration-300 ${
      isFull ? 'fixed inset-0 z-[9999] bg-white' : 'min-h-[400px] w-full rounded-2xl py-12'
    }`}>
      <div className="flex flex-col items-center gap-6 max-w-xs w-full px-6">
        {/* Logo Container */}
        <div className={`relative animate-in fade-in zoom-in duration-700 ${isFull ? 'h-16' : 'h-12'}`}>
           <img
            src={logo}
            alt="BMS Logo"
            className={`${isFull ? 'h-16' : 'h-12'} w-auto object-contain`}
          />
          <div className="absolute -inset-4 bg-[var(--color-primary)]/5 blur-3xl rounded-full -z-10" />
        </div>

        {/* Spinner & Text */}
        <div className="w-full flex flex-col items-center gap-4">
           <div className="relative">
             <Loader2 
               size={isFull ? 32 : 24} 
               className="text-[var(--color-primary)] animate-spin" 
             />
             <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-xl rounded-full animate-pulse" />
           </div>
           
           {text && (
             <p className={`font-bold text-[var(--color-text-muted)] tracking-wide animate-pulse text-center ${isFull ? 'text-sm' : 'text-xs'}`}>
               {text}
             </p>
           )}
        </div>

        {/* Footer info - only on full screen */}
        {isFull && (
          <div className="mt-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                  Bootcamp Management System
              </p>
          </div>
        )}
      </div>
      
      {/* Background Decorative Elements - only on full screen */}
      {isFull && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -ml-32 -mb-32 -z-10" />
        </>
      )}
    </div>
  );
};

export default LoadingScreen;
