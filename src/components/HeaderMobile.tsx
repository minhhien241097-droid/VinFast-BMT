import React from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { DealershipConfig, DEALERSHIP_INFO } from '../data/cars';

interface HeaderMobileProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  dealership?: DealershipConfig;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({
  isMenuOpen,
  onToggleMenu,
  dealership = DEALERSHIP_INFO
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
            {dealership.shortRegionName}
          </span>
        </div>
      </div>

      {dealership.hotline && (
        <a
          href={`tel:${dealership.hotline.replace(/\s+/g, '')}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors"
        >
          <Phone size={14} />
          <span>{dealership.hotline}</span>
        </a>
      )}
    </header>
  );
};
