import React, { useState } from 'react';
import { VINFAST_CARS } from '../data/cars';
import {
  CustomerLead,
  isValidVietnamPhone,
  PHONE_VALIDATION_ERROR,
  submitCustomerLead
} from '../services/leadService';
import { X, Home, Building2, KeyRound } from 'lucide-react';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted: (lead: CustomerLead) => void;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  onLeadSubmitted
}) => {
  const [driveType, setDriveType] = useState<'home' | 'showroom'>('home');
  const [selectedCarId, setSelectedCarId] = useState<string>('vf3');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [province, setProvince] = useState<string>('Bình Phước');
  const [address, setAddress] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('Sáng (08:30 - 11:30)');
  const [specialRequest, setSpecialRequest] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên khách hàng.');
      return;
    }
    if (!isValidVietnamPhone(phone)) {
      setErrorMsg(PHONE_VALIDATION_ERROR);
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const selectedCar = VINFAST_CARS.find((c) => c.id === selectedCarId);
    const driveTypeText = driveType === 'home' ? 'Lái thử tận nhà' : 'Lái thử tại showroom VinFast';

    const lead = await submitCustomerLead({
      customerName: fullName.trim(),
      phone,
      category: 'Đăng ký lái thử',
      carModel: selectedCar ? selectedCar.name : 'VinFast',
      province,
      details: `${driveTypeText} | Khung giờ: ${timeSlot}${preferredDate ? ` | Ngày: ${preferredDate}` : ''}${address.trim() ? ` | Địa chỉ: ${address.trim()}` : ''}${specialRequest.trim() ? ` | Yêu cầu: ${specialRequest.trim()}` : ''}`
    });

    setIsSubmitting(false);
    setFullName('');
    setPhone('');
    setAddress('');
    setPreferredDate('');
    setSpecialRequest('');
    onClose();
    onLeadSubmitted(lead);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-[540px] rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F1FF] flex items-center justify-center text-xl shadow-2xs shrink-0">
              🔑
            </div>
            <div>
              <h3 className="text-base sm:text-[18px] font-extrabold text-[#0F172A] leading-snug">
                Đăng Ký Lái Thử Xe Điện VinFast
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Trải nghiệm êm ái, bốc ga tức thì & tính năng ADAS thông minh
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-200/70 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {errorMsg}
            </div>
          )}

          {/* Hình thức lái thử */}
          <div>
            <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-2">
              HÌNH THỨC LÁI THỬ
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDriveType('home')}
                className={`py-3 px-3 rounded-xl border text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  driveType === 'home'
                    ? 'border-[#1464F4] bg-[#F0F6FF] text-[#1464F4] shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Home size={15} />
                <span>Lái thử tận nhà</span>
              </button>
              <button
                type="button"
                onClick={() => setDriveType('showroom')}
                className={`py-3 px-3 rounded-xl border text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  driveType === 'showroom'
                    ? 'border-[#1464F4] bg-[#F0F6FF] text-[#1464F4] shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Building2 size={15} />
                <span>Tại showroom VinFast</span>
              </button>
            </div>
          </div>

          {/* Dòng xe muốn trải nghiệm */}
          <div>
            <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              DÒNG XE MUỐN TRẢI NGHIỆM
            </label>
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#1464F4] focus:outline-hidden transition-colors"
            >
              {VINFAST_CARS.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name} ({car.segment} · {car.seatsDisplay})
                </option>
              ))}
            </select>
          </div>

          {/* Họ và tên & Số điện thoại */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                HỌ VÀ TÊN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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

          {/* Tỉnh/Thành & Địa chỉ nhận xe lái thử */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                TỈNH / THÀNH
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm font-medium text-slate-800 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              >
                <option value="Bình Phước">Bình Phước</option>
                <option value="Đồng Nai">Đồng Nai</option>
                <option value="Đắk Lắk">Đắk Lắk</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Tỉnh/Thành khác">Tỉnh/Thành khác</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                {driveType === 'home' ? 'ĐỊA CHỈ NHẬN XE LÁI THỬ' : 'SHOWROOM MONG MUỐN'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={
                  driveType === 'home'
                    ? 'Số nhà, đường, phường/xã...'
                    : 'Nhập khu vực hoặc chi nhánh gần bạn...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Ngày hẹn mong muốn & Khung giờ thuận tiện */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                NGÀY HẸN MONG MUỐN
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                KHUNG GIỜ THUẬN TIỆN
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm font-medium text-slate-800 focus:border-[#1464F4] focus:outline-hidden transition-colors"
              >
                <option value="Sáng (08:30 - 11:30)">Sáng (08:30 - 11:30)</option>
                <option value="Chiều (13:30 - 17:00)">Chiều (13:30 - 17:00)</option>
                <option value="Cuối tuần (Thứ 7 / Chủ Nhật)">Cuối tuần (Thứ 7 / Chủ Nhật)</option>
              </select>
            </div>
          </div>

          {/* Yêu cầu đặc biệt */}
          <div>
            <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              YÊU CẦU ĐẶC BIỆT (NẾU CÓ)
            </label>
            <input
              type="text"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Ví dụ: Muốn thử leo dốc, thử tính năng tự lùi chuồng..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1464F4] hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs sm:text-sm shadow-[0_6px_20px_rgba(20,100,244,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <KeyRound size={16} />
              <span>{isSubmitting ? 'Đang gửi yêu cầu...' : 'Xác Nhận Đặt Lịch Lái Thử Miễn Phí'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
