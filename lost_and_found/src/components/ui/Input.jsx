import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <input 
        className={`w-full bg-[#162032] border ${error ? 'border-red-500' : 'border-slate-700'} text-slate-200 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
