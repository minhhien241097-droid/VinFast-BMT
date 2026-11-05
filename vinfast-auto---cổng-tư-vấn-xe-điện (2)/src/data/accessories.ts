import { AccessoryItem } from '../types';

export const ACCESSORIES_DATA: AccessoryItem[] = [
  {
    id: 'film-3m',
    name: 'Phim cách nhiệt 3M Crystalline chính hãng',
    category: 'Ngoại thất',
    price: 9500000,
    description: 'Ngăn chặn 99.9% tia UV và 97% tia hồng ngoại, giảm nhiệt độ cabin rõ rệt trong mùa hè, bảo vệ nội thất xe.',
    warranty: 'Bảo hành điện tử 10 năm',
    popular: true
  },
  {
    id: 'mat-5d',
    name: 'Thảm lót sàn TPE đúc tràn viền cao cấp',
    category: 'Nội thất',
    price: 2200000,
    description: 'Chất liệu nhựa TPE nguyên sinh không mùi độc hại, thiết kế quét 3D chuẩn xác theo form từng dòng xe VinFast.',
    warranty: 'Bảo hành 2 năm',
    popular: true
  },
  {
    id: 'charger-7kw',
    name: 'Bộ sạc di động VinFast công suất 7.4 kW',
    category: 'Công nghệ & Sạc',
    price: 6800000,
    description: 'Tương thích lưới điện 220V gia đình, sạc qua đêm đầy pin an toàn với công nghệ tự ngắt khi đầy pin, chống sét.',
    warranty: 'Bảo hành chính hãng 24 tháng',
    popular: true
  },
  {
    id: 'charger-3kw',
    name: 'Bộ sạc khẩn cấp di động 3.5 kW',
    category: 'Công nghệ & Sạc',
    price: 3500000,
    description: 'Nhỏ gọn cất cốp xe, cắm vào bất kỳ ổ điện sinh hoạt 220V nào, có màn hình LED báo trạng thái dòng điện.',
    warranty: 'Bảo hành chính hãng 12 tháng'
  },
  {
    id: 'dashcam-4k',
    name: 'Camera hành trình Vietmap SpeedMap M1 (Trước + Sau)',
    category: 'Công nghệ & Sạc',
    price: 5200000,
    description: 'Ghi hình 4K sắc nét ngày đêm, cảnh báo tốc độ giới hạn bằng giọng nói tiếng Việt, tích hợp GPS.',
    warranty: 'Bảo hành 1 đổi 1 trong 12 tháng',
    popular: true
  },
  {
    id: 'tire-pressure',
    name: 'Cảm biến áp suất lốp van trong hiển thị màn hình',
    category: 'Bảo dưỡng & An toàn',
    price: 2400000,
    description: 'Cảnh báo rò rỉ khí hoặc nhiệt độ lốp bất thường ngay trên màn hình xe, tăng độ an toàn khi chạy cao tốc.',
    warranty: 'Bảo hành 2 năm'
  },
  {
    id: 'ceramic-coat',
    name: 'Gói phủ Ceramic 9H bóng gương chống xước dăm',
    category: 'Ngoại thất',
    price: 8000000,
    description: 'Tạo hiệu ứng lá sen kháng nước, ngăn ố sơn do phân chim, mưa axit và giữ màu sơn luôn bóng mới như xuất xưởng.',
    warranty: 'Bảo dưỡng định kỳ 6 tháng/lần trong 3 năm'
  },
  {
    id: 'soundproof',
    name: 'Gói cách âm hốc bánh & sàn xe vật liệu SIP Nga',
    category: 'Nội thất',
    price: 6500000,
    description: 'Triệt tiêu tiếng ồn rào rào từ mặt đường và sỏi đá văng, nâng cao sự tĩnh lặng vượt trội của xe điện.',
    warranty: 'Bảo hành trọn đời xe'
  }
];

export const INSURANCE_PACKAGES = [
  {
    id: 'ins-gold',
    name: 'Bảo hiểm thân vỏ 2 chiều VinFast Care (Gói Vàng)',
    ratePercent: 1.35, // 1.35% giá trị xe
    description: 'Bao gồm mất cắp bộ phận, thủy kích ngập nước, bồi thường không tính khấu hao thay mới 100%, cứu hộ miễn phí 24/7.',
    provider: 'Bảo Việt / PVI / PTI liên kết chính hãng'
  },
  {
    id: 'ins-silver',
    name: 'Bảo hiểm vật chất xe cơ bản (Gói Bạc)',
    ratePercent: 1.15,
    description: 'Bồi thường va chạm, cháy nổ, cọ quẹt trầy xước sơn, sửa chữa chính hãng tại tất cả xưởng dịch vụ VinFast toàn quốc.',
    provider: 'PVI / MIC liên kết chính hãng'
  }
];
