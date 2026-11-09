import React from 'react';
import { DEALERSHIP_INFO } from '../data/cars';
import { Calculator, Gift, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOverview: () => void;
  onOpenCalculator: () => void;
  onOpenPromotions: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSelectOverview,
  onOpenCalculator,
  onOpenPromotions
}) => {
  const menuItems = [
    {
      id: 'calculator',
      label: 'Dự toán lăn bánh & Trả góp',
      icon: Calculator,
      action: onOpenCalculator,
      highlight: true
    },
    {
      id: 'promotions',
      label: 'Chương trình khuyến mãi',
      icon: Gift,
      action: onOpenPromotions
    }
  ];

  return (
    <>
      {/* Background Overlay on Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 md:top-5 z-50 md:z-10 w-[275px] bg-white rounded-none md:rounded-[20px] p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between h-screen md:h-auto shrink-0 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between md:justify-center gap-2 mb-5 pb-2 border-b md:border-b-0 border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-extrabold text-[#0F172A] tracking-wider uppercase">
                {DEALERSHIP_INFO.brandName}
              </span>
              <span className="hidden md:inline-block bg-[#EDE9FE] text-[#6D28D9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {DEALERSHIP_INFO.tier}
              </span>
            </div>

            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              aria-label="Đóng menu"
            >
              ✕
            </button>
          </div>

          {/* Profile Card */}
          <div className="text-center pb-4 mb-3 border-b border-slate-100">
            <div className="w-[74px] h-[74px] rounded-2xl mx-auto mb-2.5 flex items-center justify-center p-1 bg-slate-50 border border-slate-100 shadow-xs overflow-hidden">
              <img
                src={DEALERSHIP_INFO.avatarUrl}
                alt={DEALERSHIP_INFO.showroomName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="text-[14px] font-extrabold text-[#0F172A] uppercase tracking-tight">
              {DEALERSHIP_INFO.showroomName}
            </div>
            <div className="inline-block bg-[#EFF6FF] border border-[#DBEAFE] text-[#1464F4] text-[11.5px] font-bold px-2.5 py-0.5 rounded-md my-1">
              {DEALERSHIP_INFO.role}
            </div>
            <div className="text-[11.5px] text-[#64748B]">
              {DEALERSHIP_INFO.coverageArea}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => {
                onSelectOverview();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold bg-[#F0F6FF] text-[#1464F4] shadow-xs text-left transition-all hover:bg-blue-100/70 cursor-pointer"
            >
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <LayoutGrid size={18} className="text-[#1464F4]" />
              </span>
              <span className="leading-snug">Tổng quan & Bảng giá xe</span>
            </button>

            <div className="pt-3 pb-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5">
                Công cụ & Dịch vụ
              </div>
            </div>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-[#1E293B] hover:bg-slate-50 hover:text-[#1464F4] transition-all text-left group cursor-pointer"
                  >
                    <span className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-500 group-hover:text-[#1464F4] group-hover:scale-110 transition-all">
                      <ItemIcon size={18} />
                    </span>
                    <span className="leading-snug">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};
