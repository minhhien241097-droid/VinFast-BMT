import { PromotionItem } from '../types';

export const PROMOTIONS_DATA: PromotionItem[] = [
  {
    id: 'promo-manh-liet-tuong-lai-xanh-2',
    title: 'Chương trình Mãnh Liệt Tương Lai Xanh 2',
    badge: 'Ưu đãi Khách hàng · Hot',
    description: 'Chương trình ưu đãi giảm giá trực tiếp cực kỳ hấp dẫn dành cho khách hàng khi mua xe điện VinFast.',
    details: [
      'Khách hàng thông thường: Ưu đãi giảm từ 3% - 9% giá xe tùy dòng xe',
      'Khách hàng Công an / Quân đội: Ưu đãi giảm từ 6% - 9% giá xe tùy dòng xe'
    ],
    validUntil: 'Diễn ra trong thời gian ngắn'
  },
  {
    id: 'promo-voucher-xe-xang',
    title: 'Tặng Voucher 30, 60, 80 triệu cho khách hàng sở hữu xe xăng VinFast',
    badge: 'Ưu đãi Khách hàng',
    description: 'Đặc quyền tri ân dành riêng cho khách hàng đang sở hữu các dòng xe xăng VinFast (Fadil, Lux A, Lux SA) khi mua các dòng ô tô điện VinFast.',
    details: [
      'Xe VinFast Fadil: Tặng Voucher ưu đãi trị giá 30.000.000đ',
      'Xe VinFast Lux A: Tặng Voucher ưu đãi trị giá 60.000.000đ',
      'Xe VinFast Lux SA: Tặng Voucher ưu đãi trị giá 80.000.000đ',
      'Không áp dụng đồng thời với các chương trình khác'
    ],
    validUntil: 'Áp dụng theo chính sách ưu đãi hiện hành'
  },
  {
    id: 'promo-0-tax',
    title: 'Miễn 100% lệ phí trước bạ theo chính sách Nhà Nước',
    badge: 'Chính sách Quốc gia',
    description: 'Khách hàng mua ô tô điện VinFast được miễn hoàn toàn 100% thuế trước bạ, tiết kiệm từ 30 triệu đến hơn 200 triệu đồng so với xe xăng cùng phân khúc.',
    details: [
      'Áp dụng cho toàn bộ các dòng xe điện: VF 3, VF 5, VF 6, VF 7, VF 8, VF 9',
      'Đăng ký bấm biển số chỉ nộp tiền biển, không mất tiền thuế trước bạ',
      'Tiết kiệm tức thì 10% - 12% giá trị xe so với xe động cơ đốt trong'
    ],
    validUntil: 'Áp dụng dài hạn theo nghị định Chính phủ'
  },
  {
    id: 'promo-interest-rate',
    title: 'Gói vay trả góp ưu đãi lãi suất cố định từ ngân hàng đối tác',
    badge: 'Hỗ trợ tài chính',
    description: 'Vay tới 80% - 85% giá trị xe trong thời gian đến 8 năm (96 tháng) với thủ tục duyệt hồ sơ trực tuyến nhanh chóng.',
    details: [
      'Lãi suất cố định chỉ từ 7% - 8%/năm trong 2-3 năm đầu',
      'Chỉ cần trả trước từ 45 - 60 triệu đồng nhận ngay xe VF 3 / VF 5',
      'Hỗ trợ khách hàng cá nhân & doanh nghiệp, không cần chứng minh thu nhập phức tạp'
    ],
    validUntil: 'VinFast liên kết với các ngân hàng có chính sách tốt nhất, hỗ trợ hồ sơ nhanh trong ngày'
  }
];
