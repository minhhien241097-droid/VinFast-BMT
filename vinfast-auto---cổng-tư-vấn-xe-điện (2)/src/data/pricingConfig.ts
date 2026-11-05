export interface CarColorOption {
  name: string;
  hex: string;
  roofHex?: string;
  extraFee: number; // 0 VNĐ or extra fee
  isAdvanced?: boolean;
}

export type SelectedPromotion =
  | 'none' // Mặc định tự động áp dụng Vì tương lai xanh 2 (Khách hàng bình thường)
  | 'military' // Chính sách khách hàng công an, quân đội
  | 'voucher_fadil' // Voucher Fadil (áp dụng chung với Vì tương lai xanh 2: +30Tr)
  | 'voucher_lux_a' // Voucher Lux A (áp dụng chung với Vì tương lai xanh 2: +60Tr)
  | 'voucher_lux_sa'; // Voucher Lux SA (áp dụng chung với Vì tương lai xanh 2: +80Tr)

export interface RollingCostsBreakdown {
  registrationTax: number; // Phí trước bạ: 0đ (Miễn phí)
  plateFee: number; // Chi phí đăng ký biển số: 200.000đ
  roadFee: number; // Phí sử dụng đường bộ 1 năm: 1.560.000đ
  inspectionFee: number; // Phí đăng kiểm: 90.000đ
  civilInsurance: number; // Bảo hiểm TNDS bắt buộc: 531.000đ
  totalRollingCosts: number; // Tổng các khoản lăn bánh bắt buộc tạm tính
}

