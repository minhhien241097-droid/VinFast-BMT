import React, { useState } from 'react';
import { DEALERSHIP_INFO, DealershipConfig } from '../data/cars';
import { formatVND } from '../utils/formatters';
import {
  CustomerLead,
  isValidVietnamPhone,
  PHONE_VALIDATION_ERROR,
  submitCustomerLead
} from '../services/leadService';
import { X, Check, ArrowRight } from 'lucide-react';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted: (lead: CustomerLead) => void;
  dealership?: DealershipConfig;
}

const RENTAL_MODELS = [
  {
    id: 'vf3',
    name: 'VinFast VF 3',
    segment: 'Mini-eSUV 4 Chỗ',
    dailyRate: 390000,
    monthlyRate: 9000000,
    freeKm: '250 km/ngày',
    highlight: 'Nhỏ gọn cá tính, linh hoạt đô thị',
    image: '/assets/aistudio/vinfast-vf3-mau-vang-menu_89eac25c.webp'
  },
  {
    id: 'vf5',
    name: 'VinFast VF 5 Plus',
    segment: 'A-SUV 5 Chỗ',
    dailyRate: 450000,
    monthlyRate: 10500000,
    freeKm: '300 km/ngày',
    highlight: 'Rất tiết kiệm, nội đô linh hoạt',
    image: '/assets/aistudio/vinfast-vf5-mau-xam-menu_137a54cb.webp'
  },
  {
    id: 'vf6',
    name: 'VinFast VF 6 Plus',
    segment: 'B-SUV 5 Chỗ',
    dailyRate: 650000,
    monthlyRate: 15500000,
    freeKm: '350 km/ngày',
    highlight: 'Nội thất da cao cấp, êm ái',
    image: '/assets/aistudio/vinfast-vf6-mau-do-menu_24b654e8.webp'
  },
  {
    id: 'vf8',
    name: 'VinFast VF 8 Plus',
    segment: 'D-SUV 5 Chỗ AWD',
    dailyRate: 950000,
    monthlyRate: 23000000,
    freeKm: '400 km/ngày',
    highlight: '402 mã lực, trợ lý ảo Vivi, ADAS',
    image: '/assets/aistudio/vinfast-vf8-mau-xanh-menu_e6324173.webp'
  }
];

export const RentalModal: React.FC<RentalModalProps> = ({
  isOpen,
  onClose,
  onLeadSubmitted,
  dealership = DEALERSHIP_INFO
}) => {
  const [selectedRentalCar, setSelectedRentalCar] = useState<string>('vf5');
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [addressOrNote, setAddressOrNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentCar = RENTAL_MODELS.find((m) => m.id === selectedRentalCar) || RENTAL_MODELS[0];
  const estimatedCost = currentCar.dailyRate * rentalDays;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên khách hàng để giữ xe.');
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
      category: 'Thuê xe trải nghiệm',
      carModel: currentCar.name,
      details: `Thuê ${rentalDays} ngày (~${formatVND(estimatedCost)})${pickupDate ? ` | Nhận xe: ${pickupDate}` : ''}${addressOrNote.trim() ? ` | Ghi chú: ${addressOrNote.trim()}` : ''}`
    });

    setIsSubmitting(false);
    setCustomerName('');
    setPhone('');
    setPickupDate('');
    setAddressOrNote('');
    onClose();
    onLeadSubmitted(lead);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[93vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1464F4] flex items-center justify-center text-lg">
              🚙
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Thuê Xe Điện Trải Nghiệm Tự Lái
              </h3>
              <p className="text-xs text-slate-500">
                Trải nghiệm thực tế 1-14 ngày trước khi quyết định mua xe chính thức
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
          {/* Procedure benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Hỗ trợ giao nhận xe tận nơi nhanh chóng</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Bảo hiểm 2 chiều & miễn phí sạc pin</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Hoàn 100% tiền thuê nếu chốt mua xe!</span>
            </div>
          </div>

          {/* Model list */}
          <div className="space-y-2.5">
            <span className="block text-xs font-bold text-slate-700 uppercase">
              1. Chọn dòng xe trải nghiệm
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RENTAL_MODELS.map((car) => {
                const isSelected = selectedRentalCar === car.id;
                return (
                  <div
                    key={car.id}
                    onClick={() => setSelectedRentalCar(car.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex gap-3 ${
                      isSelected
                        ? 'border-[#1464F4] bg-blue-50/50 ring-2 ring-blue-100 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-20 h-16 object-contain rounded-xl shrink-0 bg-slate-50 p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {car.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{car.segment}</div>
                      <div className="text-xs font-bold text-[#1464F4] mt-1 tabular-nums">
                        {formatVND(car.dailyRate)} / ngày
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>2. Thời gian thuê xe:</span>
              <span className="text-sm font-extrabold text-[#1464F4]">{rentalDays} ngày</span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              value={rentalDays}
              onChange={(e) => setRentalDays(Number(e.target.value))}
              className="w-full accent-[#1464F4] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 ngày</span>
              <span>3 ngày (Phổ biến)</span>
              <span>7 ngày</span>
              <span>14 ngày</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-600">Dự tính tổng chi phí ({rentalDays} ngày):</span>
              <span className="text-base font-extrabold text-[#1464F4] tabular-nums">
                {formatVND(estimatedCost)}
              </span>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3.5">
            <span className="block text-xs font-extrabold text-slate-800 uppercase">
              3. Thông tin khách hàng đặt giữ xe
            </span>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  HỌ VÀ TÊN KHÁCH HÀNG <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  NGÀY DỰ KIẾN NHẬN XE
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:border-[#1464F4] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  ĐỊA CHỈ NHẬN XE / GHI CHÚ
                </label>
                <input
                  type="text"
                  value={addressOrNote}
                  onChange={(e) => setAddressOrNote(e.target.value)}
                  placeholder="Nhận tại showroom hoặc giao tận nhà..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1464F4] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Refund policy note */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <strong>Chính sách đặc quyền:</strong> Nếu sau chuyến đi trải nghiệm, Quý khách quyết định đặt cọc mua xe mới tại {dealership.showroomName}, toàn bộ chi phí thuê xe sẽ được trừ trực tiếp vào giá xe mới!
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Thủ tục: CCCD gắn chip + Bằng lái xe hợp lệ
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-[#1464F4] hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isSubmitting ? 'Đang gửi yêu cầu...' : 'Xác Nhận Yêu Cầu Giữ Xe Trải Nghiệm'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
