import React, { useState } from 'react';
import { INSURANCE_PACKAGES } from '../data/accessories';
import { VINFAST_CARS } from '../data/cars';
import { formatVND } from '../utils/formatters';
import {
  CustomerLead,
  isValidVietnamPhone,
  PHONE_VALIDATION_ERROR,
  submitCustomerLead
} from '../services/leadService';
import { X, ShieldCheck, Check, Truck, BatteryCharging, Wrench, Clock } from 'lucide-react';

interface InsuranceRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted: (lead: CustomerLead) => void;
}

export const InsuranceRescueModal: React.FC<InsuranceRescueModalProps> = ({
  isOpen,
  onClose,
  onLeadSubmitted
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>('vf5');
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('ins-gold');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [licensePlateOrNote, setLicensePlateOrNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedCar = VINFAST_CARS.find((c) => c.id === selectedCarId) || VINFAST_CARS[0];
  const currentInsurance =
    INSURANCE_PACKAGES.find((i) => i.id === selectedInsuranceId) || INSURANCE_PACKAGES[0];
  const estimatedCost = Math.round((selectedCar.price * currentInsurance.ratePercent) / 100);

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

    setErrorMsg('');
    setIsSubmitting(true);

    const lead = await submitCustomerLead({
      customerName: customerName.trim(),
      phone,
      category: 'Bảo hiểm & Cứu hộ',
      carModel: selectedCar.name,
      details: `${currentInsurance.name} (~${formatVND(estimatedCost)}/năm)${licensePlateOrNote.trim() ? ` | Ghi chú: ${licensePlateOrNote.trim()}` : ''}`
    });

    setIsSubmitting(false);
    setCustomerName('');
    setPhone('');
    setLicensePlateOrNote('');
    onClose();
    onLeadSubmitted(lead);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[93vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1464F4] flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Bảo Hiểm Vật Chất & Cứu Hộ 24/7 VinFast
              </h3>
              <p className="text-xs text-slate-500">
                An tâm vận hành trên mọi hành trình với dịch vụ hậu mãi chuẩn 3S
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* 1. Đặc quyền Cứu hộ 24/7 */}
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-3">
              <Truck size={17} className="text-[#1464F4]" />
              <span>Đặc Quyền Cứu Hộ Kỹ Thuật & Cứu Hộ Pin 24/7 Toàn Quốc</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#1464F4]">
                  <Clock size={15} />
                  <span>Cứu hộ kỹ thuật 24/7</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Miễn phí cẩu kéo xe về Xưởng dịch vụ VinFast gần nhất khi xảy ra sự cố kỹ thuật trong suốt thời gian bảo hành chính hãng.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700">
                  <BatteryCharging size={15} />
                  <span>Cứu hộ pin lưu động</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Hỗ trợ sạc pin lưu động hoặc vận chuyển xe tới trạm sạc V-GREEN gần nhất khi xe hết pin giữa đường.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-purple-700">
                  <Wrench size={15} />
                  <span>Sửa chữa lưu động (Mobile Service)</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Kỹ thuật viên VinFast hỗ trợ kiểm tra, bảo dưỡng định kỳ các hạng mục cơ bản tận nơi theo lịch hẹn.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Chọn dòng xe để tính phí bảo hiểm thân vỏ */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <span>🛡️</span>
                <span>Tính Phí Bảo Hiểm Thân Vỏ 2 Chiều Chính Hãng</span>
              </div>
              <span className="text-xs text-slate-500">
                Sửa chữa & thay thế phụ tùng chính hãng 100%
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Chọn dòng xe cần tra cứu phí bảo hiểm
              </label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 focus:border-[#1464F4] focus:outline-hidden"
              >
                {VINFAST_CARS.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} — Giá niêm yết: {formatVND(car.price)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {INSURANCE_PACKAGES.map((ins) => {
                const isSelected = selectedInsuranceId === ins.id;
                const cost = Math.round((selectedCar.price * ins.ratePercent) / 100);

                return (
                  <div
                    key={ins.id}
                    onClick={() => setSelectedInsuranceId(ins.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1464F4] bg-blue-50/60 ring-2 ring-blue-100 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{ins.name}</span>
                      <span
                        className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs ${
                          isSelected ? 'bg-[#1464F4] text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                      {ins.description}
                    </p>
                    <div className="text-[10.5px] text-slate-500 mt-1.5 font-medium">
                      Đơn vị: {ins.provider}
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500">
                        Phí 1 năm ({ins.ratePercent}%):
                      </span>
                      <span className="text-sm font-extrabold text-[#1464F4] tabular-nums">
                        ~{formatVND(cost)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Thông tin khách hàng đăng ký tư vấn bảo hiểm / cứu hộ */}
          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
            <span className="block text-xs font-extrabold text-slate-800 uppercase">
              Thông tin khách hàng nhận báo giá bảo hiểm & hỗ trợ
            </span>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  HỌ VÀ TÊN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  SỐ ĐIỆN THOẠI (10 SỐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={12}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  BIỂN SỐ XE / GHI CHÚ
                </label>
                <input
                  type="text"
                  value={licensePlateOrNote}
                  onChange={(e) => setLicensePlateOrNote(e.target.value)}
                  placeholder="Biển số hoặc ghi chú thêm..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">
                Phí bảo hiểm dự tính cho <strong>{selectedCar.name}</strong>:
              </div>
              <div className="text-lg font-extrabold text-[#1464F4] tabular-nums">
                {formatVND(estimatedCost)} / năm
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#1464F4] hover:bg-blue-600 disabled:bg-blue-400 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? 'Đang gửi...' : 'Xác Nhận Chọn Gói Bảo Hiểm'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
