import React, { useState } from 'react';
import { DEALERSHIP_INFO } from '../data/cars';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface BannerSectionProps {
  onOpenPromotions: () => void;
}

export const BannerSection: React.FC<BannerSectionProps> = ({
  onOpenPromotions
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(20,100,244,0.08)] bg-gradient-to-r from-[#0D3880] to-[#1464F4] relative group">
      {!imgError ? (
        <div className="relative cursor-pointer" onClick={onOpenPromotions}>
          {/* PC Banner */}
          <img
            src={DEALERSHIP_INFO.bannerPcUrl}
            alt="Lên đời xe điện VinFast - Giữa phố hiện đại"
            className="hidden sm:block w-full h-auto object-cover rounded-[22px] hover:scale-[1.01] transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          {/* Mobile Banner */}
          <img
            src={DEALERSHIP_INFO.bannerMobileUrl}
            alt="Lên đời xe điện chọn VinFast"
            className="block sm:hidden w-full h-auto object-cover rounded-[22px]"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        /* Fallback if external image CDN is unreachable */
        <div className="p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-bold tracking-wide">
              <Zap size={14} />
              <span>CƠ HỘI SỞ HỮU XE ĐIỆN VINFAST TIÊN PHONG</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Lên Đời Xe Điện - Giữa Phố Hiện Đại
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Miễn 100% lệ phí trước bạ, hỗ trợ sạc pin miễn phí tại hệ thống V-GREEN và lãi suất vay cố định ưu đãi.
            </p>
            <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
              <button
                onClick={onOpenPromotions}
                className="px-5 py-2.5 rounded-xl bg-white text-[#1464F4] font-extrabold text-xs sm:text-sm hover:bg-blue-50 shadow-md transition-all active:scale-95"
              >
                Xem chi tiết ưu đãi
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center min-w-[200px]">
            <ShieldCheck size={40} className="text-blue-200 mb-2" />
            <span className="text-xs text-blue-100">Bảo hành chính hãng</span>
            <span className="text-xl font-extrabold">7 - 10 NĂM</span>
            <span className="text-[11px] text-blue-200 mt-1">Cứu hộ 24/7 toàn quốc</span>
          </div>
        </div>
      )}
    </div>
  );
};
