import React, { useState } from 'react';
import { DEALERSHIP_INFO } from '../data/cars';
import { formatVND } from '../utils/formatters';
import { X, Car, Check, Calendar, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestRentalQuote: (carName: string, days: number) => void;
}

const RENTAL_MODELS = [
  {
    id: 'vf5',
    name: 'VinFast VF 5 Plus',
    segment: 'A-SUV 5 Chỗ',
    dailyRate: 450000,
    monthlyRate: 10500000,
    freeKm: '300 km/ngày',
    highlight: 'Rất tiết kiệm, nội đô linh hoạt',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'vf6',
    name: 'VinFast VF 6 Plus',
    segment: 'B-SUV 5 Chỗ',
    dailyRate: 650000,
    monthlyRate: 15500000,
    freeKm: '350 km/ngày',
    highlight: 'Nội thất da cao cấp, êm ái',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'vf8',
    name: 'VinFast VF 8 Plus',
    segment: 'D-SUV 5 Chỗ AWD',
    dailyRate: 950000,
    monthlyRate: 23000000,
    freeKm: '400 km/ngày',
    highlight: '402 mã lực, trợ lý ảo Vivi, ADAS',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'vf9',
    name: 'VinFast VF 9 Plus',
    segment: 'E-SUV 7 Chỗ Hạng Sang',
    dailyRate: 1550000,
    monthlyRate: 36000000,
    freeKm: '450 km/ngày',
    highlight: 'Ghế cơ trưởng massage, đẳng cấp VIP',
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=400&q=80'
  }
];

export const RentalModal: React.FC<RentalModalProps> = ({
  isOpen,
  onClose,
  onRequestRentalQuote
}) => {
  const [selectedRentalCar, setSelectedRentalCar] = useState<string>('vf5');
  const [rentalDays, setRentalDays] = useState<number>(3);

  if (!isOpen) return null;

  const currentCar = RENTAL_MODELS.find((m) => m.id === selectedRentalCar) || RENTAL_MODELS[0];
  const estimatedCost = currentCar.dailyRate * rentalDays;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
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
                Trải nghiệm thực tế 1-7 ngày trước khi quyết định mua xe chính thức
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
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Procedure benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Giao xe tận nhà tại Bình Phước & Đồng Nai</span>
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
              Chọn dòng xe trải nghiệm
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
                      className="w-20 h-16 object-cover rounded-xl shrink-0"
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
              <span>Thời gian thuê xe:</span>
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

          {/* Refund policy note */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <strong>Chính sách đặc quyền:</strong> Nếu sau chuyến đi trải nghiệm, Quý khách quyết định đặt cọc mua xe mới tại {DEALERSHIP_INFO.showroomName}, toàn bộ chi phí thuê xe sẽ được trừ trực tiếp vào giá xe mới!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Thủ tục: CCCD gắn chip + Bằng lái xe B2/B1 hợp lệ
          </div>
          <button
            onClick={() => {
              onRequestRentalQuote(currentCar.name, rentalDays);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Yêu Cầu Giữ Xe Trải Nghiệm</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
