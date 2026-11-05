import React, { useState, useId } from 'react';
import { VINFAST_CARS } from '../data/cars';
import { CarModel } from '../types';
import { formatVND, formatMillionVND, getColorBackgroundStyle } from '../utils/formatters';
import {
  X,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Send,
  HelpCircle,
  Gift
} from 'lucide-react';
import {
  CAR_COLORS_CONFIG,
  CarColorOption,
  SelectedPromotion,
  calculatePromotionDiscount,
  calculateRollingCosts
} from '../data/pricingConfig';

interface LoanCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCarId?: string;
  onRequestQuoteWithCalculation: (car: CarModel, details: any) => void;
}

export const LoanCalculatorModal: React.FC<LoanCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialCarId,
  onRequestQuoteWithCalculation
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>(initialCarId || 'vf3');
  const [selectedVersionName, setSelectedVersionName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Ưu đãi tùy chọn bổ sung: 'none' (mặc định Vì tương lai xanh 2), 'military' (Công an/Quân đội), 'voucher' (Voucher VinFast)
  const [promoCategory, setPromoCategory] = useState<'none' | 'military' | 'voucher'>('none');
  const [voucherType, setVoucherType] = useState<'fadil' | 'lux_a' | 'lux_sa'>('fadil');

  const [loanPercent, setLoanPercent] = useState<number>(75); // 75% loan
  const [loanMonths, setLoanMonths] = useState<number>(72); // 6 years
  const [interestRateYear, setInterestRateYear] = useState<number>(7.5); // 7.5% per annum
  const [activeTab, setActiveTab] = useState<'onRoad' | 'installment'>('onRoad');
  const selectCarId = useId();

  if (!isOpen) return null;

  const currentCar = VINFAST_CARS.find((c) => c.id === selectedCarId) || VINFAST_CARS[0];
  const currentVersion = currentCar.versionPrices?.find((v) => v.name === selectedVersionName);
  const msrpPrice = currentVersion ? currentVersion.price : currentCar.price;

  // Available colors for the car
  const availableColors: CarColorOption[] =
    CAR_COLORS_CONFIG[currentCar.id] ||
    CAR_COLORS_CONFIG['vf3'] ||
    [];

  const activeColorObj =
    availableColors.find((c) => c.name === selectedColor) || availableColors[0] || {
      name: 'Tiêu chuẩn',
      hex: '#F8FAFC',
      extraFee: 0
    };

  const colorExtraFee = activeColorObj.extraFee || 0;

  // Determine active promotion type
  let activeSelectedPromotion: SelectedPromotion = 'none';
  if (promoCategory === 'military') {
    activeSelectedPromotion = 'military';
  } else if (promoCategory === 'voucher') {
    if (voucherType === 'fadil') activeSelectedPromotion = 'voucher_fadil';
    else if (voucherType === 'lux_a') activeSelectedPromotion = 'voucher_lux_a';
    else activeSelectedPromotion = 'voucher_lux_sa';
  }

  const { discountAmount, policyTitle } = calculatePromotionDiscount(
    currentCar.id,
    msrpPrice,
    activeSelectedPromotion
  );

  const discountedCarPrice = Math.max(0, msrpPrice - discountAmount + colorExtraFee);
  const rollingBreakdown = calculateRollingCosts(msrpPrice);
  const totalOnRoadPrice = discountedCarPrice + rollingBreakdown.totalRollingCosts;

  // Installment calculations:
  const loanAmount = Math.round((discountedCarPrice * loanPercent) / 100);
  const downPayment = totalOnRoadPrice - loanAmount;
  const monthlyPrincipal = Math.round(loanAmount / loanMonths);
  const monthlyInterestFirst = Math.round((loanAmount * (interestRateYear / 100)) / 12);
  const monthlyTotalFirst = monthlyPrincipal + monthlyInterestFirst;

  const handleSelectCar = (newCarId: string) => {
    setSelectedCarId(newCarId);
    const found = VINFAST_CARS.find((c) => c.id === newCarId);
    if (found && found.versionPrices && found.versionPrices.length > 0) {
      setSelectedVersionName(found.versionPrices[0].name);
    } else {
      setSelectedVersionName('');
    }
    const colors = CAR_COLORS_CONFIG[newCarId];
    if (colors && colors.length > 0) {
      setSelectedColor(colors[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1464F4] flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Dự Toán Lăn Bánh & Trả Góp VinFast
              </h3>
              <p className="text-xs text-slate-500">
                Giá niêm yết đã bao gồm pin trọn gói · Miễn 100% thuế trước bạ xe điện
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* 1. DÒNG XE QUAN TÂM */}
          <div>
            <label htmlFor={selectCarId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              1. Dòng xe quan tâm
            </label>
            <select
              id={selectCarId}
              value={selectedCarId}
              onChange={(e) => handleSelectCar(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            >
              {VINFAST_CARS.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name} ({car.segment})
                </option>
              ))}
            </select>
          </div>

          {/* 2. PHIÊN BẢN XE */}
          {currentCar.versionPrices && currentCar.versionPrices.length > 1 && (
            <div>
              <span className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                2. Phiên bản xe
              </span>
              <div className="flex flex-wrap gap-2">
                {currentCar.versionPrices.map((vp) => {
                  const isSelected =
                    selectedVersionName === vp.name ||
                    (!selectedVersionName && vp.price === currentCar.price);
                  return (
                    <button
                      key={vp.name}
                      type="button"
                      onClick={() => setSelectedVersionName(vp.name)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-[#1464F4] text-white border-[#1464F4] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {vp.name} ({formatMillionVND(vp.price)})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. MÀU SẮC NGOẠI THẤT */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-xs font-bold text-slate-700 uppercase">
                3. Màu sắc ngoại thất
              </span>
              <span className="text-xs font-bold text-[#1464F4]">
                Đang chọn: {activeColorObj.name}
                {colorExtraFee > 0 && ` (+${formatMillionVND(colorExtraFee)})`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableColors.map((color) => {
                const isSelected =
                  selectedColor === color.name ||
                  (!selectedColor && color.name === availableColors[0]?.name);
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 text-left ${
                      isSelected
                        ? 'border-[#1464F4] bg-blue-50/70 ring-2 ring-blue-100 shadow-2xs font-bold text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-2xs"
                      style={getColorBackgroundStyle(color.hex, color.roofHex)}
                    />
                    <div className="min-w-0 flex-1 truncate">
                      <div className="truncate text-[11px]">{color.name}</div>
                      {color.extraFee > 0 ? (
                        <div className="text-[10px] font-bold text-amber-700">
                          +{formatMillionVND(color.extraFee)}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">Tiêu chuẩn</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. ƯU ĐÃI BỔ SUNG (CHỈ CÔNG AN / QUÂN ĐỘI VÀ VOUCHER VINFAST) */}
          <div className="p-3.5 bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                <Gift size={14} className="text-amber-600" />
                <span>4. Ưu đãi bổ sung</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Công an / Quân đội */}
              <label
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                  promoCategory === 'military'
                    ? 'border-[#1464F4] bg-white ring-2 ring-blue-100 text-slate-900 shadow-2xs'
                    : 'border-amber-200/70 bg-white/70 text-slate-600 hover:bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={promoCategory === 'military'}
                  onChange={(e) => {
                    setPromoCategory(e.target.checked ? 'military' : 'none');
                  }}
                  className="mt-0.5 text-[#1464F4] rounded"
                />
                <div>
                  <span className="font-bold block text-slate-900">
                    Khách hàng Công an / Quân đội
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Áp dụng chính sách ưu đãi riêng ngành
                  </span>
                </div>
              </label>

              {/* Option 2: Voucher VinFast */}
              <label
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                  promoCategory === 'voucher'
                    ? 'border-[#1464F4] bg-white ring-2 ring-blue-100 text-slate-900 shadow-2xs'
                    : 'border-amber-200/70 bg-white/70 text-slate-600 hover:bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={promoCategory === 'voucher'}
                  onChange={(e) => {
                    setPromoCategory(e.target.checked ? 'voucher' : 'none');
                  }}
                  className="mt-0.5 text-[#1464F4] rounded"
                />
                <div>
                  <span className="font-bold block text-slate-900">
                    Khách hàng có Voucher VinFast
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Được cộng dồn ưu đãi giảm giá
                  </span>
                </div>
              </label>
            </div>

            {/* Sub-options if Voucher is selected */}
            {promoCategory === 'voucher' && (
              <div className="pt-2 border-t border-amber-200/60 animate-in fade-in duration-150">
                <span className="block text-[11px] font-bold text-amber-900 mb-1.5">
                  Chọn voucher áp dụng:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setVoucherType('fadil')}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all text-left ${
                      voucherType === 'fadil'
                        ? 'bg-[#1464F4] text-white border-[#1464F4] shadow-2xs'
                        : 'bg-white text-slate-700 border-amber-200 hover:border-blue-400'
                    }`}
                  >
                    <div>Voucher Fadil</div>
                    <div className={`text-[10px] ${voucherType === 'fadil' ? 'text-blue-100' : 'text-emerald-600'}`}>
                      -30.000.000 VNĐ
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVoucherType('lux_a')}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all text-left ${
                      voucherType === 'lux_a'
                        ? 'bg-[#1464F4] text-white border-[#1464F4] shadow-2xs'
                        : 'bg-white text-slate-700 border-amber-200 hover:border-blue-400'
                    }`}
                  >
                    <div>Voucher Lux A</div>
                    <div className={`text-[10px] ${voucherType === 'lux_a' ? 'text-blue-100' : 'text-emerald-600'}`}>
                      -60.000.000 VNĐ
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVoucherType('lux_sa')}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all text-left ${
                      voucherType === 'lux_sa'
                        ? 'bg-[#1464F4] text-white border-[#1464F4] shadow-2xs'
                        : 'bg-white text-slate-700 border-amber-200 hover:border-blue-400'
                    }`}
                  >
                    <div>Voucher Lux SA</div>
                    <div className={`text-[10px] ${voucherType === 'lux_sa' ? 'text-blue-100' : 'text-emerald-600'}`}>
                      -80.000.000 VNĐ
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tóm tắt giá niêm yết & ưu đãi đại lý nổi bật */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-extrabold text-blue-950 text-sm">
                {currentCar.name} {currentVersion ? `(${currentVersion.name})` : ''} - Màu {activeColorObj.name}
              </div>
              <div className="text-blue-800 mt-1 flex flex-wrap items-center gap-2">
                <span>Giá niêm yết: <strong>{formatVND(msrpPrice)}</strong></span>
                {colorExtraFee > 0 && <span>+ Phụ phí màu: <strong>{formatVND(colorExtraFee)}</strong></span>}
                <span className="text-rose-600 font-extrabold">
                  Ưu đãi từ đại lý VinFast: -{formatVND(discountAmount)}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-500 block">Giá xe sau ưu đãi:</span>
              <span className="text-base sm:text-lg font-extrabold text-[#1464F4] tabular-nums">
                {formatVND(discountedCarPrice)}
              </span>
            </div>
          </div>

          {/* Navigation Tab: Lăn bánh vs Trả góp */}
          <div className="flex border-b border-slate-200 gap-4">
            <button
              onClick={() => setActiveTab('onRoad')}
              className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'onRoad'
                  ? 'border-[#1464F4] text-[#1464F4]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Chi tiết chi phí lăn bánh
            </button>
            <button
              onClick={() => setActiveTab('installment')}
              className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'installment'
                  ? 'border-[#1464F4] text-[#1464F4]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Dự toán trả góp ngân hàng ({loanPercent}% - {loanMonths} tháng)
            </button>
          </div>

          {activeTab === 'onRoad' ? (
            /* TAB 1: Chi tiết Lăn Bánh chuẩn theo hình ảnh mẫu đính kèm */
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs sm:text-sm">
                <div className="p-3 sm:px-4 flex justify-between bg-slate-100 font-bold text-slate-800">
                  <span>Hạng mục chi phí lăn bánh (tạm tính)</span>
                  <span>Số tiền (VNĐ)</span>
                </div>
                
                <div className="p-3 sm:px-4 flex justify-between bg-white">
                  <span className="text-slate-700">Giá xe sau ưu đãi</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatVND(discountedCarPrice)}
                  </span>
                </div>

                <div className="p-3 sm:px-4 flex justify-between bg-white">
                  <span className="text-slate-700">Phí trước bạ</span>
                  <span className="font-extrabold text-emerald-600 uppercase tabular-nums">
                    MIỄN PHÍ
                  </span>
                </div>

                <div className="p-3 sm:px-4 flex justify-between bg-white">
                  <span className="text-slate-700">Chi phí đăng kí biển số</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatVND(rollingBreakdown.plateFee)}
                  </span>
                </div>

                <div className="p-3 sm:px-4 flex justify-between bg-white">
                  <span className="text-slate-700">Phí sử dụng đường bộ 1 năm</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatVND(rollingBreakdown.roadFee)}
                  </span>
                </div>

                <div className="p-3 sm:px-4 flex justify-between bg-white">
                  <span className="text-slate-700">Phí đăng kiểm</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatVND(rollingBreakdown.inspectionFee)}
                  </span>
                </div>

                <div className="p-3 sm:px-4 flex justify-between bg-white">
                  <span className="text-slate-700">Bảo hiểm TNDS bắt buộc</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatVND(rollingBreakdown.civilInsurance)}
                  </span>
                </div>

                <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 bg-blue-50/80 border-t-2 border-blue-200">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-[#1464F4] block">
                      Tổng chi phí lăn bánh trọn gói (tạm tính)
                    </span>
                    <span className="text-[11px] text-amber-700 font-semibold block">
                      * Giá trên chưa bao gồm gói quà tặng chính hãng từ VinFast đại lý
                    </span>
                  </div>
                  <span className="text-lg sm:text-xl font-black text-[#1464F4] tabular-nums self-end sm:self-auto">
                    {formatVND(totalOnRoadPrice)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: Tính Trả Góp Ngân Hàng */
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* Slider: Loan Percent */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700">Tỷ lệ vay ngân hàng:</span>
                    <span className="text-[#1464F4]">{loanPercent}% ({formatMillionVND(loanAmount)})</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="85"
                    step="5"
                    value={loanPercent}
                    onChange={(e) => setLoanPercent(Number(e.target.value))}
                    className="w-full accent-[#1464F4] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>30%</span>
                    <span>50%</span>
                    <span>70%</span>
                    <span>85% (Tối đa)</span>
                  </div>
                </div>

                {/* Slider: Loan Months */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700">Thời gian vay:</span>
                    <span className="text-[#1464F4]">{loanMonths} tháng ({(loanMonths / 12).toFixed(0)} năm)</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="96"
                    step="12"
                    value={loanMonths}
                    onChange={(e) => setLoanMonths(Number(e.target.value))}
                    className="w-full accent-[#1464F4] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>1 năm</span>
                    <span>3 năm</span>
                    <span>5 năm</span>
                    <span>8 năm (Tối đa)</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700">Lãi suất ưu đãi ngân hàng liên kết:</span>
                    <span className="text-[#1464F4]">{interestRateYear}% / năm</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    VinFast liên kết với Vietcombank, BIDV, Techcombank, MB Bank hỗ trợ hồ sơ nhanh trong ngày.
                  </div>
                </div>
              </div>

              {/* Installment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <span className="text-[11px] text-slate-500 block">Số tiền cần trả trước</span>
                  <span className="text-base font-extrabold text-[#1464F4] tabular-nums">
                    {formatMillionVND(downPayment)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[11px] text-slate-500 block">Gốc trả hàng tháng</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {formatVND(monthlyPrincipal)}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="text-[11px] text-emerald-700 block font-bold">Tổng thanh toán tháng đầu</span>
                  <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                    {formatVND(monthlyTotalFirst)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action bottom button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                onRequestQuoteWithCalculation(currentCar, {
                  version: currentVersion ? currentVersion.name : currentCar.name,
                  color: activeColorObj.name,
                  promo: policyTitle,
                  totalPrice: totalOnRoadPrice
                });
                onClose();
              }}
              className="flex-1 py-3 bg-[#1464F4] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send size={16} />
              <span>Bấm Vào Đây Để Nhận Báo Giá & Gói Quà Tặng Thêm Từ Đại Lý</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
