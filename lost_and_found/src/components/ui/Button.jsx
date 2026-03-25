import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gold text-navy hover:bg-gold-hover shadow-lg shadow-gold/20',
    secondary: 'bg-navy-light text-slate-200 hover:bg-slate-700 border border-slate-600',
    outline: 'bg-transparent text-gold border border-gold hover:bg-gold/10',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
