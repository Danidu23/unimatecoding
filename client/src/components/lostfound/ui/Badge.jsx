import React from 'react';

export default function Badge({ children, status, className = '' }) {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'claimed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'verified':
      case 'matched': 
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'closed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-gold/10 text-gold border-gold/20';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()} ${className}`}>
      {children}
    </span>
  );
}
