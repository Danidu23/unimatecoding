import React from 'react';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div className={`bg-navy-light rounded-xl border border-white/5 overflow-hidden ${hover ? 'hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
}
