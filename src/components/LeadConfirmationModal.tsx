import React from 'react';
import { CustomerLead } from '../services/leadService';
import { CheckCircle2, X, User, Phone, FileText, Car, Hash, MapPin } from 'lucide-react';

interface LeadConfirmationModalProps {
  lead: CustomerLead | null;
  onClose: () => void;
}

export const LeadConfirmationModal: React.FC<LeadConfirmationModalProps> = ({
  lead,
  onClose
}) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Banner */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1464F4] px-6 py-6 text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>

          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 size={30} className="text-emerald-300" />
          </div>

          <h3 className="text-lg font-extrabold tracking-tight">
            Xác Nhận Đăng Ký Thành Công!
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Hệ thống Cổng thông tin VinFast 3S đã tiếp nhận thông tin của Quý khách
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs sm:text-sm">
            <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-200/80">
              <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                <User size={14} className="text-[#1464F4]" />
                <span>Khách hàng:</span>
              </span>
              <span className="font-extrabold text-slate-900 text-right">
                {lead.customerName}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-200/80">
              <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                <Phone size={14} className="text-[#1464F4]" />
                <span>Số điện thoại:</span>
              </span>
              <span className="font-extrabold text-[#1464F4] tabular-nums text-right">
                {lead.phone}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-200/80">
              <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                <FileText size={14} className="text-[#1464F4]" />
                <span>Nhu cầu hỗ trợ:</span>
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs text-right">
                {lead.category}
              </span>
            </div>

            {lead.carModel && (
              <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-200/80">
                <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                  <Car size={14} className="text-[#1464F4]" />
                  <span>Dòng xe:</span>
                </span>
                <span className="font-bold text-slate-800 text-right">
                  {lead.carModel}
                </span>
              </div>
            )}

            {lead.licensePlate && (
              <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-200/80">
                <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                  <Hash size={14} className="text-[#1464F4]" />
                  <span>Biển số xe:</span>
                </span>
                <span className="font-bold text-slate-800 uppercase text-right">
                  {lead.licensePlate}
                </span>
              </div>
            )}

            {lead.province && (
              <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-200/80">
                <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                  <MapPin size={14} className="text-[#1464F4]" />
                  <span>Khu vực:</span>
                </span>
                <span className="font-semibold text-slate-800 text-right">
                  {lead.province}
                </span>
              </div>
            )}

            <div className="pt-0.5">
              <span className="text-slate-500 block text-xs mb-1">Chi tiết yêu cầu:</span>
              <div className="font-semibold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs leading-relaxed">
                {lead.details}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 leading-relaxed text-center font-medium">
            Chuyên viên Tư vấn <strong>VinFast 3S</strong> đã nhận được yêu cầu và sẽ liên hệ trực tiếp với Quý khách qua số điện thoại <strong>{lead.phone}</strong> trong thời gian sớm nhất!
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Hoàn Tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
