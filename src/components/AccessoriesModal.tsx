import React, { useState } from 'react';
import { ACCESSORIES_DATA } from '../data/accessories';
import { VINFAST_CARS } from '../data/cars';
import { formatVND } from '../utils/formatters';
import {
  CustomerLead,
  isValidVietnamPhone,
  PHONE_VALIDATION_ERROR,
  submitCustomerLead
} from '../services/leadService';
import { X, Wrench, Check } from 'lucide-react';

interface AccessoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted: (lead: CustomerLead) => void;
}

export const AccessoriesModal: React.FC<AccessoriesModalProps> = ({
  isOpen,
  onClose,
  onLeadSubmitted
}) => {
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([
    'film-3m',
    'mat-5d',
    'charger-7kw'
  ]);
  const [selectedCarName, setSelectedCarName] = useState<string>('VinFast VF 5');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccessories.length === 0) {
      setErrorMsg('Vui lòng tích chọn ít nhất 1 món phụ kiện.');
      return;
    }
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

    const itemNames = selectedAccessories.map((a) => a.name).join(', ');
    const lead = await submitCustomerLead({
      customerName: customerName.trim(),
      phone,
      category: 'Linh kiện & Phụ kiện',
      carModel: selectedCarName,
      details: `Đã chọn ${selectedAccessories.length} món (${formatVND(accessoriesTotal)}): ${itemNames}`
    });

    setIsSubmitting(false);
    setCustomerName('');
    setPhone('');
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
              <Wrench size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Linh Kiện & Phụ Kiện Chính Hãng VinFast
              </h3>
              <p className="text-xs text-slate-500">
                Lắp đặt tiêu chuẩn 3S, giữ nguyên bảo hành điện tử chính hãng
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Wrench size={16} className="text-[#1464F4]" />
              <span>Danh Mục Linh Kiện & Phụ Kiện Thiết Yếu</span>
            </div>
            <span className="text-xs font-semibold text-[#1464F4] bg-blue-50 px-2.5 py-1 rounded-full">
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
                    <div
                      className={`w-5 h-5 rounded-md mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-[#1464F4] text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check size={13} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {item.name}
                        </span>
                        {item.popular && (
                          <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                            Phổ biến
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                      <span className="text-[10.5px] text-slate-400 font-medium">
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

          {/* Customer Information Form */}
          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
            <span className="block text-xs font-extrabold text-slate-800 uppercase">
              Thông tin khách hàng đặt mua & lắp đặt
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
                  DÒNG XE LẮP ĐẶT
                </label>
                <select
                  value={selectedCarName}
                  onChange={(e) => setSelectedCarName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#1464F4] focus:outline-hidden"
                >
                  {VINFAST_CARS.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">Tổng giá trị phụ kiện đã chọn:</div>
              <div className="text-lg font-extrabold text-[#1464F4] tabular-nums">
                {formatVND(accessoriesTotal)}
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
                {isSubmitting ? 'Đang gửi...' : 'Xác Nhận Đặt Mua & Lắp Đặt'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
