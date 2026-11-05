import React, { useState, useId } from 'react';
import { VINFAST_CARS, DEALERSHIP_INFO } from '../data/cars';
import { CarModel } from '../types';
import { X, Key, Calendar, MapPin, CheckCircle2, Phone, Home, Building } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '../services/leadService';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCarId?: string;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  preselectedCarId
}) => {
  const [carId, setCarId] = useState<string>(preselectedCarId || 'vf3');
  const [driveLocationType, setDriveLocationType] = useState<'home' | 'showroom'>('home');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('Bình Phước');
  const [address, setAddress] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('Sáng (08:30 - 11:30)');
  const [note, setNote] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const fullNameId = useId();
  const phoneId = useId();
  const carSelectId = useId();
  const citySelectId = useId();
  const addressId = useId();
  const dateId = useId();
  const timeSlotId = useId();
  const noteId = useId();

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (cleaned.length === 0) {
      setPhoneError('');
    } else if (!cleaned.startsWith('0') || cleaned.length !== 10) {
      setPhoneError('Vui lòng kiểm tra lại số điện thoại');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Vui lòng kiểm tra lại số điện thoại');
      return;
    }
    setPhoneError('');

    // Lưu trữ và tự động đồng bộ sang Google Sheets & Telegram
    submitLead({
      type: 'test_drive',
      typeName: 'Đăng Ký Lái Thử',
      fullName,
      phone,
      carName: selectedCar.name,
      locationType: driveLocationType === 'home' ? 'Lái thử tận nhà' : 'Tại showroom VinFast',
      city,
      address,
      preferredDate,
      timeSlot,
      note
    });

    // Cùng lưu vào key lịch sử cũ để tương thích
    try {
      const existing = JSON.parse(localStorage.getItem('vinfast_test_drives') || '[]');
      existing.unshift({
        id: Date.now(),
        createdAt: new Date().toISOString(),
        fullName,
        phone,
        carId,
        carName: selectedCar.name,
        locationType: driveLocationType === 'home' ? 'Lái thử tận nhà' : 'Tại showroom VinFast',
        city,
        address,
        preferredDate,
        timeSlot,
        note
      });
      localStorage.setItem('vinfast_test_drives', JSON.stringify(existing));
    } catch {
      // Ignore localStorage errors
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  const selectedCar = VINFAST_CARS.find((c) => c.id === carId) || VINFAST_CARS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1464F4] flex items-center justify-center text-lg">
              🔑
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Đăng Ký Lái Thử Xe Điện VinFast
              </h3>
              <p className="text-xs text-slate-500">
                Trải nghiệm êm ái, bốc ga tức thì & tính năng ADAS thông minh
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

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">
                Đăng Ký Lái Thử Thành Công!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Cảm ơn Quý khách <strong>{fullName}</strong>. Chuyên viên tư vấn của {DEALERSHIP_INFO.showroomName} sẽ liên hệ qua số điện thoại <strong>{phone}</strong> trong thời gian sớm nhất để xác nhận lịch và chuẩn bị mẫu xe <strong>{selectedCar.name}</strong> phục vụ Quý khách.
              </p>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1 text-left max-w-md mx-auto">
                <div>• Dòng xe trải nghiệm: <strong>{selectedCar.name}</strong></div>
                <div>• Hình thức: <strong>{driveLocationType === 'home' ? 'Lái thử tận nhà' : 'Tại showroom VinFast'}</strong></div>
                {address && <div>• Địa điểm: <strong>{address}, {city}</strong></div>}
                <div>• Hotline trực tiếp: <strong>{DEALERSHIP_INFO.hotline}</strong></div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#1464F4] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Drive Location Preference */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Hình thức lái thử
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDriveLocationType('home')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all text-center ${
                      driveLocationType === 'home'
                        ? 'border-[#1464F4] bg-blue-50/80 text-[#1464F4] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home size={17} className="shrink-0" />
                    <span>Lái thử tận nhà</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDriveLocationType('showroom')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all text-center ${
                      driveLocationType === 'showroom'
                        ? 'border-[#1464F4] bg-blue-50/80 text-[#1464F4] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building size={17} className="shrink-0" />
                    <span>Tại showroom VinFast</span>
                  </button>
                </div>
              </div>

              {/* Select Model */}
              <div>
                <label htmlFor={carSelectId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Dòng xe muốn trải nghiệm
                </label>
                <select
                  id={carSelectId}
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                >
                  {VINFAST_CARS.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name} ({car.segment} · {car.seats} chỗ)
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={fullNameId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={fullNameId}
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                  />
                </div>

                <div>
                  <label htmlFor={phoneId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="0912345678"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 ${
                      phoneError
                        ? 'border-red-400 focus:ring-red-400 bg-red-50/50'
                        : 'border-slate-200 focus:ring-[#1464F4]'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-[11px] text-red-500 font-bold mt-1">{phoneError}</p>
                  )}
                </div>
              </div>

              {/* Region & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label htmlFor={citySelectId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Tỉnh / Thành
                  </label>
                  <select
                    id={citySelectId}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                  >
                    <option value="Bình Phước">Bình Phước</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Tỉnh khác">Tỉnh khác</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={addressId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {driveLocationType === 'home' ? 'Địa chỉ nhận xe lái thử' : 'Ghi chú địa bàn'}
                  </label>
                  <input
                    id={addressId}
                    type="text"
                    placeholder="Số nhà, đường, phường/xã..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                  />
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={dateId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Ngày hẹn mong muốn
                  </label>
                  <input
                    id={dateId}
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                  />
                </div>

                <div>
                  <label htmlFor={timeSlotId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Khung giờ thuận tiện
                  </label>
                  <select
                    id={timeSlotId}
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                  >
                    <option value="Sáng (08:30 - 11:30)">Sáng (08:30 - 11:30)</option>
                    <option value="Chiều (14:00 - 17:30)">Chiều (14:00 - 17:30)</option>
                    <option value="Cuối tuần (Thứ 7 - CN)">Cuối tuần (Thứ 7 - Chủ Nhật)</option>
                  </select>
                </div>
              </div>

              {/* Note */}
              <div>
                <label htmlFor={noteId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Yêu cầu đặc biệt (nếu có)
                </label>
                <input
                  id={noteId}
                  type="text"
                  placeholder="Ví dụ: Muốn thử leo dốc, thử tính năng tự lùi chuồng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-[#1464F4] hover:bg-blue-600 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Key size={16} />
                <span>Xác Nhận Đặt Lịch Lái Thử Miễn Phí</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Cam kết hỗ trợ mang xe tận nơi chu đáo, không ép mua xe.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
