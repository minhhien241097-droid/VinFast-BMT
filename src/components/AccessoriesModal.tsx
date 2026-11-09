import React, { useState } from 'react';
import { ACCESSORIES_DATA, INSURANCE_PACKAGES } from '../data/accessories';
import { formatVND } from '../utils/formatters';
import { X, Shield, Wrench, CheckCircle, Plus, Check } from 'lucide-react';
import { VINFAST_CARS } from '../data/cars';

interface AccessoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultationRequest: (selectedItems: string[], totalCost: number) => void;
}

export const AccessoriesModal: React.FC<AccessoriesModalProps> = ({
  isOpen,
  onClose,
  onConsultationRequest
}) => {
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([
    'film-3m',
    'mat-5d',
    'charger-7kw'
  ]);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('ins-gold');
  const [selectedCarPrice, setSelectedCarPrice] = useState<number>(468000000); // Default VF5 price

  if (!isOpen) return null;

  const toggleAccessory = (id: string) => {
    setSelectedAccessoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedAccessories = ACCESSORIES_DATA.filter((a) =>
    selectedAccessoryIds.includes(a.id)
  );
  const accessoriesTotal = selectedAccessories.reduce((acc, curr) => acc + curr.price, 0);

  const currentInsurance = INSURANCE_PACKAGES.find((i) => i.id === selectedInsuranceId);
  const insuranceCost = currentInsurance
    ? Math.round((selectedCarPrice * currentInsurance.ratePercent) / 100)
    : 0;

  const grandTotal = accessoriesTotal + insuranceCost;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1464F4] flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Phụ Kiện Chính Hãng & Bảo Hiểm Xe VinFast
              </h3>
              <p className="text-xs text-slate-500">
                Lắp đặt tiêu chuẩn không ảnh hưởng đến bảo hành điện tử chính hãng
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
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Insurance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <span className="text-base">🛡️</span>
                <span>Gói Bảo Hiểm Thân Vỏ 2 Chiều (Khuyên dùng)</span>
              </div>
              <div className="text-xs text-slate-500">
                Tự động tính theo giá xe
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INSURANCE_PACKAGES.map((ins) => {
                const isSelected = selectedInsuranceId === ins.id;
                const cost = Math.round((selectedCarPrice * ins.ratePercent) / 100);

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
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-slate-900">{ins.name}</span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isSelected ? 'bg-[#1464F4] text-white' : 'border border-slate-300'
                      }`}>
                        {isSelected && <Check size={12} />}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {ins.description}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500">Phí bảo hiểm 1 năm:</span>
                      <span className="text-sm font-extrabold text-[#1464F4] tabular-nums">
                        ~{formatVND(cost)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Accessories list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Wrench size={16} className="text-[#1464F4]" />
                <span>Danh Mục Phụ Kiện Chính Hãng Thiết Yếu</span>
              </div>
              <span className="text-xs text-slate-500">
                Đã chọn: {selectedAccessoryIds.length} món
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {ACCESSORIES_DATA.map((item) => {
                const isChecked = selectedAccessoryIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAccessory(item.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? 'border-[#1464F4] bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-[#1464F4] text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check size={13} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.name}
                          </span>
                          {item.popular && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                              Bán chạy
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {item.warranty}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-extrabold text-[#1464F4] tabular-nums">
                        {formatVND(item.price)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">
              Tổng giá trị phụ kiện & bảo hiểm:
            </div>
            <div className="text-lg font-extrabold text-[#1464F4] tabular-nums">
              {formatVND(grandTotal)}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                const itemNames = [
                  ...(currentInsurance ? [currentInsurance.name] : []),
                  ...selectedAccessories.map((a) => a.name)
                ];
                onConsultationRequest(itemNames, grandTotal);
                onClose();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Đặt Mua & Lắp Đặt Cùng Xe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
