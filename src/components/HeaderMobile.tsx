import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderMobileProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({
  isMenuOpen,
  onToggleMenu
}) => {
  return (
    <header className="md:hidden bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMenu}
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-800 active:scale-95 transition-transform"
          aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-baseline gap-1.5 font-extrabold text-base tracking-tight text-slate-900">
          <span>VINFAST</span>
          <span className="text-[#1464F4] font-bold text-[0.7em] uppercase tracking-wider">
            BÌNH PHƯỚC
          </span>
        </div>
      </div>
    </header>
  );
};
