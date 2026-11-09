import React from 'react';
import { PROMOTIONS_DATA } from '../data/promotions';
import { X, Check } from 'lucide-react';

interface PromotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromotionsModal: React.FC<PromotionsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
              🎁
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Chương Trình Khuyến Mãi & Đặc Quyền VinFast
              </h3>
              <p className="text-xs text-slate-500">
                Áp dụng tại đại lý chính hãng VinFast
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {PROMOTIONS_DATA.map((promo) => (
            <div
              key={promo.id}
              className="p-5 rounded-2xl border border-slate-200/90 hover:border-blue-200 hover:shadow-xs transition-all bg-white"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-sm sm:text-base font-extrabold text-slate-900">
                  {promo.title}
                </span>
                <span className="bg-blue-50 text-[#1464F4] text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                  {promo.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                {promo.description}
              </p>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl mb-3">
                {promo.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-medium">
                  ⏳ {promo.validUntil}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
