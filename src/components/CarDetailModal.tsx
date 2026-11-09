import React, { useState } from 'react';
import { CarModel } from '../types';
import { formatMillionVND, formatVND, formatNumber, getColorBackgroundStyle } from '../utils/formatters';
import {
  X,
  Zap,
  BatteryCharging,
  Gauge,
  Users,
  ShieldCheck,
  Calculator,
  Check
} from 'lucide-react';

interface CarDetailModalProps {
  car: CarModel | null;
  onClose: () => void;
  onOpenCalculator: (car: CarModel) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  onOpenCalculator
}) => {
  if (!car) return null;

  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const activeColor = car.colors[selectedColorIndex] || car.colors[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1464F4] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {car.segment} · {car.seats} Chỗ
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {car.bodyType}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Visual & Title */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {car.name}
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  {car.tagline}
                </p>
              </div>
              {car.versionBadge && (
                <span className="self-start sm:self-auto bg-blue-50 text-[#1464F4] text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  {car.versionBadge}
                </span>
              )}
            </div>

            {/* Photo Banner Container */}
            <div className="w-full h-56 sm:h-72 rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-800/80 shadow-md flex items-center justify-center">
              <img
                src={car.bannerUrl || car.imageUrl}
                alt={car.name}
                className={`w-full h-full ${
                  car.bannerUrl
                    ? 'object-cover object-center'
                    : 'object-contain p-4 drop-shadow-xl'
                }`}
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-4 sm:p-5">
                <div className="text-white flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center gap-1.5 font-bold bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                    <Zap size={13} className="text-amber-400" />
                    Tầm hoạt động: {car.rangeDisplay || `${car.rangePerCharge} km`}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                    <BatteryCharging size={13} className="text-emerald-400" />
                    Pin: {car.batteryDisplay || `${car.batteryCapacity} kWh`}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                    <Gauge size={13} className="text-blue-300" />
                    {car.powerKw ? `${car.powerKw} (${car.horsepower} Hp)` : `${car.horsepower} Hp`}{car.drivetrain && car.drivetrain !== 'Đang cập nhật' ? ` · ${car.drivetrain}` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Selector */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase text-slate-700">
                Bộ sưu tập màu sắc ngoại thất
              </span>
              <span className="text-xs font-bold text-[#1464F4]">
                {activeColor.name}
                {activeColor.extraFee && activeColor.extraFee > 0 ? ` (+${formatMillionVND(activeColor.extraFee)})` : ''}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {car.colors.map((color, idx) => {
                const isSelected = selectedColorIndex === idx;
                const isWhiteOrLight =
                  color.hex.toLowerCase() === '#ffffff' ||
                  color.hex.toLowerCase() === '#f8fafc' ||
                  color.name.toLowerCase().includes('trắng');
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    title={`${color.name}${color.extraFee ? ` (+${formatMillionVND(color.extraFee)})` : ''}`}
                    className={`w-9 h-9 rounded-full relative flex items-center justify-center transition-all ${
                      isWhiteOrLight
                        ? 'border-2 border-slate-400 shadow-xs'
                        : 'border-2 border-slate-200 shadow-2xs'
                    } ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-[#1464F4] scale-110 shadow-md !border-[#1464F4]'
                        : 'hover:scale-105 opacity-90 hover:opacity-100 hover:border-slate-400'
                    }`}
                    style={getColorBackgroundStyle(color.hex, color.roofHex)}
                  >
                    {isSelected && (
                      <span className={`w-2.5 h-2.5 rounded-full ${isWhiteOrLight ? 'bg-slate-900' : 'bg-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Versions if available */}
          {car.versions && (
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span>Phiên bản cung cấp:</span>
              <span className="font-bold text-[#1464F4]">{car.versions}</span>
            </div>
          )}

          {/* Pricing Box - GIÁ BÁN NIÊM YẾT */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1464F4] uppercase tracking-wider">
                  GIÁ BÁN NIÊM YẾT
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1 tabular-nums">
                {car.versionPrices && car.versionPrices.length > 1
                  ? `Từ ${formatMillionVND(car.price)}`
                  : formatVND(car.price)}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                ✓ {car.warrantyBattery ? `Bảo hành pin ${car.warrantyBattery}` : 'Bảo hành pin 7 - 10 năm chính hãng'} · Miễn 100% lệ phí trước bạ
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-blue-200 sm:pl-4">
              <span className="text-xs text-slate-600 block">Ước tính trả góp từ:</span>
              <span className="text-lg font-extrabold text-[#1464F4] tabular-nums">
                ~{formatNumber(car.monthlyInstallmentEstimate)} đ/tháng
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Vay tới 80% trong 8 năm</span>
            </div>
          </div>

          {/* Bảng giá niêm yết chi tiết theo từng phiên bản */}
          {car.versionPrices && car.versionPrices.length > 1 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Bảng giá theo từng phiên bản
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  (Đã gồm VAT)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {car.versionPrices.map((vp) => (
                  <div
                    key={vp.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs"
                  >
                    <span className="font-bold text-slate-800">{vp.name}</span>
                    <span className="font-extrabold text-[#1464F4] tabular-nums text-sm">
                      {formatVND(vp.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description & Key Features */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase">
              Đặc điểm nổi bật & Công nghệ tiên phong
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {car.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {car.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check size={14} className="text-[#1464F4] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase mb-2">
              Thông số kỹ thuật chi tiết
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-2 p-2.5 bg-slate-50 font-bold text-slate-700">
                <span>Thông số</span>
                <span>Giá trị</span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-slate-500">Dung lượng pin (Khả dụng)</span>
                <span className="font-bold text-slate-800">{car.batteryDisplay || `${car.batteryCapacity} kWh`}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-slate-500">
                  {car.id === 'vfwild' ? 'Quãng đường hỗn hợp' : 'Quãng đường chuẩn 1 lần sạc'}
                </span>
                <span className="font-bold text-[#1464F4]">
                  {car.rangeDisplay
                    ? (car.rangeDisplay.includes('/') || car.rangeDisplay.includes('hỗn hợp')
                        ? car.rangeDisplay
                        : `${car.rangeDisplay}/lần sạc`)
                    : (car.rangeText || `${car.rangePerCharge} km`)}
                </span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-slate-500">Công suất động cơ</span>
                <span className="font-bold text-slate-800">{car.powerKw ? `${car.powerKw} (${car.horsepower} Hp)` : `${car.horsepower} Mã lực (Hp)`}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-slate-500">Số chỗ ngồi</span>
                <span className="font-bold text-slate-800">{car.seatsDisplay || `${car.seats} chỗ`}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-slate-500">Mô-men xoắn cực đại</span>
                <span className="font-bold text-slate-800">{car.torque} Nm</span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-slate-500">Hệ dẫn động</span>
                <span className="font-bold text-slate-800">{car.drivetrain}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-slate-500">Thời gian sạc nhanh 10% - 70%</span>
                <span className="font-bold text-emerald-600">{car.chargingTimeFast}</span>
              </div>
              {car.dimensions && (
                <div className="grid grid-cols-2 p-2.5">
                  <span className="text-slate-500">Kích thước tổng thể (D x R x C)</span>
                  <span className="font-bold text-slate-800">{car.dimensions}</span>
                </div>
              )}
              {car.wheelbase && (
                <div className="grid grid-cols-2 p-2.5">
                  <span className="text-slate-500">Chiều dài cơ sở</span>
                  <span className="font-bold text-slate-800">{car.wheelbase}</span>
                </div>
              )}
              {car.groundClearance && (
                <div className="grid grid-cols-2 p-2.5">
                  <span className="text-slate-500">Khoảng sáng gầm xe</span>
                  <span className="font-bold text-slate-800">{car.groundClearance}</span>
                </div>
              )}
              {car.topSpeed && (
                <div className="grid grid-cols-2 p-2.5">
                  <span className="text-slate-500">Tốc độ tối đa</span>
                  <span className="font-bold text-slate-800">{car.topSpeed}</span>
                </div>
              )}
              {car.wheelSize && (
                <div className="grid grid-cols-2 p-2.5">
                  <span className="text-slate-500">Kích thước mâm / lốp</span>
                  <span className="font-bold text-slate-800">{car.wheelSize}</span>
                </div>
              )}
              {car.warrantyCar && (
                <div className="grid grid-cols-2 p-2.5">
                  <span className="text-slate-500">Bảo hành xe</span>
                  <span className="font-bold text-slate-800">{car.warrantyCar}</span>
                </div>
              )}
              {car.warrantyBattery && (
                <div className="grid grid-cols-2 p-2.5">
                  <span className="text-slate-500">Bảo hành pin</span>
                  <span className="font-bold text-emerald-700">{car.warrantyBattery}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => {
              onOpenCalculator(car);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calculator size={14} />
            <span>Dự toán lăn bánh & Trả góp</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