// Bảng màu chuẩn xác 100% theo yêu cầu của khách hàng
export const CAR_COLORS_CONFIG: Record<string, CarColorOption[]> = {
  // VF 2: Trắng, Đỏ, Bạc, Xanh lá nhạt (+8Tr), Vàng (+8Tr), Xanh dương (+8Tr), Hồng (+8Tr), Be (+8Tr)
  vf2: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Bạc', hex: '#CBD5E1', extraFee: 0 },
    { name: 'Xanh lá nhạt', hex: '#86EFAC', extraFee: 8000000, isAdvanced: true },
    { name: 'Vàng', hex: '#FACC15', extraFee: 8000000, isAdvanced: true },
    { name: 'Xanh dương', hex: '#38BDF8', extraFee: 8000000, isAdvanced: true },
    { name: 'Hồng', hex: '#F472B6', extraFee: 8000000, isAdvanced: true },
    { name: 'Be', hex: '#E2D4BA', extraFee: 8000000, isAdvanced: true }
  ],

  // VF 3: Trắng, Xám, Đỏ, Xanh lá nhạt (+8Tr), Vàng nóc trắng (+8Tr), Xanh dương nóc trắng (+8Tr), Hồng nóc trắng (+8Tr)
  vf3: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Xám', hex: '#64748B', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Xanh lá nhạt', hex: '#86EFAC', extraFee: 8000000, isAdvanced: true },
    { name: 'Vàng nóc trắng', hex: '#FACC15', roofHex: '#FFFFFF', extraFee: 8000000, isAdvanced: true },
    { name: 'Xanh dương nóc trắng', hex: '#38BDF8', roofHex: '#FFFFFF', extraFee: 8000000, isAdvanced: true },
    { name: 'Hồng nóc trắng', hex: '#F472B6', roofHex: '#FFFFFF', extraFee: 8000000, isAdvanced: true }
  ],

  // VF 5: Trắng, Xám, Đỏ, Xanh lá nhạt (+8Tr), Vàng nóc đen (+8Tr), Xanh dương nóc trắng (+8Tr)
  vf5: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Xám', hex: '#64748B', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Xanh lá nhạt', hex: '#86EFAC', extraFee: 8000000, isAdvanced: true },
    { name: 'Vàng nóc đen', hex: '#FACC15', roofHex: '#0F172A', extraFee: 8000000, isAdvanced: true },
    { name: 'Xanh dương nóc trắng', hex: '#38BDF8', roofHex: '#FFFFFF', extraFee: 8000000, isAdvanced: true }
  ],

  // VF 6: Trắng, Đen, Xám, Đỏ, Xanh lá nhạt (+8Tr)
  vf6: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Xám', hex: '#64748B', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Xanh lá nhạt', hex: '#86EFAC', extraFee: 8000000, isAdvanced: true }
  ],

  // VF 7: Trắng, Đen, Xám, Đỏ, Xanh lá nhạt (+12Tr)
  vf7: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Xám', hex: '#64748B', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Xanh lá nhạt', hex: '#86EFAC', extraFee: 12000000, isAdvanced: true }
  ],

  // VF 8 (Thế hệ mới): Trắng, Xanh dương, Đỏ, Đen, Cam (+12Tr), Tím (+12Tr), Đỏ nóc đen (+12Tr), Cam nóc đen (+12Tr), Cam nóc trắng (+12Tr), Xanh dương nóc trắng (+12Tr), Tím nóc bạc (+12Tr), Đen nóc bạc (+12Tr)
  vf8_thm: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Xanh dương', hex: '#1D4ED8', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Cam', hex: '#EA580C', extraFee: 12000000, isAdvanced: true },
    { name: 'Tím', hex: '#7C3AED', extraFee: 12000000, isAdvanced: true },
    { name: 'Đỏ nóc đen', hex: '#DC2626', roofHex: '#0F172A', extraFee: 12000000, isAdvanced: true },
    { name: 'Cam nóc đen', hex: '#EA580C', roofHex: '#0F172A', extraFee: 12000000, isAdvanced: true },
    { name: 'Cam nóc trắng', hex: '#EA580C', roofHex: '#FFFFFF', extraFee: 12000000, isAdvanced: true },
    { name: 'Xanh dương nóc trắng', hex: '#1D4ED8', roofHex: '#FFFFFF', extraFee: 12000000, isAdvanced: true },
    { name: 'Tím nóc bạc', hex: '#7C3AED', roofHex: '#CBD5E1', extraFee: 12000000, isAdvanced: true },
    { name: 'Đen nóc bạc', hex: '#0F172A', roofHex: '#CBD5E1', extraFee: 12000000, isAdvanced: true }
  ],

  // VF 8 (Eco / Plus): Trắng, Đen, Đỏ, Xanh lá đậm, Đỏ nóc đồng (+12Tr), Xám nóc bạc (+12Tr), Trắng nóc xám (+12Tr), Đen nóc đồng (+12Tr)
  vf8: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Xanh lá đậm', hex: '#154734', extraFee: 0 },
    { name: 'Đỏ nóc đồng', hex: '#881337', roofHex: '#C5A059', extraFee: 12000000, isAdvanced: true },
    { name: 'Xám nóc bạc', hex: '#64748B', roofHex: '#CBD5E1', extraFee: 12000000, isAdvanced: true },
    { name: 'Trắng nóc xám', hex: '#F8FAFC', roofHex: '#64748B', extraFee: 12000000, isAdvanced: true },
    { name: 'Đen nóc đồng', hex: '#0F172A', roofHex: '#C5A059', extraFee: 12000000, isAdvanced: true }
  ],

  // VF 9: Trắng, Đen, Xám, Đỏ, Xanh lá nhạt, Xanh lá đậm (+12Tr), Bạc (+12Tr)
  vf9: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Xám', hex: '#64748B', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Xanh lá nhạt', hex: '#86EFAC', extraFee: 0 },
    { name: 'Xanh lá đậm', hex: '#154734', extraFee: 12000000, isAdvanced: true },
    { name: 'Bạc', hex: '#94A3B8', extraFee: 12000000, isAdvanced: true }
  ],

  // VF MPV 7: Trắng, Đen, Xám, Đỏ, Xanh dương (+10Tr), Nâu (+10Tr)
  mpv7: [
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Xám', hex: '#64748B', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Xanh dương', hex: '#1D4ED8', extraFee: 10000000, isAdvanced: true },
    { name: 'Nâu', hex: '#5C3D2E', extraFee: 10000000, isAdvanced: true }
  ],

  // VF Wild: Đen, Trắng, Đỏ, Xám (+12Tr)
  vfwild: [
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Xám', hex: '#64748B', extraFee: 12000000, isAdvanced: true }
  ],

  // Minio Green: Đen, Bạc, Trắng, Đỏ, Bạc nóc đen (+3Tr), Đen nóc vàng (+3Tr), Đỏ nóc trắng (+3Tr), Vàng nóc trắng (+3Tr), Hồng ánh kim (+8Tr), Xanh ngọc (+8Tr), Hồng ánh kim nóc trắng (+11Tr), Hồng ánh kim nóc xanh (+11Tr), Xanh ngọc nóc trắng (+11Tr), Xanh ngọc nóc vàng (+11Tr)
  miniogreen: [
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Bạc', hex: '#CBD5E1', extraFee: 0 },
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    // Phối 2 tông +3Tr
    { name: 'Bạc nóc đen', hex: '#CBD5E1', roofHex: '#0F172A', extraFee: 3000000, isAdvanced: true },
    { name: 'Đen nóc vàng', hex: '#0F172A', roofHex: '#FACC15', extraFee: 3000000, isAdvanced: true },
    { name: 'Đỏ nóc trắng', hex: '#DC2626', roofHex: '#FFFFFF', extraFee: 3000000, isAdvanced: true },
    { name: 'Vàng nóc trắng', hex: '#FACC15', roofHex: '#FFFFFF', extraFee: 3000000, isAdvanced: true },
    // Màu đơn nâng cao +8Tr
    { name: 'Hồng ánh kim', hex: '#FB7185', extraFee: 8000000, isAdvanced: true },
    { name: 'Xanh ngọc', hex: '#2DD4BF', extraFee: 8000000, isAdvanced: true },
    // 2 tông nâng cao +11Tr
    { name: 'Hồng ánh kim nóc trắng', hex: '#FB7185', roofHex: '#FFFFFF', extraFee: 11000000, isAdvanced: true },
    { name: 'Hồng ánh kim nóc xanh', hex: '#FB7185', roofHex: '#059669', extraFee: 11000000, isAdvanced: true },
    { name: 'Xanh ngọc nóc trắng', hex: '#2DD4BF', roofHex: '#FFFFFF', extraFee: 11000000, isAdvanced: true },
    { name: 'Xanh ngọc nóc vàng', hex: '#2DD4BF', roofHex: '#FACC15', extraFee: 11000000, isAdvanced: true }
  ],

  // Herio Green: Đen, Bạc, Đỏ, Trắng (toàn bộ màu tiêu chuẩn)
  heriogreen: [
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Bạc', hex: '#CBD5E1', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 }
  ],

  // Limo Green: Bạc, Đen, Trắng, Đỏ (toàn bộ màu tiêu chuẩn)
  limogreen: [
    { name: 'Bạc', hex: '#CBD5E1', extraFee: 0 },
    { name: 'Đen', hex: '#0F172A', extraFee: 0 },
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 }
  ],

  // EC Van: Xanh lá nhạt, Đỏ, Vàng, Trắng (toàn bộ màu tiêu chuẩn)
  ecvan: [
    { name: 'Xanh lá nhạt', hex: '#86EFAC', extraFee: 0 },
    { name: 'Đỏ', hex: '#DC2626', extraFee: 0 },
    { name: 'Vàng', hex: '#FACC15', extraFee: 0 },
    { name: 'Trắng', hex: '#F8FAFC', extraFee: 0 }
  ]
};

