import React from 'react';
import { ArrowRight, Calculator, Shield } from 'lucide-react';

interface SmartToolsSectionProps {
  onOpenCalculator: () => void;
  onOpenAccessories: () => void;
}

export const SmartToolsSection: React.FC<SmartToolsSectionProps> = ({
  onOpenCalculator,
  onOpenAccessories
}) => {
  return (
    <div>
      <h2 className="text-[17px] font-bold text-[#1E293B] mb-3.5 flex items-center justify-between">
        <span>Công cụ mua xe thông minh</span>
        <span className="text-xs font-semibold text-slate-500">Chính xác & Minh bạch</span>
      </h2>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Card 1: Dự toán lăn bánh & Trả góp */}
        <div
          onClick={onOpenCalculator}
          className="flex-1 bg-gradient-to-br from-white via-white to-[#D8EAFE] rounded-[20px] p-6 sm:p-7 min-h-[220px] flex flex-col justify-between shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-blue-50 relative overflow-hidden group cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[19px] font-extrabold text-[#0F172A] block mb-2 group-hover:text-[#1464F4] transition-colors">
                Dự toán lăn bánh & Trả góp
              </span>
              <Calculator size={22} className="text-[#1464F4] md:hidden" />
            </div>
            <p className="text-[14px] text-[#64748B] leading-relaxed max-w-[85%]">
              Đối chiếu ngân sách hiện tại với dòng xe mục tiêu, tính chi tiết chi phí ra biển số và số tiền góp từng tháng.
            </p>
          </div>

          <div className="flex items-end justify-between mt-5 pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 py-2.5 px-5 border-[1.2px] border-[#2563EB] bg-white rounded-xl text-[14px] font-bold text-[#1464F4] group-hover:bg-[#1464F4] group-hover:text-white transition-all shadow-xs"
            >
              <span>Xem chi tiết</span>
              <ArrowRight size={15} />
            </button>
            <span className="text-[52px] leading-none text-[#60A5FA] opacity-35 select-none font-light group-hover:opacity-60 transition-opacity">
              ☍
            </span>
          </div>
        </div>

        {/* Card 2: Phụ kiện & Bảo hiểm */}
        <div
          onClick={onOpenAccessories}
          className="flex-1 bg-gradient-to-br from-white via-white to-[#D8EAFE] rounded-[20px] p-6 sm:p-7 min-h-[220px] flex flex-col justify-between shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-blue-50 relative overflow-hidden group cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[19px] font-extrabold text-[#0F172A] block mb-2 group-hover:text-[#1464F4] transition-colors">
                Phụ kiện & Bảo hiểm
              </span>
              <Shield size={22} className="text-[#1464F4] md:hidden" />
            </div>
            <p className="text-[14px] text-[#64748B] leading-relaxed max-w-[85%]">
              Khám phá các gói phụ kiện chính hãng, thiết bị tiện ích và bảo hiểm xe tốt nhất dành riêng cho bạn.
            </p>
          </div>

          <div className="flex items-end justify-between mt-5 pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 py-2.5 px-5 border-[1.2px] border-[#2563EB] bg-white rounded-xl text-[14px] font-bold text-[#1464F4] group-hover:bg-[#1464F4] group-hover:text-white transition-all shadow-xs"
            >
              <span>Xem chi tiết</span>
              <ArrowRight size={15} />
            </button>
            <span className="text-[38px] leading-none select-none group-hover:scale-110 transition-transform">
              🛡️
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
