import { CarModel } from '../types';

export const VINFAST_CARS: CarModel[] = [
  // 1. MINI ĐÔ THỊ
  {
    id: 'vf2',
    name: 'VinFast VF 2',
    versions: 'Bản Tiêu chuẩn',
    versionBadge: 'Tiêu chuẩn',
    tagline: 'Mẫu ô tô điện đô thị 2 cửa, 4 chỗ ngồi nhỏ gọn và kinh tế bậc nhất',
    segment: 'Mini đô thị',
    categoryGroup: 'mini',
    categoryLabel: 'Mini đô thị',
    seats: 4,
    bodyType: 'Hatchback',
    price: 188000000,
    versionPrices: [
      { name: 'VF 2 Tiêu chuẩn', price: 188000000 }
    ],
    priceNoBattery: 188000000,
    priceWithBattery: 188000000,
    rangePerCharge: 210,
    rangeDisplay: '210 km',
    rangeText: '210 km/lần sạc',
    batteryCapacity: 18.3,
    batteryDisplay: '18,3 kWh',
    seatsDisplay: '4 chỗ',
    powerKw: '30 kW',
    chargingTimeFast: 'Khoảng 34 phút (10% - 70%)',
    horsepower: 40,
    torque: 65,
    drivetrain: 'RWD (Cầu sau)',
    dimensions: '3.090 x 1.496 x 1.663,2 mm',
    wheelbase: '2.065 mm',
    groundClearance: '165 mm',
    wheelSize: '13 inch',
    topSpeed: '80 km/h (2 chế độ lái Eco & Normal)',
    warrantyCar: '5 năm hoặc 130.000 km',
    warrantyBattery: '7 năm hoặc 160.000 km',
    description: 'VinFast VF 2 là mẫu ô tô điện đô thị cỡ nhỏ thông minh với thiết kế 2 cửa bên, 1 cửa cốp và 4 chỗ ngồi tối ưu. Xe sở hữu chiều dài chỉ 3.090 mm cùng bán kính quay vòng nhỏ linh hoạt, tối ưu cho nhu cầu đi làm, đưa đón con nhỏ và đi lại phố thị hằng ngày với mức giá 188 triệu đồng kèm pin trọn đời.',
    keyFeatures: [
      'Giá bán niêm yết: 188.000.000 VNĐ (đã gồm VAT)',
      'Hỗ trợ tư vấn đặt cọc, nhận xe sớm và ưu đãi trực tiếp tại Đại lý VinFast Bình Phước',
      'Tầm vận hành 210 km (chuẩn NEDC) / lần sạc, sạc nhanh DC 10-70% trong 34 phút',
      'Động cơ điện cầu sau RWD 30 kW (~40 Hp), mô-men xoắn cực đại 65 Nm, tốc độ tối đa 80 km/h',
      'Kích thước gọn gàng: 3.090 x 1.496 x 1.663 mm, chiều dài cơ sở 2.065 mm, gầm cao 165 mm',
      'Bảo hành chính hãng: Xe 5 năm/130.000 km, pin cao áp 7 năm/160.000 km',
      'Màn hình hiển thị kỹ thuật số 7 inch sau vô-lăng, điều hòa làm mát nhanh',
      'An toàn với túi khí người lái, hệ thống chống bó phanh ABS, phân phối EBD, kiểm soát TCS',
      'Cắm sạc gia đình 220V dễ dàng, miễn phí sạc pin tại hệ thống trạm V-GREEN'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf2-mau-xanh-menu_83825ac5.webp',
    bannerUrl: '/assets/aistudio/vf_2_9e9a24cd.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Bạc', hex: '#CBD5E1', colorCode: 'silver', extraFee: 0 },
      { name: 'Xanh lá nhạt', hex: '#86EFAC', colorCode: 'mint', extraFee: 8000000, isAdvanced: true },
      { name: 'Vàng', hex: '#FACC15', colorCode: 'yellow', extraFee: 8000000, isAdvanced: true },
      { name: 'Xanh dương', hex: '#38BDF8', colorCode: 'sky', extraFee: 8000000, isAdvanced: true },
      { name: 'Hồng', hex: '#F472B6', colorCode: 'pink', extraFee: 8000000, isAdvanced: true },
      { name: 'Be', hex: '#E2D4BA', colorCode: 'beige', extraFee: 8000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 2100000
  },
  {
    id: 'vf3',
    name: 'VinFast VF 3',
    versions: 'gồm 2 phiên bản: Eco và Plus',
    versionBadge: 'Eco và Plus',
    tagline: 'Mini-eSUV cá tính, nhỏ gọn và năng động quốc dân',
    segment: 'Mini đô thị',
    categoryGroup: 'mini',
    categoryLabel: 'Mini đô thị',
    seats: 4,
    bodyType: 'Mini SUV',
    price: 285000000,
    versionPrices: [
      { name: 'VF 3 Eco', price: 285000000 },
      { name: 'VF 3 Plus', price: 296000000 }
    ],
    priceNoBattery: 285000000,
    priceWithBattery: 285000000,
    rangePerCharge: 215,
    rangeDisplay: '215 km',
    rangeText: '215 km/lần sạc',
    batteryCapacity: 18.64,
    batteryDisplay: '18,64 kWh',
    seatsDisplay: '4 chỗ',
    powerKw: '30 kW',
    chargingTimeFast: 'Khoảng 36 phút (10% - 70%)',
    horsepower: 43,
    torque: 110,
    drivetrain: 'RWD (Cầu sau)',
    dimensions: '3.190 x 1.679 x 1.622 mm',
    wheelbase: '2.075 mm',
    groundClearance: '191 mm',
    wheelSize: '16 inch thể thao',
    topSpeed: '100 km/h',
    warrantyCar: '7 năm hoặc 160.000 km',
    warrantyBattery: '8 năm không giới hạn số km',
    description: 'VinFast VF 3 là mẫu mini-eSUV cá tính, nhỏ gọn và năng động, tối ưu cho nhu cầu di chuyển linh hoạt trong đô thị và thể hiện phong cách riêng. Với khoảng sáng gầm ấn tượng 191 mm và mâm xe 16 inch bề thế, VF 3 dễ dàng vượt qua các cung đường gồ ghề hay ngập nước mùa mưa.',
    keyFeatures: [
      'Giá bán niêm yết: VF 3 Eco 285.000.000 VNĐ | VF 3 Plus 296.000.000 VNĐ',
      'Hỗ trợ tư vấn đặt cọc, nhận xe sớm và ưu đãi trực tiếp tại Đại lý VinFast Bình Phước',
      'Tùy chọn 2 phiên bản: Eco (285 Tr) và Plus (296 Tr) phù hợp mọi nhu cầu cá tính',
      'Tầm di chuyển 215 km (chuẩn NEDC) / lần sạc đầy, sạc nhanh DC 10-70% trong 36 phút',
      'Khoảng sáng gầm xe 191 mm vượt vỉa hè và đường ngập nước êm ái hàng đầu phân khúc',
      'Màn hình cảm ứng giải trí 10 inch sắc nét, hỗ trợ kết nối Apple CarPlay & Android Auto',
      'La-zăng thể thao 16 inch nổi bật cùng 7 gam màu ngoại thất phối nóc trắng thời trang',
      'Bảo hành chính hãng: Xe 7 năm/160.000 km, pin cao áp 8 năm không giới hạn km',
      'Miễn 100% lệ phí trước bạ, hỗ trợ gói vay trả góp tới 80% giá trị xe'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf3-mau-vang-menu_89eac25c.webp',
    bannerUrl: '/assets/aistudio/vf3_9a8615f0.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Xám', hex: '#64748B', colorCode: 'grey', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Xanh lá nhạt', hex: '#86EFAC', colorCode: 'mint', extraFee: 8000000, isAdvanced: true },
      { name: 'Vàng nóc trắng', hex: '#FACC15', roofHex: '#FFFFFF', colorCode: 'yellow-white', extraFee: 8000000, isAdvanced: true },
      { name: 'Xanh dương nóc trắng', hex: '#38BDF8', roofHex: '#FFFFFF', colorCode: 'sky-white', extraFee: 8000000, isAdvanced: true },
      { name: 'Hồng nóc trắng', hex: '#F472B6', roofHex: '#FFFFFF', colorCode: 'pink-white', extraFee: 8000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 3200000,
    isPopular: true
  },

  // 2. SUV 5 CHỖ
  {
    id: 'vf5',
    name: 'VinFast VF 5',
    versions: 'Bản Plus',
    versionBadge: 'Plus',
    tagline: 'A-SUV đô thị hiện đại, đa dụng cho cá nhân & gia đình trẻ',
    segment: 'SUV 5 chỗ',
    categoryGroup: 'suv5',
    categoryLabel: 'SUV 5 chỗ',
    seats: 5,
    bodyType: 'SUV',
    price: 496000000,
    versionPrices: [
      { name: 'VF 5 Plus', price: 496000000 }
    ],
    priceNoBattery: 496000000,
    priceWithBattery: 496000000,
    rangePerCharge: 326,
    rangeDisplay: '326 km',
    rangeText: '326 km/lần sạc',
    batteryCapacity: 37.23,
    batteryDisplay: '37,23 kWh',
    seatsDisplay: '5 chỗ',
    powerKw: '100 kW',
    chargingTimeFast: 'Khoảng 30 phút (10% - 70%)',
    horsepower: 134,
    torque: 135,
    drivetrain: 'FWD (Cầu trước)',
    dimensions: '3.965 x 1.720 x 1.580 mm',
    wheelbase: '2.513 mm',
    groundClearance: '182 mm',
    wheelSize: '17 inch hợp kim nhôm',
    topSpeed: '130 km/h',
    warrantyCar: '7 năm hoặc 160.000 km',
    warrantyBattery: '8 năm không giới hạn số km',
    description: 'VinFast VF 5 Plus là mẫu A-SUV đô thị hiện đại, đa dụng, phù hợp cho cá nhân và gia đình trẻ phục vụ nhu cầu đi lại hằng ngày hoặc du lịch cuối tuần. Sở hữu động cơ 134 mã lực mạnh mẽ vượt trội trong phân khúc cùng khoang hành khách rộng rãi và chi phí nuôi xe siêu tiết kiệm.',
    keyFeatures: [
      'Giá bán niêm yết VF 5 Plus: 496.000.000 VNĐ (đã gồm VAT)',
      'Hỗ trợ tư vấn đặt cọc, giao xe nhanh và ưu đãi độc quyền tại VinFast Bình Phước',
      'Động cơ điện công suất tối đa 100 kW (~134 Hp), mô-men xoắn 135 Nm vận hành mạnh mẽ',
      'Quãng đường di chuyển 326 km (NEDC) sau 1 lần sạc đầy, sạc nhanh DC 10-70% trong 30 phút',
      'Khoảng sáng gầm xe 182 mm tự tin leo vỉa hè và vượt chướng ngại vật đô thị',
      'Trang bị an toàn hàng đầu: 6 túi khí, phanh đĩa 4 bánh, giám sát hành trình và cảnh báo điểm mù',
      'Bảng đồng hồ kỹ thuật số cùng màn hình cảm ứng trung tâm 8 inch sắc nét',
      'Bảo hành chính hãng: Xe 7 năm/160.000 km, pin cao áp 8 năm không giới hạn km',
      'Cắm sạc gia đình 220V dễ dàng, miễn phí sạc pin tại hệ thống trạm V-GREEN'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf5-mau-xam-menu_137a54cb.webp',
    bannerUrl: '/assets/aistudio/vf_5_8316adfd.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Xám', hex: '#64748B', colorCode: 'grey', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Xanh lá nhạt', hex: '#86EFAC', colorCode: 'mint', extraFee: 8000000, isAdvanced: true },
      { name: 'Vàng nóc đen', hex: '#FACC15', roofHex: '#0F172A', colorCode: 'yellow-black', extraFee: 8000000, isAdvanced: true },
      { name: 'Xanh dương nóc trắng', hex: '#38BDF8', roofHex: '#FFFFFF', colorCode: 'sky-white', extraFee: 8000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 4700000,
    isPopular: true
  },
  {
    id: 'vf6',
    name: 'VinFast VF 6',
    versions: 'gồm 2 phiên bản: Eco và Plus',
    versionBadge: 'Eco và Plus',
    tagline: 'B-SUV điện phong cách Ý, vận hành mạnh mẽ và tiện nghi vượt tầm phân khúc',
    segment: 'SUV 5 chỗ',
    categoryGroup: 'suv5',
    categoryLabel: 'SUV 5 chỗ',
    seats: 5,
    bodyType: 'SUV',
    price: 646000000,
    versionPrices: [
      { name: 'VF 6 Eco', price: 646000000 },
      { name: 'VF 6 Plus', price: 699000000 }
    ],
    priceNoBattery: 646000000,
    priceWithBattery: 646000000,
    rangePerCharge: 460,
    rangeDisplay: '460 km',
    rangeText: '460 km/lần sạc',
    batteryCapacity: 59.6,
    batteryDisplay: '59,6 kWh',
    seatsDisplay: '5 chỗ',
    powerKw: '150 kW',
    chargingTimeFast: 'Khoảng 24 phút (10% - 70%)',
    horsepower: 201,
    torque: 310,
    drivetrain: 'FWD (Cầu trước)',
    dimensions: '4.238 x 1.820 x 1.594 mm',
    wheelbase: '2.730 mm',
    groundClearance: '170 mm',
    wheelSize: '17 inch (Eco) / 19 inch (Plus)',
    topSpeed: '160 km/h',
    warrantyCar: '7 năm hoặc 160.000 km',
    warrantyBattery: '8 năm không giới hạn số km',
    description: 'Mẫu B-SUV điện phong cách, vận hành mạnh mẽ và tiện nghi, là lựa chọn lý tưởng cho các gia đình trẻ yêu thích công nghệ và trải nghiệm lái. Thiết kế chắp bút bởi Torino Design danh tiếng từ Ý với trục cơ sở 2.730 mm đem đến khoang nội thất rộng ngang các dòng SUV hạng C.',
    keyFeatures: [
      'Giá bán niêm yết: VF 6 Eco 646.000.000 VNĐ | VF 6 Plus 699.000.000 VNĐ',
      'Hỗ trợ tư vấn đặt cọc, lái thử tận nơi và ưu đãi hấp dẫn tại VinFast Bình Phước',
      '2 phiên bản Eco (646 Tr) và Plus (699 Tr) với công suất tối đa lên tới 201 Hp, 310 Nm',
      'Tầm vận hành 485 km (Eco) / 470 km (Plus) theo chuẩn NEDC, sạc nhanh 10-70% chỉ 24 phút',
      'Trục cơ sở 2.730 mm vượt trội, đem đến không gian để chân hàng ghế thứ 2 rộng rãi bậc nhất',
      'Hệ thống hỗ trợ lái nâng cao ADAS cấp độ 2: Ga tự động thích ứng, hỗ trợ giữ làn, phanh khẩn cấp',
      'Màn hình cảm ứng 12.9 inch hướng về người lái, ghế bọc da cao cấp tích hợp thông gió',
      'Bảo hành chính hãng: Xe 7 năm/160.000 km, pin 8 năm không giới hạn km',
      'Miễn 100% lệ phí trước bạ, miễn phí sạc pin tại mạng lưới trạm V-GREEN'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf6-mau-do-menu_24b654e8.webp',
    bannerUrl: '/assets/aistudio/vf6_6c213fd5.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Xám', hex: '#64748B', colorCode: 'grey', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Xanh lá nhạt', hex: '#86EFAC', colorCode: 'mint', extraFee: 8000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 5900000
  },
  {
    id: 'vf7',
    name: 'VinFast VF 7',
    versions: 'gồm 2 phiên bản: Eco và Plus',
    versionBadge: 'Eco và Plus',
    tagline: 'C-SUV điện thể thao, thiết kế Vũ trụ phi đối xứng cá tính & bứt phá',
    segment: 'SUV 5 chỗ',
    categoryGroup: 'suv5',
    categoryLabel: 'SUV 5 chỗ',
    seats: 5,
    bodyType: 'SUV',
    price: 740000000,
    versionPrices: [
      { name: 'VF 7 Eco', price: 740000000 },
      { name: 'VF 7 Plus', price: 830000000 }
    ],
    priceNoBattery: 740000000,
    priceWithBattery: 740000000,
    rangePerCharge: 500.5,
    rangeDisplay: '500,5 km',
    rangeText: '500,5 km/lần sạc',
    batteryCapacity: 70.0,
    batteryDisplay: '70 kWh',
    seatsDisplay: '5 chỗ',
    powerKw: '260 kW',
    chargingTimeFast: 'Khoảng 24 phút (10% - 70%)',
    horsepower: 349,
    torque: 500,
    drivetrain: 'AWD (Dẫn động 2 cầu điện tử toàn thời gian)',
    dimensions: '4.545 x 1.890 x 1.636 mm',
    wheelbase: '2.840 mm',
    groundClearance: '190 mm',
    wheelSize: '19 inch (Eco) / 20 inch (Plus)',
    topSpeed: '175 km/h',
    warrantyCar: '7 năm hoặc 160.000 km',
    warrantyBattery: '8 năm không giới hạn số km',
    description: 'VinFast VF 7 là mẫu C-SUV điện thể thao mang triết lý thiết kế "Vũ trụ phi đối xứng" đầy mê hoặc do Torino Design kiến tạo. Phiên bản Plus trang bị 2 mô-tơ điện công suất cực khủng 349 mã lực và dẫn động AWD, tăng tốc 0-100 km/h chỉ mất 5,8 giây mang lại cảm giác lái thể thao thăng hoa.',
    keyFeatures: [
      'Giá bán niêm yết: VF 7 Eco 740.000.000 VNĐ | VF 7 Plus 830.000.000 VNĐ',
      'Tư vấn cọc xe, đăng ký lái thử trực tiếp và hỗ trợ trả góp tại VinFast Bình Phước',
      '2 phiên bản: VF 7 Eco (740 Tr, 174 Hp) và VF 7 Plus (830 Tr, 349 Hp, AWD 2 cầu toàn thời gian)',
      'Tăng tốc 0-100 km/h chỉ 5.8 giây, khả năng bám đường và đầm chắc tuyệt hảo',
      'Dung lượng pin 75,3 kWh (Plus) cho tầm di chuyển lên tới 496 km sau một lần sạc',
      'Trần kính toàn cảnh Panorama sang trọng, màn hình HUD hiển thị kính lái hiện đại',
      'Hệ thống an toàn chủ động ADAS cấp độ 2 tiên tiến hỗ trợ lái cao tốc và đô thị',
      'Bảo hành chính hãng: Xe 7 năm/160.000 km, pin 8 năm không giới hạn số km',
      'Miễn 100% lệ phí trước bạ, dịch vụ cứu hộ giao thông 24/7 hoàn toàn miễn phí'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf7-mau-xanh-menu_9b1a0feb.webp',
    bannerUrl: '/assets/aistudio/vf_7_f93a5c2f.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Xám', hex: '#64748B', colorCode: 'grey', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Xanh lá nhạt', hex: '#86EFAC', colorCode: 'mint', extraFee: 12000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 6900000,
    isPopular: true
  },
  {
    id: 'vf8',
    name: 'VinFast VF 8',
    versions: 'gồm 2 phiên bản: Eco và Plus',
    versionBadge: 'Eco & Plus',
    tagline: 'D-SUV điện đẳng cấp toàn cầu, trợ lý ảo AI thông minh & công nghệ dẫn đầu',
    segment: 'SUV 5 chỗ',
    categoryGroup: 'suv5',
    categoryLabel: 'SUV 5 chỗ',
    seats: 5,
    bodyType: 'SUV',
    price: 898000000,
    versionPrices: [
      { name: 'VF 8 Eco', price: 898000000 },
      { name: 'VF 8 Plus', price: 1079000000 }
    ],
    priceNoBattery: 898000000,
    priceWithBattery: 898000000,
    rangePerCharge: 562,
    rangeDisplay: '562 km',
    rangeText: '562 km/lần sạc',
    batteryCapacity: 87.7,
    batteryDisplay: '87,7 kWh',
    seatsDisplay: '5 chỗ',
    powerKw: '300 kW',
    chargingTimeFast: 'Khoảng 24 phút (10% - 70%)',
    horsepower: 402,
    torque: 620,
    drivetrain: 'AWD (Dẫn động 2 cầu toàn thời gian thông minh)',
    dimensions: '4.750 x 1.934 x 1.667 mm',
    wheelbase: '2.950 mm',
    groundClearance: '175 mm',
    wheelSize: '19 - 20 inch hợp kim thể thao',
    topSpeed: '200 km/h',
    warrantyCar: '10 năm hoặc 200.000 km',
    warrantyBattery: '10 năm không giới hạn số km',
    description: 'Mẫu D-SUV điện đẳng cấp toàn cầu đạt tiêu chuẩn an toàn 5 sao NHTSA và Euro NCAP. Xe tích hợp hệ thống trợ lý ảo thông minh ViVi, công nghệ lái bán tự động Highway Assist, thiết kế tinh xảo Pininfarina, khoang cabin sang trọng khoáng đạt.',
    keyFeatures: [
      'Giá bán niêm yết: VF 8 Eco 898.000.000 VNĐ | VF 8 Plus 1.079.000.000 VNĐ',
      'Đặt cọc, bàn giao xe và nhận gói quà tặng ưu đãi tại Đại lý VinFast Bình Phước',
      '2 tùy chọn phiên bản: VF 8 Eco (898 Tr) và VF 8 Plus (1.079 Tr)',
      'Công suất cực đại lên tới 402 mã lực, mô-men xoắn 620 Nm, dẫn động 2 cầu AWD thông minh',
      'Pin dung lượng cao 87,7 kWh cho quãng đường di chuyển tới 562 km (NEDC) / lần sạc đầy',
      'Trợ lý ảo tiếng Việt ViVi, màn hình giải trí 15.6 inch, tính năng điều khiển nhà thông minh Smart Home',
      'Chính sách bảo hành kỷ lục: Xe 10 năm hoặc 200.000 km, pin 10 năm không giới hạn km'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf8-mau-xanh-menu.webp',
    bannerUrl: '/assets/aistudio/hinh-anh-xe-VinFast-vf8-lai-xe-do-thi-mau-do-01.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Xanh lá đậm', hex: '#154734', colorCode: 'green', extraFee: 0 },
      { name: 'Đỏ nóc đồng', hex: '#881337', roofHex: '#C5A059', colorCode: 'red-bronze', extraFee: 12000000, isAdvanced: true },
      { name: 'Xám nóc bạc', hex: '#64748B', roofHex: '#CBD5E1', colorCode: 'grey-silver', extraFee: 12000000, isAdvanced: true },
      { name: 'Trắng nóc xám', hex: '#F8FAFC', roofHex: '#64748B', colorCode: 'white-grey', extraFee: 12000000, isAdvanced: true },
      { name: 'Đen nóc đồng', hex: '#0F172A', roofHex: '#C5A059', colorCode: 'black-bronze', extraFee: 12000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 8200000
  },
  {
    id: 'vf8_thm',
    name: 'VinFast VF 8 Thế hệ mới',
    versions: 'The All New 2026',
    versionBadge: 'All New 2026',
    tagline: 'D-SUV điện thế hệ mới The All New 2026, ngôn ngữ thiết kế Tech Fluid đột phá',
    segment: 'SUV 5 chỗ',
    categoryGroup: 'suv5',
    categoryLabel: 'SUV 5 chỗ',
    seats: 5,
    bodyType: 'SUV',
    price: 899000000,
    versionPrices: [
      { name: 'VF 8 Thế hệ mới', price: 899000000 }
    ],
    priceNoBattery: 899000000,
    priceWithBattery: 899000000,
    rangePerCharge: 500,
    rangeDisplay: '480 – 500 km',
    rangeText: '480 – 500 km/lần sạc',
    batteryCapacity: 60.13,
    batteryDisplay: '60,13 kWh',
    seatsDisplay: '5 chỗ',
    powerKw: '170 kW',
    chargingTimeFast: 'Khoảng 24 phút (10% - 70%)',
    horsepower: 231,
    torque: 620,
    drivetrain: 'AWD (Dẫn động 2 cầu toàn thời gian thông minh)',
    dimensions: '4.701 x 1.872 x 1.670 mm',
    wheelbase: '2.840 mm',
    groundClearance: '175 mm',
    wheelSize: '19 - 20 inch thể thao',
    topSpeed: '200 km/h',
    warrantyCar: '10 năm hoặc 200.000 km',
    warrantyBattery: '10 năm không giới hạn số km',
    description: 'Phiên bản VF 8 Thế Hệ Mới (The All New 2026) ứng dụng triết lý thiết kế Tech Fluid liền mạch, hiện đại và đậm chất tương lai. Công nghệ trợ lý ảo vivi, kết nối đa nền tảng và trang bị hỗ trợ lái cấp độ cao.',
    keyFeatures: [
      'Giá bán niêm yết: VF 8 Thế hệ mới 899.000.000 VNĐ (đã gồm VAT)',
      'Thiết kế Tech Fluid thế hệ mới khí động học tối ưu và cụm đèn LED định vị cánh chim thế hệ mới',
      'Động cơ điện AWD dẫn động 4 bánh mạnh mẽ, khả năng tăng tốc tức thì vượt trội',
      'Miễn phí sạc pin tại mạng lưới trạm sạc V-GREEN phủ khắp 63 tỉnh thành'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf8-mau-cam-trang-den-menu_4cc0b91f.webp',
    bannerUrl: '/assets/aistudio/vf8_c6f9e977.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Xanh dương', hex: '#1D4ED8', colorCode: 'blue', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Cam', hex: '#EA580C', colorCode: 'orange', extraFee: 12000000, isAdvanced: true },
      { name: 'Tím', hex: '#7C3AED', colorCode: 'purple', extraFee: 12000000, isAdvanced: true },
      { name: 'Đỏ nóc đen', hex: '#DC2626', roofHex: '#0F172A', colorCode: 'red-black', extraFee: 12000000, isAdvanced: true },
      { name: 'Cam nóc đen', hex: '#EA580C', roofHex: '#0F172A', colorCode: 'orange-black', extraFee: 12000000, isAdvanced: true },
      { name: 'Cam nóc trắng', hex: '#EA580C', roofHex: '#FFFFFF', colorCode: 'orange-white', extraFee: 12000000, isAdvanced: true },
      { name: 'Xanh dương nóc trắng', hex: '#1D4ED8', roofHex: '#FFFFFF', colorCode: 'blue-white', extraFee: 12000000, isAdvanced: true },
      { name: 'Tím nóc bạc', hex: '#7C3AED', roofHex: '#CBD5E1', colorCode: 'purple-silver', extraFee: 12000000, isAdvanced: true },
      { name: 'Đen nóc bạc', hex: '#0F172A', roofHex: '#CBD5E1', colorCode: 'black-silver', extraFee: 12000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 8250000
  },

  // 3. XE HẠNG SANG
  {
    id: 'vf9',
    name: 'VinFast VF 9',
    versions: 'gồm 2 phiên bản: Eco và Plus (Tùy chọn 6 chỗ Captain hoặc 7 chỗ)',
    versionBadge: 'Eco và Plus',
    tagline: 'E-SUV điện hạng sang cỡ lớn, trải nghiệm đỉnh cao chuẩn thương gia',
    segment: 'Xe hạng sang',
    categoryGroup: 'luxury',
    categoryLabel: 'Xe hạng sang',
    seats: 7,
    bodyType: 'SUV',
    price: 1348000000,
    versionPrices: [
      { name: 'VF 9 Eco', price: 1348000000 },
      { name: 'VF 9 Plus (7 chỗ)', price: 1529000000 },
      { name: 'VF 9 Plus (ghế cơ trưởng)', price: 1561000000 }
    ],
    priceNoBattery: 1348000000,
    priceWithBattery: 1348000000,
    rangePerCharge: 602,
    rangeDisplay: '602 km',
    rangeText: '602 km/lần sạc',
    batteryCapacity: 123.0,
    batteryDisplay: '123 kWh',
    seatsDisplay: '6-7 chỗ',
    powerKw: '300 kW',
    chargingTimeFast: 'Khoảng 26 phút (10% - 70%)',
    horsepower: 402,
    torque: 620,
    drivetrain: 'AWD thông minh 2 cầu toàn thời gian',
    dimensions: '5.118 x 2.254 x 1.696 mm',
    wheelbase: '3.150 mm',
    groundClearance: '197 mm',
    wheelSize: '20 - 21 inch sang trọng',
    topSpeed: '200 km/h',
    warrantyCar: '10 năm hoặc 200.000 km',
    warrantyBattery: '10 năm không giới hạn số km',
    description: 'Mẫu E-SUV điện hạng sang cỡ lớn đỉnh cao nhất của VinFast, chắp bút bởi Pininfarina (Ý). Xe sở hữu chiều dài hơn 5,1 mét, hàng ghế thương gia độc lập tích hợp massage, sưởi và thông gió, cùng hệ thống treo khí nén điện tử êm ái tuyệt đối.',
    keyFeatures: [
      'Giá bán niêm yết: VF 9 Eco 1.348.000.000 VNĐ | VF 9 Plus (7 chỗ) 1.529.000.000 VNĐ | VF 9 Plus (ghế cơ trưởng) 1.561.000.000 VNĐ',
      'Tư vấn cọc xe, dịch vụ tiếp đón VIP và trải nghiệm lái xe tại VinFast Bình Phước',
      'Các tùy chọn: VF 9 Eco (1.348 Tr), Plus 7 chỗ (1.529 Tr), Plus ghế cơ trưởng (1.561 Tr)',
      'Dung lượng pin khủng 123 kWh (chuẩn CATL), tầm vận hành vượt trội lên tới 626 km',
      'Động cơ 402 mã lực, mô-men xoắn 620 Nm cùng hệ thống treo khí nén điện tử chủ động',
      'Nội thất da cao cấp, hàng ghế cơ trưởng chỉnh điện 8 hướng, massage, làm mát và sưởi',
      'Cửa hít tự động, trần kính toàn cảnh chống tia UV, màn hình giải trí 15.6 inch siêu nét',
      'Bảo hành chính hãng số một: Xe 10 năm/200.000 km, pin 10 năm không giới hạn km',
      'Đặc quyền chăm sóc hậu mãi VIP cùng mạng lưới sạc nhanh siêu tốc V-GREEN'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf9-mau-xam-menu_1dfee184.webp',
    bannerUrl: '/assets/aistudio/vf9_51900683.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Xám', hex: '#64748B', colorCode: 'grey', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Xanh lá nhạt', hex: '#86EFAC', colorCode: 'mint', extraFee: 0 },
      { name: 'Xanh lá đậm', hex: '#154734', colorCode: 'green', extraFee: 12000000, isAdvanced: true },
      { name: 'Bạc', hex: '#94A3B8', colorCode: 'silver', extraFee: 12000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 12500000,
    isPopular: true
  },

  // 4. XE SUV 7 CHỖ
  {
    id: 'mpv7',
    name: 'VinFast VF MPV 7',
    versions: 'Bản 7 Chỗ Gia Đình',
    versionBadge: 'Gia đình',
    tagline: 'MPV điện 7 chỗ cỡ lớn đa dụng, không gian thoáng rộng và tiện nghi đẳng cấp',
    segment: 'Xe SUV 7 chỗ',
    categoryGroup: 'suv7',
    categoryLabel: 'Xe SUV 7 chỗ',
    seats: 7,
    bodyType: 'MPV',
    price: 750000000,
    versionPrices: [
      { name: 'VF MPV 7', price: 750000000 }
    ],
    priceNoBattery: 750000000,
    priceWithBattery: 750000000,
    rangePerCharge: 450,
    rangeDisplay: '450 km',
    rangeText: '450 km/lần sạc',
    batteryCapacity: 60.13,
    batteryDisplay: '60,13 kWh',
    seatsDisplay: '7 chỗ',
    powerKw: '150 kW',
    chargingTimeFast: 'Khoảng 25 phút (10% - 70%)',
    horsepower: 201,
    torque: 280,
    drivetrain: 'FWD (Cầu trước)',
    dimensions: '4.740 x 1.872 x 1.734 mm',
    wheelbase: '2.840 mm',
    groundClearance: '165 mm',
    wheelSize: '18 inch hợp kim',
    topSpeed: '160 km/h',
    warrantyCar: '7 năm hoặc 160.000 km',
    warrantyBattery: '8 năm hoặc 160.000 km',
    description: 'Mẫu MPV điện đô thị 7 chỗ không gian rộng rãi, tiện nghi tối ưu, được thiết kế chuyên biệt cho đại gia đình và dịch vụ đón chở cao cấp biển trắng. Thiết kế sàn phẳng cùng cửa trượt mở rộng tối đa không gian ra vào.',
    keyFeatures: [
      'Giá bán niêm yết: 750.000.000 VNĐ (đã gồm VAT)',
      'Tư vấn cọc xe, đặt lịch lái thử thực tế và ưu đãi nhận xe sớm tại VinFast Bình Phước',
      'Cấu hình 7 chỗ ngồi thực thụ (3 hàng ghế), khoảng duỗi chân thoải mái cho cả người lớn',
      'Dung lượng pin 60,13 kWh cho tầm di chuyển dài tới 450 km (NEDC) sau mỗi lần sạc',
      'Mô-tơ điện công suất 150 kW (~201 mã lực), vận hành êm ái, bốc và tiết kiệm',
      'Khoang hành lý rộng rãi, có thể mở rộng lên tới 1.240 lít khi gập hàng ghế thứ 3',
      'Hệ thống điều hòa đa vùng cửa gió từng hàng ghế, màn hình trung tâm đa chức năng',
      'Bảo hành chính hãng: Xe 7 năm/160.000 km, pin cao áp 8 năm',
      'Miễn 100% lệ phí trước bạ, chi phí sử dụng hàng ngày chỉ bằng 1/3 xe xăng cùng phân khúc'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf-mpv7-mau-xanh-menu_52eb252d.webp',
    bannerUrl: '/assets/aistudio/mpv_d76bd610.jpg',
    colors: [
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Xám', hex: '#64748B', colorCode: 'grey', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Xanh dương', hex: '#1D4ED8', colorCode: 'blue', extraFee: 10000000, isAdvanced: true },
      { name: 'Nâu', hex: '#5C3D2E', colorCode: 'brown', extraFee: 10000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 6900000
  },

  // 5. XE BÁN TẢI
  {
    id: 'vfwild',
    name: 'VinFast VF Wild',
    versions: 'Bản Bán Tải REEV',
    versionBadge: 'REEV',
    tagline: 'Bán tải điện cỡ trung mạnh mẽ, công nghệ mở rộng hành trình REEV 1.000 km',
    segment: 'Xe bán tải',
    categoryGroup: 'pickup',
    categoryLabel: 'Xe bán tải',
    seats: 5,
    bodyType: 'Pickup',
    price: 860000000,
    versionPrices: [
      { name: 'VF Wild', price: 860000000 }
    ],
    priceNoBattery: 860000000,
    priceWithBattery: 860000000,
    rangePerCharge: 1000,
    rangeDisplay: '1.000 km/hỗn hợp',
    rangeText: '1.000 km/hỗn hợp',
    batteryCapacity: 46.4,
    batteryDisplay: '46,4 kWh',
    seatsDisplay: '5 chỗ',
    powerKw: '160 kW',
    chargingTimeFast: 'Khoảng 25 phút (10% - 70%)',
    horsepower: 380,
    torque: 550,
    drivetrain: 'Đang cập nhật',
    dimensions: '5.376 x 2.069 x 1.873 mm',
    wheelbase: '3.258 mm',
    groundClearance: '222 mm',
    wheelSize: '20 inch địa hình',
    topSpeed: '180 km/h',
    warrantyCar: '7 năm hoặc 160.000 km',
    warrantyBattery: '8 năm hoặc 160.000 km',
    description: 'Mẫu xe bán tải điện cỡ trung mạnh mẽ và phóng khoáng, ứng dụng công nghệ mở rộng quãng đường REEV kết hợp mô-tơ điện và động cơ 1.5L cấp điện, mang lại tầm vận hành không giới hạn hơn 1.000 km.',
    keyFeatures: [
      'Giá bán niêm yết: 860.000.000 VNĐ (đã gồm VAT)',
      'Đăng ký giữ chỗ và nhận tư vấn thời gian bàn giao tại VinFast Bình Phước',
      'Công nghệ REEV đột phá: Trên 250 km thuần điện & tổng hành trình kết hợp trên 1.000 km',
      'Kích thước hầm hố: 5.376 x 2.069 x 1.873 mm, khoảng sáng gầm 222 mm vượt mọi địa hình',
      'Thùng hàng thông minh kích thước 1.574 x 1.512 mm, tính năng mid-gate mở rộng tới 2.44 m',
      'Tải trọng thùng hàng 750 kg, sức kéo vượt trội cùng nguồn điện ngoại vi V2L cắm trại',
      'Động cơ điện công suất 380 Hp, mô-men xoắn 550 Nm vận hành mạnh mẽ',
      'Bảo hành chính hãng: Xe 7 năm/160.000 km, pin 8 năm',
      'Thiết kế cửa mở ngược đối xứng (suicide doors) độc đáo và nội thất tiện nghi như SUV hạng sang'
    ],
    imageUrl: '/assets/aistudio/vinfast-vf-wild-mau-xam-menu_58580d6e.webp',
    bannerUrl: '/assets/aistudio/wild_abbbabdd.jpg',
    colors: [
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Xám', hex: '#64748B', colorCode: 'grey', extraFee: 12000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 7900000
  },

  // 6. DÒNG XE DỊCH VỤ (XANH PLATFORM / VẬN TẢI)
  {
    id: 'miniogreen',
    name: 'Minio Green',
    versions: 'Bản Dịch vụ',
    versionBadge: 'Dịch vụ',
    tagline: 'Ô tô điện dịch vụ mini nhỏ gọn, khai thác tối ưu trên Xanh Platform',
    segment: 'Dòng xe dịch vụ',
    categoryGroup: 'service',
    categoryLabel: 'Dòng xe dịch vụ',
    seats: 4,
    bodyType: 'Hatchback',
    price: 188000000,
    versionPrices: [
      { name: 'Minio Green', price: 188000000 }
    ],
    priceNoBattery: 188000000,
    priceWithBattery: 188000000,
    rangePerCharge: 210,
    rangeDisplay: '210 km',
    rangeText: '210 km/lần sạc',
    batteryCapacity: 18.3,
    batteryDisplay: '18,3 kWh',
    seatsDisplay: '4 chỗ',
    powerKw: '30 kW',
    chargingTimeFast: 'Khoảng 34 phút (10% - 70%)',
    horsepower: 40,
    torque: 65,
    drivetrain: 'RWD (Cầu sau)',
    dimensions: '3.090 x 1.496 x 1.663 mm',
    wheelbase: '2.065 mm',
    groundClearance: '165 mm',
    wheelSize: '13 inch',
    topSpeed: '80 km/h',
    warrantyCar: '5 năm hoặc 130.000 km',
    warrantyBattery: '7 năm hoặc 160.000 km',
    description: 'Mẫu ô tô điện dịch vụ mini 4 chỗ nhỏ gọn, linh hoạt luồn lách qua các ngõ phố đông đúc, tối ưu chi phí vận hành cho nhu cầu kinh doanh vận tải (được khai thác trực tiếp trên nền tảng Xanh Platform của GSM).',
    keyFeatures: [
      'Giá bán niêm yết: 188.000.000 VNĐ (đã gồm VAT)',
      'Tư vấn cọc xe, kết nối gia nhập đội xe Xanh Platform tại VinFast Bình Phước',
      'Thiết kế 4 chỗ ngồi tiện lợi, thân xe nhỏ gọn dễ dàng xoay trở trong hẻm nhỏ',
      'Pin khả dụng 18,3 kWh di chuyển 210 km / lần sạc đầy, sạc nhanh 34 phút',
      'Chi phí vận hành siêu rẻ chỉ khoảng 150 - 200 đồng/km, thu hồi vốn chỉ 8 - 12 tháng',
      'Động cơ điện cầu sau RWD êm ái, bảo trì bảo dưỡng đơn giản và ít tốn kém',
      'Trang bị an toàn: Túi khí lái, phanh ABS, kiểm soát lực kéo TCS',
      'Bảo hành chính hãng: Xe 5 năm/130.000 km, pin cao áp 7 năm/160.000 km',
      'Được ưu tiên sạc điện và khai thác cuốc xe trên hệ sinh thái Xanh SM'
    ],
    imageUrl: '/assets/aistudio/vinfast-minio-green-mau-hong-menu_ece501a0.webp',
    bannerUrl: '/assets/aistudio/minio_99932943.jpg',
    colors: [
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Bạc', hex: '#CBD5E1', colorCode: 'silver', extraFee: 0 },
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Bạc nóc đen', hex: '#CBD5E1', roofHex: '#0F172A', colorCode: 'silver-black', extraFee: 3000000, isAdvanced: true },
      { name: 'Đen nóc vàng', hex: '#0F172A', roofHex: '#FACC15', colorCode: 'black-yellow', extraFee: 3000000, isAdvanced: true },
      { name: 'Đỏ nóc trắng', hex: '#DC2626', roofHex: '#FFFFFF', colorCode: 'red-white', extraFee: 3000000, isAdvanced: true },
      { name: 'Vàng nóc trắng', hex: '#FACC15', roofHex: '#FFFFFF', colorCode: 'yellow-white', extraFee: 3000000, isAdvanced: true },
      { name: 'Hồng ánh kim', hex: '#FB7185', colorCode: 'pink-metal', extraFee: 8000000, isAdvanced: true },
      { name: 'Xanh ngọc', hex: '#2DD4BF', colorCode: 'turquoise', extraFee: 8000000, isAdvanced: true },
      { name: 'Hồng ánh kim nóc trắng', hex: '#FB7185', roofHex: '#FFFFFF', colorCode: 'pink-white', extraFee: 11000000, isAdvanced: true },
      { name: 'Hồng ánh kim nóc xanh', hex: '#FB7185', roofHex: '#059669', colorCode: 'pink-green', extraFee: 11000000, isAdvanced: true },
      { name: 'Xanh ngọc nóc trắng', hex: '#2DD4BF', roofHex: '#FFFFFF', colorCode: 'turquoise-white', extraFee: 11000000, isAdvanced: true },
      { name: 'Xanh ngọc nóc vàng', hex: '#2DD4BF', roofHex: '#FACC15', colorCode: 'turquoise-yellow', extraFee: 11000000, isAdvanced: true }
    ],
    monthlyInstallmentEstimate: 2100000
  },
  {
    id: 'ecvan',
    name: 'EC Van',
    versions: 'Bản Dịch vụ',
    versionBadge: 'Dịch vụ',
    tagline: 'Xe tải van điện chuyên dụng chở hàng nội đô 24/7 không cấm tải',
    segment: 'Dòng xe dịch vụ',
    categoryGroup: 'service',
    categoryLabel: 'Dòng xe dịch vụ',
    seats: 2,
    bodyType: 'Van',
    price: 248000000,
    versionPrices: [
      { name: 'EC Van (Tiêu chuẩn)', price: 248000000 },
      { name: 'EC Van (Nâng cao)', price: 286000000 },
      { name: 'EC Van (Cửa trượt)', price: 306000000 }
    ],
    priceNoBattery: 248000000,
    priceWithBattery: 248000000,
    rangePerCharge: 175,
    rangeDisplay: '175 km',
    rangeText: '175 km/lần sạc',
    batteryCapacity: 18.3,
    batteryDisplay: '18,3 kWh',
    seatsDisplay: '2 chỗ',
    powerKw: '30 kW',
    chargingTimeFast: 'Khoảng 30 phút (10% - 70%)',
    horsepower: 40,
    torque: 110,
    drivetrain: 'RWD (Cầu sau khỏe tải)',
    dimensions: '3.650 x 1.530 x 1.820 mm',
    wheelbase: '2.450 mm',
    groundClearance: '165 mm',
    wheelSize: '14 inch gia cường tải trọng',
    topSpeed: '85 km/h',
    warrantyCar: '5 năm hoặc 130.000 km',
    warrantyBattery: '7 năm hoặc 160.000 km',
    description: 'Mẫu xe tải van điện chuyên dụng vận chuyển hàng hóa nội đô nhỏ gọn, linh hoạt luồn lách mọi hẻm phố, lưu thông 24/7 không cấm giờ, tối ưu chi phí vận hành và nâng cao hiệu quả kinh tế cho hộ kinh doanh & doanh nghiệp.',
    keyFeatures: [
      'Giá bán niêm yết: Tiêu chuẩn 248.000.000 VNĐ | Nâng cao 286.000.000 VNĐ | Cửa trượt 306.000.000 VNĐ',
      'Hỗ trợ tư vấn cọc xe, thủ tục hồ sơ vay kinh doanh tại Đại lý VinFast Bình Phước',
      '3 phiên bản: Tiêu chuẩn (248 Tr), Nâng cao (286 Tr), Cửa trượt (306 Tr)',
      'Khoang chở hàng thể tích rộng trên 2.5 m³, tải trọng hàng hóa lên tới 500 kg',
      'Lưu thông nội đô 24/7 không lo giờ cấm tải, bán kính quay vòng nhỏ linh hoạt',
      'Quãng đường 175 km (NEDC) / lần sạc, sạc nhanh DC 10-70% trong 30 phút',
      'Động cơ điện cầu sau RWD công suất 40 Hp, mô-men xoắn 110 Nm leo dốc khỏe tải',
      'Chi phí nhiên liệu siêu rẻ chỉ bằng 25% xe tải van xăng/dầu truyền thống',
      'Bảo hành chính hãng: Xe 5 năm/130.000 km, pin cao áp 7 năm/160.000 km',
      'Cắm sạc điện sinh hoạt gia đình tiện lợi hoặc sạc nhanh tại trạm sạc V-GREEN'
    ],
    imageUrl: '/assets/aistudio/vinfast-ec-van-mau-xanh-menu_1abddf8e.webp',
    bannerUrl: '/assets/aistudio/ec_van_37f6b07a.jpg',
    colors: [
      { name: 'Xanh lá nhạt', hex: '#86EFAC', colorCode: 'mint', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 },
      { name: 'Vàng', hex: '#FACC15', colorCode: 'yellow', extraFee: 0 },
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 }
    ],
    monthlyInstallmentEstimate: 2800000
  },
  {
    id: 'limogreen',
    name: 'Limo Green',
    versions: 'Bản Dịch vụ',
    versionBadge: 'Dịch vụ',
    tagline: 'Ô tô điện 7 chỗ cỡ lớn tối ưu cho kinh doanh vận tải dịch vụ & gia đình',
    segment: 'Dòng xe dịch vụ',
    categoryGroup: 'service',
    categoryLabel: 'Dòng xe dịch vụ',
    seats: 7,
    bodyType: 'MPV',
    price: 699000000,
    versionPrices: [
      { name: 'Limo Green', price: 699000000 }
    ],
    priceNoBattery: 699000000,
    priceWithBattery: 699000000,
    rangePerCharge: 450,
    rangeDisplay: '450 km',
    rangeText: '450 km/lần sạc',
    batteryCapacity: 60.13,
    batteryDisplay: '60,13 kWh',
    seatsDisplay: '7 chỗ',
    powerKw: '150 kW',
    chargingTimeFast: 'Khoảng 25 phút (10% - 70%)',
    horsepower: 201,
    torque: 280,
    drivetrain: 'FWD (Cầu trước)',
    dimensions: '4.740 x 1.872 x 1.728 mm',
    wheelbase: '2.840 mm',
    groundClearance: '165 mm',
    wheelSize: '18 inch hợp kim bền bỉ',
    topSpeed: '160 km/h',
    warrantyCar: '5 năm hoặc 150.000 km',
    warrantyBattery: '7 năm hoặc 160.000 km',
    description: 'Mẫu ô tô điện 7 chỗ cỡ lớn đa dụng thuộc dòng xe Green, thiết kế tối ưu cho nhu cầu kinh doanh vận tải hành khách chất lượng cao, chạy taxi, xe hợp đồng biển vàng hoặc đại gia đình với chi phí cực kỳ tiết kiệm.',
    keyFeatures: [
      'Giá bán niêm yết: 699.000.000 VNĐ (đã gồm VAT)',
      'Hỗ trợ đặt cọc, thủ tục đăng ký biển vàng & gia nhập nền tảng Xanh SM tại VinFast Bình Phước',
      'Không gian 7 chỗ ngồi thực thụ (3 hàng ghế), cửa trượt rộng rãi và sàn phẳng tiện lợi',
      'Pin khả dụng 60,13 kWh cho quãng đường di chuyển dài 450 km (NEDC) / lần sạc',
      'Động cơ điện công suất 150 kW (~201 mã lực), mô-men xoắn 280 Nm vận hành bền bỉ',
      'Chi phí vận hành siêu tiết kiệm, chỉ bằng khoảng 25% - 30% so với xe xăng cùng cỡ',
      'Hệ thống điều hòa đa vùng, cổng sạc tiện ích phân bổ đều các hàng ghế',
      'Bảo hành chính hãng: Xe 5 năm/150.000 km, pin cao áp 7 năm/160.000 km',
      'Miễn phí hoặc hưởng ưu đãi sạc điện độc quyền tại mạng lưới trạm sạc V-GREEN'
    ],
    imageUrl: '/assets/aistudio/vinfast-limo-green-mau-trang-menu_2dd3626b.webp',
    bannerUrl: '/assets/aistudio/limo_green_41ba4a85.jpg',
    colors: [
      { name: 'Bạc', hex: '#CBD5E1', colorCode: 'silver', extraFee: 0 },
      { name: 'Đen', hex: '#0F172A', colorCode: 'black', extraFee: 0 },
      { name: 'Trắng', hex: '#F8FAFC', colorCode: 'white', extraFee: 0 },
      { name: 'Đỏ', hex: '#DC2626', colorCode: 'red', extraFee: 0 }
    ],
    monthlyInstallmentEstimate: 6400000
  }
];

export interface DealershipBranch {
  name: string;
  address: string;
}

export interface DealershipConfig {
  id: string;
  brandName: string;
  tier: string;
  showroomName: string;
  shortRegionName: string;
  role: string;
  coverageArea: string;
  hotline?: string;
  branches: DealershipBranch[];
  avatarUrl: string;
  bannerPcUrl: string;
  bannerMobileUrl: string;
}

const SHARED_ASSETS = {
  brandName: 'CỔNG THÔNG TIN VINFAST',
  tier: '3S',
  role: 'Tư vấn bán hàng',
  avatarUrl: 'https://w.ladicdn.com/5d9a96b88c0aa631d811d695/thiet_ke_chua_co_ten-removebg-preview-20261029033424-lym7k.png',
  bannerPcUrl: 'https://w.ladicdn.com/5d9a96b88c0aa631d811d695/len-doi-xe-dien-giua-pho-hien-dai-20261029025733-pvogp.png',
  bannerMobileUrl: 'https://w.ladicdn.com/5d9a96b88c0aa631d811d695/len-doi-xe-dien-chon-vinfast-20261029025733-5m8uy.png'
};

const BINH_PHUOC_BRANCHES: DealershipBranch[] = [
  { name: 'VinFast Bình Phước', address: 'Đường D1, KCN Bắc Đồng Phú, Phường Đồng Phú, TP Đồng Nai' },
  { name: 'CN Đồng Xoài', address: '525 Phú Riềng Đỏ, P Bình Phước, TP Đồng Nai' },
  { name: 'CN Phước Long', address: 'KP Bình Giang, P. Phước Long, TP Đồng Nai' },
  { name: 'CN Bình Long', address: 'Đường Nguyễn Huệ, P Bình Long, TP Đồng Nai' }
];

export const BRANCH_CONFIGS: Record<string, DealershipConfig> = {
  home: {
    id: 'home',
    ...SHARED_ASSETS,
    showroomName: 'VinFast 3S',
    shortRegionName: '3S',
    coverageArea: 'Hỗ trợ tư vấn & giao xe Toàn Quốc',
    branches: [
      { name: 'VinFast 3S', address: 'Đường D1, KCN Bắc Đồng Phú, Phường Đồng Phú, TP Đồng Nai' },
      { name: 'CN Đồng Xoài', address: '525 Phú Riềng Đỏ, P Bình Phước, TP Đồng Nai' },
      { name: 'CN Phước Long', address: 'KP Bình Giang, P. Phước Long, TP Đồng Nai' },
      { name: 'CN Bình Long', address: 'Đường Nguyễn Huệ, P Bình Long, TP Đồng Nai' }
    ]
  },
  'binh-phuoc': {
    id: 'binh-phuoc',
    ...SHARED_ASSETS,
    showroomName: 'VinFast Bình Phước',
    shortRegionName: 'BÌNH PHƯỚC',
    coverageArea: 'Khu vực Bình Phước & Đồng Nai & Toàn Quốc',
    branches: BINH_PHUOC_BRANCHES
  },
  'dong-xoai': {
    id: 'dong-xoai',
    ...SHARED_ASSETS,
    showroomName: 'VinFast Đồng Xoài',
    shortRegionName: 'ĐỒNG XOÀI',
    coverageArea: 'Khu vực Bình Phước & Đồng Nai & Toàn Quốc',
    branches: BINH_PHUOC_BRANCHES
  },
  'dak-lak': {
    id: 'dak-lak',
    ...SHARED_ASSETS,
    showroomName: 'VinFast Đắk Lắk',
    shortRegionName: 'ĐẮK LẮK',
    coverageArea: 'Khu vực Đắk Lắk & Tây Nguyên & Toàn Quốc',
    hotline: '083 576 7879',
    branches: [
      { name: 'VinFast Đắk Lắk', address: 'Km9, Quốc Lộ 14, Phường Tân An, Tỉnh Đắk Lắk.' }
    ]
  }
};

// Mặc định sử dụng cấu hình Trang chủ (VinFast 3S) khi truy cập "/"
export const DEALERSHIP_INFO: DealershipConfig = BRANCH_CONFIGS['home'];

// Chuẩn hóa branchId trên URL (ví dụ: "/binh-phuoc", "/dong-xoai", "/dak-lak")
export const getDealershipByBranchId = (rawBranchId?: string | null): DealershipConfig => {
  if (!rawBranchId) return BRANCH_CONFIGS['home'];

  const decoded = decodeURIComponent(rawBranchId).trim();
  if (!decoded) return BRANCH_CONFIGS['home'];

  const normalizedSlug = decoded
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const compactSlug = normalizedSlug.replace(/-/g, '');

  if (normalizedSlug === 'binh-phuoc' || compactSlug === 'binhphuoc' || compactSlug === 'bp') {
    return BRANCH_CONFIGS['binh-phuoc'];
  }
  if (normalizedSlug === 'dong-xoai' || compactSlug === 'dongxoai' || compactSlug === 'dx') {
    return BRANCH_CONFIGS['dong-xoai'];
  }
  if (
    normalizedSlug === 'dak-lak' ||
    compactSlug === 'daklak' ||
    normalizedSlug === 'dac-lac' ||
    compactSlug === 'daclac' ||
    compactSlug === 'dl'
  ) {
    return BRANCH_CONFIGS['dak-lak'];
  }

  if (BRANCH_CONFIGS[normalizedSlug]) {
    return BRANCH_CONFIGS[normalizedSlug];
  }

  return BRANCH_CONFIGS['home'];
};
