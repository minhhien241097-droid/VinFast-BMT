import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onOpenPromotions: () => void;
  onOpenTestDrive: () => void;
  onOpenRental: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenPromotions,
  onOpenTestDrive,
  onOpenRental
}) => {
  return (
    <div>
      <h2 className="text-[17px] font-bold text-[#1E293B] mb-3.5 flex items-center justify-between">
        <span>Chương trình & Dịch vụ</span>
        <span className="text-xs font-semibold text-slate-500">Chính hãng VinFast 3S</span>
      </h2>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Card 1: Khuyến mãi */}
        <div
          onClick={onOpenPromotions}
          className="flex-1 bg-white rounded-[20px] p-5 sm:p-6 min-h-[175px] flex flex-col justify-between shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-blue-100 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[16px] font-bold text-[#0F172A] group-hover:text-[#1464F4] transition-colors">
                Chương trình khuyến mãi
              </span>
              <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                🎁
              </span>
            </div>
            <p className="text-[13.5px] text-[#64748B] leading-relaxed">
              Cập nhật bảng giá, ưu đãi đặc quyền và các chính sách giảm giá mới nhất trong tháng.
            </p>
          </div>

          <button
            type="button"
            className="text-[14px] font-bold text-[#1464F4] group-hover:text-blue-700 mt-4 inline-flex items-center gap-1 w-fit"
          >
            <span>Xem ưu đãi</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 2: Lái thử */}
        <div
          onClick={onOpenTestDrive}
          className="flex-1 bg-white rounded-[20px] p-5 sm:p-6 min-h-[175px] flex flex-col justify-between shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-blue-100 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[16px] font-bold text-[#0F172A] group-hover:text-[#1464F4] transition-colors">
                Đăng ký lái thử
              </span>
              <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                🔑
              </span>
            </div>
            <p className="text-[13.5px] text-[#64748B] leading-relaxed">
              Trải nghiệm thực tế cảm giác lái xe điện êm ái. Hỗ trợ mang xe tận nơi miễn phí phục vụ bạn.
            </p>
          </div>

          <button
            type="button"
            className="text-[14px] font-bold text-[#1464F4] group-hover:text-blue-700 mt-4 inline-flex items-center gap-1 w-fit"
          >
            <span>Đặt lịch ngay</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 3: Thuê xe */}
        <div
          onClick={onOpenRental}
          className="flex-1 bg-white rounded-[20px] p-5 sm:p-6 min-h-[175px] flex flex-col justify-between shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-blue-100 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[16px] font-bold text-[#0F172A] group-hover:text-[#1464F4] transition-colors">
                Thuê xe trải nghiệm
              </span>
              <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                🚙
              </span>
            </div>
            <p className="text-[13.5px] text-[#64748B] leading-relaxed">
              Dịch vụ cho thuê xe điện tự lái ngắn hạn và dài hạn thủ tục nhanh gọn, giao xe ngay.
            </p>
          </div>

          <button
            type="button"
            className="text-[14px] font-bold text-[#1464F4] group-hover:text-blue-700 mt-4 inline-flex items-center gap-1 w-fit"
          >
            <span>Khám phá ngay</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
