export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  imageUrl: string;
  category: string;
  externalUrl: string;
}

export const VINFAST_NEWS: NewsItem[] = [
  {
    id: 'news-vf3-carplay',
    title: 'NÂNG CẤP APPLE CARPLAY/ANDROID AUTO CHO VF 3 CHỈ TỪ 2,9 TRIỆU ĐỒNG*',
    excerpt: 'VinFast chính thức triển khai mở rộng chương trình nâng cấp Apple CarPlay/Android Auto tới toàn bộ chủ xe VF 3.',
    date: '22.04.2026',
    imageUrl: '/assets/aistudio/vf3-nang-cap-aa.ac-1920x1080_9c871b46.webp',
    category: 'Nâng cấp xe',
    externalUrl: 'https://vinfastauto.com/vn_vi/tin-tuc/o-to-dien',
    content: [
      'Nhằm nâng cao trải nghiệm giải trí và kết nối thông minh cho người dùng dòng xe mini SUV quốc dân VF 3, VinFast chính thức mở rộng chương trình nâng cấp tính năng Apple CarPlay và Android Auto không dây.',
      'Gói nâng cấp bao gồm: Màn hình giải trí mượt mà, hỗ trợ dẫn đường Google Maps/Apple Maps trực tiếp trên màn hình xe, nghe/gọi rảnh tay và ra lệnh bằng giọng nói thuận tiện.',
      'Chi phí ưu đãi trọn gói chỉ từ 2,9 triệu đồng tại tất cả các xưởng dịch vụ và đại lý 3S VinFast trên toàn quốc.'
    ]
  },
  {
    id: 'news-thu-xang-doi-dien',
    title: 'VinFast triển khai chuỗi 880 sự kiện Thu xăng đổi điện tại 88 trung tâm thương mại Vincom',
    excerpt: 'Từ tháng 10 đến tháng 12/2026, VinFast triển khai chuỗi 880 sự kiện “Thu xăng đổi điện – Chọn xe chọn VinFast” tại 88 trung tâm thương mại Vincom.',
    date: '22.10.2026',
    imageUrl: '/assets/aistudio/image-4_c5aacc01.jpg',
    category: 'Sự kiện & Ưu đãi',
    externalUrl: 'https://vinfastauto.com/vn_vi/tin-tuc/o-to-dien',
    content: [
      'Chiến dịch Vì Tương Lai Xanh quy mô lớn nhất từ trước đến nay: VinFast tổ chức liên tục 880 sự kiện định giá và thu mua xe xăng cũ chuyển đổi sang ô tô điện tại toàn bộ 88 TTTM Vincom trên 63 tỉnh thành.',
      'Khách hàng tham gia chương trình nhận ngay đặc quyền kép: Ưu đãi tới 9% áp dụng theo từng dòng xe, Voucher Chuyển Đổi Xanh lên tới 80 triệu đồng và gói hỗ trợ vay mua xe tới 100% giá trị xe từ các ngân hàng đối tác.',
      'Đội ngũ thẩm định chuyên nghiệp hỗ trợ định giá xe xăng cũ tận nơi nhanh chóng trong vòng 15 phút, thủ tục đổi xe đơn giản, giao xe điện mới ngay.'
    ]
  },
  {
    id: 'news-vf8-the-he-moi',
    title: 'VINFAST RA MẮT VF 8 THẾ HỆ MỚI - NÂNG CẤP TRẢI NGHIỆM TOÀN DIỆN CHO NGƯỜI DÙNG',
    excerpt: 'Ngày 20/5/2026, VinFast chính thức công bố ra mắt mẫu SUV điện cỡ D - VF 8 thế hệ mới - với nhiều nâng cấp đột phá về nền tảng công nghệ và hệ thống treo.',
    date: '20.05.2026',
    imageUrl: '/assets/aistudio/thumbs_vinfast-ra-mat-vf-8-the-he-moi-nang-cap-trai-nghiem-toan-dien-cho-nguoi-dung_0_3a1ed8dc.webp',
    category: 'Ra mắt xe mới',
    externalUrl: 'https://vinfastauto.com/vn_vi/tin-tuc/o-to-dien',
    content: [
      'Mẫu D-SUV điện toàn cầu VinFast VF 8 thế hệ mới sở hữu phong cách thiết kế tinh chỉnh sắc sảo, tối ưu khí động học và khoang nội thất nâng cấp chất liệu da cao cấp mới.',
      'Đột phá công nghệ với hệ thống treo thông minh mới giúp xe vận hành êm ái hơn trên mọi cung đường, trợ lý ảo tiếng Việt Vivi thế hệ mới tích hợp Generative AI đối thoại tự nhiên, cùng gói hỗ trợ lái ADAS cấp độ 2+ nâng cao.',
      'Dung lượng pin thế hệ mới cải thiện quãng đường di chuyển và tốc độ sạc siêu nhanh, đạt tiêu chuẩn an toàn cao nhất 5 sao Euro NCAP và NHTSA.'
    ]
  }
];
