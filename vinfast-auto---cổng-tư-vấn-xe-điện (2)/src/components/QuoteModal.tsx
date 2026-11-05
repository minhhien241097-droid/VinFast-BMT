import React, { useState, useId, useEffect } from 'react';
import { VINFAST_CARS, DEALERSHIP_INFO } from '../data/cars';
import { CarModel } from '../types';
import { formatVND, formatMillionVND, getColorBackgroundStyle } from '../utils/formatters';
import {
  X,
  Send,
  Phone,
  CheckCircle2,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '../services/leadService';
import {
  CAR_COLORS_CONFIG,
  CarColorOption,
  SelectedPromotion,
  calculatePromotionDiscount,
  calculateRollingCosts
} from '../data/pricingConfig';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCar?: CarModel | null;
  customDetails?: any;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedCar,
  customDetails
}) => {
  const [carId, setCarId] = useState<string>(preselectedCar?.id || 'vf3');
  const [selectedVersionName, setSelectedVersionName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  // Ưu đãi tùy chọn bổ sung: 'none' (mặc định Vì tương lai xanh 2), 'military' (Công an/Quân đội), 'voucher' (Voucher VinFast)
  const [promoCategory, setPromoCategory] = useState<'none' | 'military' | 'voucher'>('none');
  const [voucherType, setVoucherType] = useState<'fadil' | 'lux_a' | 'lux_sa'>('fadil');
  const [showRollingDetails, setShowRollingDetails] = useState<boolean>(true);

  const [paymentType, setPaymentType] = useState<'installment' | 'full'>('installment');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [city, setCity] = useState<string>('Bình Phước');
  const [note, setNote] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const quoteCarSelectId = useId();
  const quoteFullNameId = useId();
  const quotePhoneId = useId();
  const quoteCitySelectId = useId();
  const quoteNoteId = useId();

  // Reset or initialize state when opening modal or changing preselectedCar
  useEffect(() => {
    if (preselectedCar) {
      setCarId(preselectedCar.id);
      if (preselectedCar.versionPrices && preselectedCar.versionPrices.length > 0) {
        setSelectedVersionName(preselectedCar.versionPrices[0].name);
      } else {
        setSelectedVersionName('');
      }
    }
  }, [preselectedCar]);

  if (!isOpen) return null;

  const currentCar = VINFAST_CARS.find((c) => c.id === carId) || VINFAST_CARS[0];
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
  const totalOnRoadEstimate = discountedCarPrice + rollingBreakdown.totalRollingCosts;

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

  const handleSelectCar = (newId: string) => {
    setCarId(newId);
    const found = VINFAST_CARS.find((c) => c.id === newId);
    if (found && found.versionPrices && found.versionPrices.length > 0) {
      setSelectedVersionName(found.versionPrices[0].name);
    } else {
      setSelectedVersionName('');
    }
    const colors = CAR_COLORS_CONFIG[newId];
    if (colors && colors.length > 0) {
      setSelectedColor(colors[0].name);
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

    // Gửi thông tin sang Lead Service (Lưu trữ và tự động bắn vào Google Sheets & Telegram)
    submitLead({
      type: 'quote',
      typeName: 'Yêu Cầu Báo Giá',
      fullName,
      phone,
      carName: currentCar.name,
      versionName: currentVersion ? currentVersion.name : currentCar.name,
      price: totalOnRoadEstimate,
      city,
      paymentType: paymentType === 'installment' ? 'Trả góp ngân hàng' : 'Thanh toán 100%',
      note: `Màu: ${activeColorObj.name}${colorExtraFee > 0 ? ` (+${formatMillionVND(colorExtraFee)})` : ''} | Chính sách: ${policyTitle} | Ưu đãi từ đại lý: -${formatMillionVND(discountAmount)} | Dự toán lăn bánh: ${formatVND(totalOnRoadEstimate)}${note ? ` | Ghi chú: ${note}` : ''}`
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1464F4] flex items-center justify-center text-lg">
              📋
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Nhận Báo Giá Lăn Bánh & Ưu Đãi Đại Lý
              </h3>
              <p className="text-xs text-slate-500">
                Bảng tính giá lăn bánh chi tiết theo chính sách mới nhất tại {DEALERSHIP_INFO.showroomName}
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
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">
                Yêu Cầu Báo Giá Đã Được Gửi!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Cảm ơn Quý khách <strong>{fullName}</strong>. Chuyên viên tư vấn của {DEALERSHIP_INFO.showroomName} đã tiếp nhận thông tin yêu cầu báo giá và sẽ liên hệ hỗ trợ Quý khách sớm nhất qua số điện thoại <strong>{phone}</strong>.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 text-left max-w-md mx-auto space-y-2">
                <div>• Dòng xe: <strong>{currentCar.name}</strong> {currentVersion ? `(${currentVersion.name})` : ''}</div>
                <div>• Ngoại thất: <strong>{activeColorObj.name}</strong></div>
                <div>• Chính sách: <strong>{policyTitle}</strong></div>
                <div>• Đại lý hỗ trợ: <strong>{DEALERSHIP_INFO.showroomName}</strong></div>
                <div>• Hotline tư vấn: <strong>{DEALERSHIP_INFO.hotline}</strong></div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={DEALERSHIP_INFO.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#1464F4] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-2xs"
                >
                  Nhắn Zalo Tư Vấn Viên
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. DÒNG XE QUAN TÂM (CHỈ ĐỂ TÊN XE & CHÚ THÍCH) */}
              <div>
                <label htmlFor={quoteCarSelectId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  1. Dòng xe quan tâm
                </label>
                <select
                  id={quoteCarSelectId}
                  value={carId}
                  onChange={(e) => handleSelectCar(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                >
                  {VINFAST_CARS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.segment})
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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
                          <div className="truncate text-[11.5px]">{color.name}</div>
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

              {/* 4. ƯU ĐÃI (CHỈ GỒM: CÔNG AN / QUÂN ĐỘI VÀ VOUCHER VINFAST) */}
              <div className="p-3.5 bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/80 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Gift size={14} className="text-amber-600" />
                    <span>4. Ưu đãi bổ sung</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Công an / Quân đội (Không áp dụng chung với Vì tương lai xanh 2) */}
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

                  {/* Option 2: Voucher VinFast (Được áp dụng chung với Vì tương lai xanh 2) */}
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
                      Chọn loại voucher Quý khách đang sở hữu:
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

              {/* 5. BẢNG DỰ TOÁN LĂN BÁNH: LÀM NỔI BẬT "ƯU ĐÃI TỪ ĐẠI LÝ:" VÀ GIÁ XE ƯU ĐÃI */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/60">
                <div className="p-3.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                    Bảng giá & Chi phí lăn bánh tạm tính
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRollingDetails(!showRollingDetails)}
                    className="text-xs font-bold text-[#1464F4] hover:underline cursor-pointer"
                  >
                    {showRollingDetails ? 'Thu gọn chi tiết' : 'Xem chi tiết'}
                  </button>
                </div>

                <div className="p-4 space-y-2.5 text-xs">
                  {/* MSRP Price */}
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Giá bán niêm yết:</span>
                    <span className="font-bold tabular-nums">{formatVND(msrpPrice)}</span>
                  </div>

                  {/* Color Extra Fee */}
                  {colorExtraFee > 0 && (
                    <div className="flex justify-between items-center text-amber-800">
                      <span>Phụ phí màu nâng cao ({activeColorObj.name}):</span>
                      <span className="font-bold tabular-nums">+{formatVND(colorExtraFee)}</span>
                    </div>
                  )}

                  {/* ƯU ĐÃI TỪ ĐẠI LÝ VINFAST: LÀM ĐẬM, SÁNG VÀ TO LÊN ĐỂ KHÁCH THẤY ĐƯỢC ƯU ĐÃI NHIỀU */}
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex justify-between items-center">
                    <span className="font-extrabold text-rose-800 text-xs sm:text-sm">
                      Ưu đãi từ đại lý VinFast:
                    </span>
                    <span className="text-base sm:text-lg font-black text-rose-600 tabular-nums">
                      -{formatVND(discountAmount)}
                    </span>
                  </div>

                  {/* Giá xe sau ưu đãi */}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900">
                    <span className="text-xs font-bold text-slate-800">Giá xe sau ưu đãi:</span>
                    <span className="text-sm font-extrabold text-[#1464F4] tabular-nums">
                      {formatVND(discountedCarPrice)}
                    </span>
                  </div>

                  {/* Rolling Costs Details (Đã xóa dòng 1.5% ở Bảo hiểm Thân Vỏ) */}
                  {showRollingDetails && (
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-300 space-y-2 bg-white p-3 rounded-xl border">
                      <div className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Các khoản lăn bánh (tạm tính):</span>
                        <span className="text-[#1464F4]">
                          {formatVND(rollingBreakdown.totalRollingCosts)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-slate-600 text-[11.5px]">
                        <span>• Phí trước bạ:</span>
                        <span className="font-extrabold text-emerald-600 uppercase">MIỄN PHÍ</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-600 text-[11.5px]">
                        <span>• Chi phí đăng kí biển số:</span>
                        <span className="tabular-nums">{formatVND(rollingBreakdown.plateFee)}</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-600 text-[11.5px]">
                        <span>• Phí sử dụng đường bộ 1 năm:</span>
                        <span className="tabular-nums">{formatVND(rollingBreakdown.roadFee)}</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-600 text-[11.5px]">
                        <span>• Phí đăng kiểm:</span>
                        <span className="tabular-nums">{formatVND(rollingBreakdown.inspectionFee)}</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-600 text-[11.5px]">
                        <span>• Bảo hiểm TNDS bắt buộc:</span>
                        <span className="tabular-nums">{formatVND(rollingBreakdown.civilInsurance)}</span>
                      </div>
                    </div>
                  )}

                  {/* Grand Total On-Road Price với ghi chú mới */}
                  <div className="pt-3 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        TỔNG GIÁ LĂN BÁNH DỰ KIẾN:
                      </span>
                      <span className="text-[11px] text-amber-700 font-semibold block">
                        * Giá trên chưa bao gồm gói quà tặng chính hãng từ VinFast đại lý
                      </span>
                    </div>
                    <span className="text-base sm:text-lg font-black text-[#1464F4] tabular-nums self-end sm:self-auto">
                      {formatVND(totalOnRoadEstimate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. HÌNH THỨC THANH TOÁN */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Hình thức thanh toán dự kiến
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType('installment')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      paymentType === 'installment'
                        ? 'border-[#1464F4] bg-blue-50 text-[#1464F4] shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Vay trả góp ngân hàng (Từ 20%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('full')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      paymentType === 'full'
                        ? 'border-[#1464F4] bg-blue-50 text-[#1464F4] shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Thanh toán 100% thẳng
                  </button>
                </div>
              </div>

              {/* 7. THÔNG TIN KHÁCH HÀNG (CẢNH BÁO: "Vui lòng kiểm tra lại số điện thoại") */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={quoteFullNameId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Họ và tên Quý khách <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={quoteFullNameId}
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                  />
                </div>

                <div>
                  <label htmlFor={quotePhoneId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Số điện thoại nhận báo giá <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={quotePhoneId}
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
                    <p className="text-[11.5px] text-red-500 font-bold mt-1.5 animate-in fade-in">
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={quoteCitySelectId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Tỉnh / Thành phố
                  </label>
                  <select
                    id={quoteCitySelectId}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                  >
                    <option value="Bình Phước">Bình Phước</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={quoteNoteId} className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Ghi chú thêm (tùy chọn)
                  </label>
                  <input
                    id={quoteNoteId}
                    type="text"
                    placeholder="Thời gian mua, yêu cầu gói phụ kiện..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#1464F4] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Send size={16} />
                <span>Nhận Báo Giá Lăn Bánh & Gói Quà Tặng Thêm Từ Đại Lý</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Thông tin được bảo mật và tự động gửi tới Chuyên viên kinh doanh VinFast Bình Phước.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
