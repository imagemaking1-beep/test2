
import React from 'react';

interface NeoButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ children, onClick, className = "", type = "button", disabled }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`
      px-6 py-4 font-black text-xl border-4 border-black neo-shadow-sm
      active:translate-x-1 active:translate-y-1 active:shadow-none
      transition-all disabled:opacity-50 disabled:cursor-not-allowed
      flex items-center justify-center gap-2
      ${className}
    `}
  >
    {children}
  </button>
);

export const NeoCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white border-4 border-black neo-shadow overflow-hidden relative ${className}`}>
    <div className="h-4 bg-black w-full" />
    {children}
  </div>
);

export const NeoBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`px-3 py-1 border-2 border-black font-black uppercase text-sm ${className}`}>
    {children}
  </span>
);