// Tính toán ưu đãi chiết khấu tự động:
// - Mặc định: tự động áp dụng Vì tương lai xanh 2 (Khách hàng bình thường)
// - Khách hàng chọn Công an / Quân đội: chỉ áp dụng tỷ lệ Công an/Quân đội (không cộng dồn Vì tương lai xanh 2)
// - Khách hàng chọn Voucher VinFast: áp dụng cộng dồn (Vì tương lai xanh 2 + Giá trị Voucher)
export const calculatePromotionDiscount = (
  carId: string,
  msrp: number,
  selectedPromo: SelectedPromotion
): { discountAmount: number; policyTitle: string } => {
  const normId = carId.toLowerCase();

  // Tỷ lệ ưu đãi của Vì Tương Lai Xanh 2
  let greenFutureRate = 0.09;
  if (normId === 'vf2' || normId === 'vf3' || normId === 'miniogreen') {
    greenFutureRate = 0.03;
  } else if (
    normId === 'vf9' ||
    normId === 'vf8_thm' ||
    normId === 'ecvan' ||
    normId === 'vfwild'
  ) {
    greenFutureRate = 0.05;
  }
  const greenFutureDiscount = Math.round(msrp * greenFutureRate);

  // 1. Trường hợp: Khách hàng Công an / Quân đội (Không cộng dồn Vì tương lai xanh 2)
  if (selectedPromo === 'military') {
    let militaryRate = 0.09;
    if (normId === 'vf2' || normId === 'vf3' || normId === 'miniogreen') {
      militaryRate = 0.06;
    } else if (
      normId === 'vf9' ||
      normId === 'vf8_thm' ||
      normId === 'ecvan' ||
      normId === 'vfwild'
    ) {
      militaryRate = 0.07;
    }
    const militaryDiscount = Math.round(msrp * militaryRate);
    return {
      discountAmount: militaryDiscount,
      policyTitle: 'Chính sách khách hàng công an, quân đội'
    };
  }

  // 2. Trường hợp: Khách hàng có Voucher VinFast (Áp dụng cộng dồn chung với Vì tương lai xanh 2)
  if (selectedPromo === 'voucher_fadil') {
    return {
      discountAmount: greenFutureDiscount + 30000000,
      policyTitle: 'Chính sách khách hàng có voucher'
    };
  }
  if (selectedPromo === 'voucher_lux_a') {
    return {
      discountAmount: greenFutureDiscount + 60000000,
      policyTitle: 'Chính sách khách hàng có voucher'
    };
  }
  if (selectedPromo === 'voucher_lux_sa') {
    return {
      discountAmount: greenFutureDiscount + 80000000,
      policyTitle: 'Chính sách khách hàng có voucher'
    };
  }

  // 3. Trường hợp: Khách hàng bình thường (Mặc định tự động áp dụng Vì tương lai xanh 2)
  return {
    discountAmount: greenFutureDiscount,
    policyTitle: 'Khách hàng bình thường'
  };
};

// Tính toán bảng các khoản lăn bánh bắt buộc (tạm tính)
export const calculateRollingCosts = (_msrp?: number): RollingCostsBreakdown => {
  const registrationTax = 0; // Miễn phí
  const plateFee = 200000; // 200.000 VNĐ
  const roadFee = 1560000; // 1.560.000 VNĐ
  const inspectionFee = 90000; // 90.000 VNĐ
  const civilInsurance = 531000; // 531.000 VNĐ

  const totalRollingCosts =
    registrationTax +
    plateFee +
    roadFee +
    inspectionFee +
    civilInsurance;

  return {
    registrationTax,
    plateFee,
    roadFee,
    inspectionFee,
    civilInsurance,
    totalRollingCosts
  };
};
