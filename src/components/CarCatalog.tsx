import React, { useState } from 'react';
import { VINFAST_CARS } from '../data/cars';
import { CarModel } from '../types';
import { formatMillionVND, formatNumber, getColorBackgroundStyle } from '../utils/formatters';
import { Zap, ChevronRight, Calculator } from 'lucide-react';

interface CarCatalogProps {
  onSelectCarDetail: (car: CarModel) => void;
  onOpenCalculatorForCar: (car: CarModel) => void;
  highlightedCarId?: string | null;
}

export const CarCatalog: React.FC<CarCatalogProps> = ({
  onSelectCarDetail,
  onOpenCalculatorForCar,
  highlightedCarId
}) => {
  const [filter, setFilter] = useState<string | null>(null);

  const filterTabs = [
    { id: 'mini', label: 'Mini đô thị' },
    { id: 'suv5', label: 'Xe 5 chỗ' },
    { id: 'suv7', label: 'Xe 7 chỗ' },
    { id: 'pickup', label: 'Xe bán tải' },
    { id: 'service', label: 'Xe dịch vụ' }
  ];

  const filteredCars = filter === null
    ? (['vf3', 'vf8_thm', 'vfwild']
        .map((id) => VINFAST_CARS.find((c) => c.id === id))
        .filter(Boolean) as CarModel[])
    : VINFAST_CARS.filter((car) => {
        if (filter === 'mini') {
          return car.categoryGroup === 'mini' || car.id === 'miniogreen';
        }
        if (filter === 'suv5') {
          return car.categoryGroup === 'suv5';
        }
        if (filter === 'suv7') {
          // VF MPV 7, Limo Green và VF 9 xuất hiện ở phân khúc Xe 7 chỗ
          return car.id === 'mpv7' || car.id === 'limogreen' || car.id === 'vf9';
        }
        if (filter === 'pickup') return car.categoryGroup === 'pickup';
        if (filter === 'service') {
          // Minio Green, EC Van và Limo Green xuất hiện ở mục Xe dịch vụ
          return car.categoryGroup === 'service' || car.id === 'limogreen';
        }
        return true;
      });

  return (
    <section id="danh-sach-xe" className="mt-2">
      {/* Horizontal Category Selector */}
      <div className="flex items-center justify-start sm:justify-center mb-5 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200/80 rounded-2xl overflow-x-auto shrink-0 shadow-2xs">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(isActive ? null : tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1464F4] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCars.map((car) => {
          const isHighlighted = highlightedCarId === car.id;

          return (
            <div
              key={car.id}
              id={car.id}
              className={`bg-white rounded-[20px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isHighlighted
                  ? 'border-[#1464F4] ring-2 ring-blue-100'
                  : 'border-slate-100 hover:border-blue-100'
              }`}
            >
              {/* Header Info */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1464F4]">
                      {car.segment} · {car.seats} Chỗ
                    </span>
                    <h3 className="text-lg font-extrabold text-[#0F172A] leading-tight">
                      {car.name}
                    </h3>
                  </div>
                  {car.versionBadge && (
                    <span className="bg-blue-50 text-[#1464F4] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100 whitespace-nowrap shrink-0">
                      {car.versionBadge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {car.description}
                </p>

                {/* Car Image Preview */}
                <div
                  onClick={() => onSelectCarDetail(car)}
                  className="w-full h-44 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/70 overflow-hidden relative cursor-pointer group mb-3 flex items-center justify-center border border-slate-100 p-2.5"
                >
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      Xem chi tiết xe & màu sắc <ChevronRight size={14} />
                    </span>
                  </div>

                  {/* Range badge */}
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <Zap size={11} className="text-amber-400" />
                    <span>{car.rangeDisplay || `${car.rangePerCharge} km`}</span>
                  </div>
                </div>

                {/* Technical Specs Pill Bar (3 thông số: Pin, Số chỗ ngồi, Công suất) */}
                <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-slate-50 border border-slate-100 rounded-xl mb-3 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Pin</div>
                    <div className="font-bold text-slate-800 tabular-nums">
                      {car.batteryDisplay || `${car.batteryCapacity} kWh`}
                    </div>
                  </div>
                  <div className="border-x border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Số chỗ ngồi</div>
                    <div className="font-bold text-slate-800">
                      {car.seatsDisplay || `${car.seats} chỗ`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Công suất</div>
                    <div className="font-bold text-[#1464F4] tabular-nums">
                      {car.powerKw || `${car.horsepower} hp`}
                    </div>
                  </div>
                </div>

                {/* Color Swatches Strip (Chỉ 1 hàng duy nhất, ô cuối có dấu + nếu nhiều màu) */}
                <div className="mb-3.5 px-0.5">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500 font-bold">Màu sắc ({car.colors.length}):</span>
                    <button
                      type="button"
                      onClick={() => onSelectCarDetail(car)}
                      className="text-[10.5px] text-[#1464F4] font-semibold hover:underline cursor-pointer"
                    >
                      Xem tất cả →
                    </button>
                  </div>
                  {(() => {
                    const MAX_DISPLAY = 6;
                    const hasMore = car.colors.length > MAX_DISPLAY;
                    const initialColors = hasMore ? car.colors.slice(0, MAX_DISPLAY - 1) : car.colors;
                    const overflowColor = hasMore ? car.colors[MAX_DISPLAY - 1] : null;
                    const remainingCount = car.colors.length - (MAX_DISPLAY - 1);

                    return (
                      <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
                        {initialColors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => onSelectCarDetail(car)}
                            title={`${color.name}${color.extraFee ? ` (+${formatMillionVND(color.extraFee)})` : ''}`}
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs hover:scale-115 transition-transform cursor-pointer relative shrink-0"
                            style={getColorBackgroundStyle(color.hex, color.roofHex)}
                          />
                        ))}

                        {hasMore && overflowColor && (
                          <button
                            type="button"
                            onClick={() => onSelectCarDetail(car)}
                            title={`Xem thêm ${remainingCount} màu khác (+${remainingCount})`}
                            className="w-5 h-5 rounded-full border border-slate-400/90 shadow-2xs hover:scale-115 transition-transform cursor-pointer relative flex items-center justify-center shrink-0 overflow-hidden group"
                            style={getColorBackgroundStyle(overflowColor.hex, overflowColor.roofHex)}
                          >
                            <span className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-colors flex items-center justify-center text-white text-[10px] font-black leading-none drop-shadow-xs">
                              +
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Price Display */}
                <div className="mb-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/70 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-600">Giá bán:</span>
                  <span className="text-lg font-extrabold text-[#1464F4] tabular-nums">
                    {car.versionPrices && car.versionPrices.length > 1
                      ? `Từ ${formatMillionVND(car.price)}`
                      : formatMillionVND(car.price)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCalculatorForCar(car)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#1464F4] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Calculator size={14} />
                  <span>Dự toán lăn bánh & Trả góp</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectCarDetail(car)}
                  className="w-full py-2 px-3 border border-slate-200 hover:border-[#1464F4] hover:text-[#1464F4] text-slate-700 rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
                >
                  Khám phá thông số & Màu xe →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
