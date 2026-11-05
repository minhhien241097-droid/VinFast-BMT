import { PromotionItem } from '../types';

export const PROMOTIONS_DATA: PromotionItem[] = [
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
    validUntil: 'Áp dụng liên tục trong năm nay'
  },
  {
    id: 'promo-free-charging',
    title: 'Đặc quyền sạc pin miễn phí tại trạm sạc V-GREEN',
    badge: 'Đặc quyền sạc xe',
    description: 'Miễn phí sạc pin tại mạng lưới trạm sạc công cộng V-GREEN phủ khắp 63 tỉnh thành trên toàn quốc.',
    details: [
      'Miễn phí sạc pin tới 1 - 2 năm tùy dòng xe và thời điểm nhận xe',
      'Miễn phí gửi xe dưới 5 tiếng tại tất cả trung tâm thương mại Vincom, Vinhomes',
      'Ưu tiên sạc nhanh tại các trạm dừng chân cao tốc và trạm xăng PVOIL / Petrolimex'
    ],
    validUntil: 'Áp dụng cho xe giao trong quý'
  },
  {
    id: 'promo-trade-in',
    title: 'Thu cũ đổi mới - Lên đời xe điện VinFast thưởng tới 50 triệu',
    badge: 'Thu cũ đổi mới',
    description: 'Hỗ trợ định giá xe xăng cũ tận nơi nhanh gọn, trợ giá trực tiếp khi chuyển đổi sang ô tô điện VinFast.',
    details: [
      'Thưởng tiền mặt 10.000.000đ khi lên đời VF 3 / VF 5',
      'Thưởng tiền mặt 30.000.000đ khi lên đời VF 6 / VF 7',
      'Thưởng tiền mặt 50.000.000đ khi lên đời VF 8 / VF 9',
      'Định giá minh bạch, nhận mọi dòng xe ô tô xăng đang lưu hành'
    ],
    validUntil: 'Số lượng suất có hạn'
  },
  {
    id: 'promo-interest-rate',
    title: 'Gói vay trả góp ưu đãi lãi suất cố định từ ngân hàng đối tác',
    badge: 'Hỗ trợ tài chính',
    description: 'Vay tới 80% - 85% giá trị xe trong thời gian đến 8 năm (96 tháng) với thủ tục duyệt hồ sơ trực tuyến chỉ trong 15 phút.',
    details: [
      'Lãi suất cố định chỉ từ 7% - 8%/năm trong 2-3 năm đầu',
      'Chỉ cần trả trước từ 45 - 60 triệu đồng nhận ngay xe VF 3 / VF 5',
      'Hỗ trợ khách hàng cá nhân & doanh nghiệp, không cần chứng minh thu nhập phức tạp'
    ],
    validUntil: 'Hợp tác cùng Vietcombank, Techcombank, BIDV, VPBank'
  },
  {
    id: 'promo-warranty',
    title: 'Chính sách bảo hành dài nhất thị trường: 7 - 10 năm',
    badge: 'An tâm tuyệt đối',
    description: 'Bảo hành chính hãng 7 năm / 160.000 km cho VF 3, VF 5, VF 6 và 10 năm / 200.000 km cho VF 7, VF 8, VF 9. Pin bảo hành 8 - 10 năm không giới hạn km.',
    details: [
      'Cứu hộ miễn phí 24/7 trong suốt thời gian bảo hành',
      'Dịch vụ sửa chữa lưu động Mobile Service tận nhà',
      'Cam kết giá trị mua lại xe sau 3-5 năm sử dụng với tỷ lệ bảo lưu cao'
    ],
    validUntil: 'Chính sách cam kết vĩnh viễn'
  }
];
