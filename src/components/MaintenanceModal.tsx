import React, { useState } from 'react';
import { VINFAST_CARS } from '../data/cars';
import {
  CustomerLead,
  isValidVietnamPhone,
  PHONE_VALIDATION_ERROR,
  submitCustomerLead
} from '../services/leadService';
import { X, Wrench, Sparkles, CheckCircle2, CalendarClock } from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted: (lead: CustomerLead) => void;
}

const MAINTENANCE_MILESTONES = [
  'Mốc 12.000 km (hoặc 1 năm)',
  'Mốc 24.000 km (hoặc 2 năm)',
  'Mốc 36.000 km (hoặc 3 năm)',
  'Mốc 48.000 km (hoặc 4 năm)',
  'Mốc 60.000 km (hoặc 5 năm)',
  'Mốc 72.000 km (hoặc 6 năm)',
  'Trên 80.000 km / Kiểm tra tổng quát'
];

const OTHER_REPAIR_TYPES = [
  'Đồng sơn / Xử lý trầy xước, va quẹt',
  'Thay đèn / Nâng cấp hệ thống chiếu sáng',
  'Kiểm tra gầm / Lốp / Phanh / Cân chỉnh thước lái',
  'Kiểm tra hệ thống Điện / Điều hòa / Cập nhật phần mềm',
  'Thay thế phụ tùng / Hạng mục sửa chữa khác'
];

const EXTRA_CAR_MODELS = [
  ...VINFAST_CARS.map((c) => c.name),
  'VinFast Fadil',
  'VinFast Lux A2.0',
  'VinFast Lux SA2.0',
  'VinFast VF e34'
];

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  onLeadSubmitted
}) => {
  const [serviceTab, setServiceTab] = useState<'periodic' | 'other'>('periodic');

  const [customerName, setCustomerName] = useState<string>('');
  const [selectedCarName, setSelectedCarName] = useState<string>('VinFast VF 5');
  const [milestone, setMilestone] = useState<string>(MAINTENANCE_MILESTONES[0]);
  const [otherServiceType, setOtherServiceType] = useState<string>(OTHER_REPAIR_TYPES[0]);
  const [otherDescription, setOtherDescription] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên khách hàng.');
      return;
    }
    if (!isValidVietnamPhone(phone)) {
      setErrorMsg(PHONE_VALIDATION_ERROR);
      return;
    }
    if (!licensePlate.trim()) {
      setErrorMsg('Vui lòng nhập Biển số xe để Xưởng dịch vụ tra cứu hồ sơ.');
      return;
    }
    if (serviceTab === 'other' && !otherDescription.trim() && !otherServiceType) {
      setErrorMsg('Vui lòng chọn hoặc nhập nội dung cần sửa chữa / thay thế.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const detailsText =
      serviceTab === 'periodic'
        ? `Bảo dưỡng định kỳ: ${milestone}${preferredDate ? ` | Ngày hẹn: ${preferredDate}` : ''}`
        : `Hạng mục: ${otherServiceType}${otherDescription.trim() ? ` | Chi tiết: ${otherDescription.trim()}` : ''}${preferredDate ? ` | Ngày hẹn: ${preferredDate}` : ''}`;

    const lead = await submitCustomerLead({
      customerName: customerName.trim(),
      phone,
      category: serviceTab === 'periodic' ? 'Đặt lịch bảo dưỡng' : 'Sửa chữa & Đồng sơn',
      carModel: selectedCarName,
      licensePlate: licensePlate.trim().toUpperCase(),
      details: detailsText
    });

    setIsSubmitting(false);
    setCustomerName('');
    setPhone('');
    setLicensePlate('');
    setOtherDescription('');
    setPreferredDate('');
    onClose();
    onLeadSubmitted(lead);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-[560px] rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-[#1464F4] flex items-center justify-center shrink-0">
              <CalendarClock size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-[18px] font-extrabold text-[#0F172A] leading-snug">
                Đặt Lịch Bảo Dưỡng & Dịch Vụ Xưởng 3S
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tiếp nhận ưu tiên tại Xưởng dịch vụ chính hãng VinFast 3S
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Chuyển đổi giữa Bảo dưỡng định kỳ và Mục khác (Thay đèn, Đồng sơn, Sửa chữa...) */}
          <div>
            <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-2">
              CHỌN NHU CẦU DỊCH VỤ
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setServiceTab('periodic');
                  setErrorMsg('');
                }}
                className={`py-3 px-3.5 rounded-xl border text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  serviceTab === 'periodic'
                    ? 'border-[#1464F4] bg-[#F0F6FF] text-[#1464F4] shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Wrench size={15} />
                <span>Bảo dưỡng định kỳ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setServiceTab('other');
                  setErrorMsg('');
                }}
                className={`py-3 px-3.5 rounded-xl border text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  serviceTab === 'other'
                    ? 'border-[#1464F4] bg-[#F0F6FF] text-[#1464F4] shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Sparkles size={15} />
                <span>Mục khác (Đồng sơn, Thay đèn...)</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {errorMsg}
            </div>
          )}

          {/* Chọn dòng xe bảo dưỡng */}
          <div>
            <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              CHỌN DÒNG XE BẢO DƯỠNG / DỊCH VỤ <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCarName}
              onChange={(e) => setSelectedCarName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#1464F4] focus:outline-hidden transition-colors"
            >
              {EXTRA_CAR_MODELS.map((carName) => (
                <option key={carName} value={carName}>
                  {carName}
                </option>
              ))}
            </select>
          </div>

          {/* Nội dung theo tab */}
          {serviceTab === 'periodic' ? (
            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                CHỌN MỐC BẢO DƯỠNG <span className="text-red-500">*</span>
              </label>
              <select
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              >
                {MAINTENANCE_MILESTONES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3.5 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div>
                <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  HẠNG MỤC CẦN LÀM (KHÔNG BẢO DƯỠNG ĐỊNH KỲ) <span className="text-red-500">*</span>
                </label>
                <select
                  value={otherServiceType}
                  onChange={(e) => setOtherServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#1464F4] focus:outline-hidden transition-colors"
                >
                  {OTHER_REPAIR_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  MÔ TẢ YÊU CẦU CỤ THỂ (THAY ĐÈN, ĐỒNG SƠN, PHỤ TÙNG...)
                </label>
                <input
                  type="text"
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  placeholder="Ví dụ: Muốn thay đèn pha, làm đồng sơn cản trước, kiểm tra điều hòa..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden transition-colors"
                />
              </div>
            </div>
          )}

          {/* Họ và tên & Số điện thoại */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                HỌ VÀ TÊN KHÁCH HÀNG <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                SỐ ĐIỆN THOẠI (10 SỐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                maxLength={12}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Biển số xe & Ngày dự kiến */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                BIỂN SỐ XE <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="Ví dụ: 93A-123.45"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm font-bold uppercase text-slate-800 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                NGÀY DỰ KIẾN ĐƯA XE ĐẾN (TÙY CHỌN)
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Nút Xác nhận */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1464F4] hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs sm:text-sm shadow-[0_6px_20px_rgba(20,100,244,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <CheckCircle2 size={17} />
              <span>
                {isSubmitting
                  ? 'Đang gửi yêu cầu...'
                  : serviceTab === 'periodic'
                  ? 'Xác Nhận Đặt Lịch Bảo Dưỡng'
                  : 'Xác Nhận Đặt Lịch Đồng Sơn / Sửa Chữa'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
