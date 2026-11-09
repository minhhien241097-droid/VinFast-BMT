import React, { useState, useRef, useEffect } from 'react';
import { VINFAST_CARS, DEALERSHIP_INFO } from '../data/cars';
import { CarModel } from '../types';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Calculator,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

interface AiAdvisorWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectCarDetail: (car: CarModel) => void;
  onOpenCalculatorForCar: (car: CarModel) => void;
}

interface QuickReply {
  label: string;
  action: string;
}

interface ComparisonData {
  carA: CarModel;
  carB: CarModel;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  cars?: CarModel[];
  comparison?: ComparisonData;
  quickReplies?: QuickReply[];
}

const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { label: '💰 Tư vấn theo tầm tiền', action: 'PROMPT_BUDGET' },
  { label: '🚗 Chọn xe theo nhu cầu', action: 'PROMPT_NEED' },
  { label: '🏦 Tính trả góp & Trả trước', action: 'PROMPT_INSTALLMENT' },
  { label: '⚖️ So sánh 2 dòng xe', action: 'PROMPT_COMPARE' },
  { label: '🎁 Chương trình ưu đãi', action: 'PROMPT_PROMO' }
];

const formatCurrency = (val: number) => {
  return val.toLocaleString('vi-VN') + ' đ';
};

const formatMillion = (val: number) => {
  if (val >= 1000000000) {
    const billions = (val / 1000000000).toFixed(2).replace(/\.?0+$/, '');
    return `${billions} tỷ`;
  }
  return `${Math.round(val / 1000000)} triệu`;
};

// Normalize Vietnamese text for smart keyword matching
const normalizeVi = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

export const AiAdvisorWidget: React.FC<AiAdvisorWidgetProps> = ({
  isOpen,
  onToggle,
  onSelectCarDetail,
  onOpenCalculatorForCar
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Xin chào Quý khách! 👋 Em là Trợ lý AI Tư vấn 24/7 của ${DEALERSHIP_INFO.showroomName} (Đại lý ${DEALERSHIP_INFO.tier} Chính hãng).\n\nEm có thể giúp anh/chị tính giá lăn bánh, trả góp ngân hàng, so sánh thông số xe hoặc tìm mẫu xe phù hợp nhất với tầm tài chính. Anh/chị đang quan tâm nội dung nào ạ?`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      quickReplies: DEFAULT_QUICK_REPLIES
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const findMentionedCars = (query: string): CarModel[] => {
    const q = normalizeVi(query);
    const matched: CarModel[] = [];

    const rules: { id: string; keywords: string[] }[] = [
      { id: 'vf2', keywords: ['vf2', 'vf 2'] },
      { id: 'vf3', keywords: ['vf3', 'vf 3'] },
      { id: 'vf5', keywords: ['vf5', 'vf 5'] },
      { id: 'vf6', keywords: ['vf6', 'vf 6'] },
      { id: 'vf7', keywords: ['vf7', 'vf 7'] },
      { id: 'vf8', keywords: ['vf8', 'vf 8'] },
      { id: 'vf9', keywords: ['vf9', 'vf 9'] },
      { id: 'vfwild', keywords: ['wild', 'vf wild', 'ban tai'] },
      { id: 'lachong900lx', keywords: ['lac hong', '900 lx', '900lx'] },
      { id: 'miniogreen', keywords: ['minio', 'minio green'] },
      { id: 'ecvan', keywords: ['ec van', 'ecvan', 'tai van', 'xe van'] },
      { id: 'limogreen', keywords: ['limo', 'limo green'] }
    ];

    for (const rule of rules) {
      if (rule.keywords.some((kw) => q.includes(kw))) {
        const car = VINFAST_CARS.find((c) => c.id === rule.id);
        if (car && !matched.some((m) => m.id === car.id)) {
          matched.push(car);
        }
      }
    }

    return matched;
  };

  const buildCarLoanSummary = (car: CarModel): string => {
    const downPayment20 = Math.round(car.price * 0.2);
    const regPlateEstimate = 2391000; // Phí biển số + đường bộ + đăng kiểm (100k) + BH TNDS bắt buộc tại tỉnh
    const totalUpfront = downPayment20 + regPlateEstimate;
    return (
      `📌 **Dự toán trả góp ${car.name}** (Miễn 100% lệ phí trước bạ):\n` +
      `• Giá niêm yết: **${formatCurrency(car.price)}**\n` +
      `• Trả trước 20% giá xe: **~${formatMillion(downPayment20)}**\n` +
      `• Tổng tiền chuẩn bị lăn bánh (gồm biển số, đăng kiểm): **~${formatMillion(totalUpfront)}**\n` +
      `• Góp hàng tháng dự kiến: **~${formatCurrency(car.monthlyInstallmentEstimate)}/tháng**\n` +
      `• Quãng đường: **${car.rangeText}** | Số chỗ: **${car.seatsDisplay}**`
    );
  };

  const generateBotReply = (userText: string, actionCode?: string): Omit<ChatMessage, 'id' | 'sender' | 'timestamp'> => {
    const q = normalizeVi(userText);

    // 1. Handle structured Quick Actions
    if (actionCode === 'PROMPT_BUDGET') {
      return {
        text: 'Dạ anh/chị đang dự kiến tầm tài chính mua xe (hoặc số tiền trả trước) khoảng bao nhiêu để em lọc mẫu xe phù hợp nhất ạ?',
        quickReplies: [
          { label: '💵 Trả trước 50 - 90 triệu', action: 'BUDGET_DOWN_LOW' },
          { label: '💰 Dưới 300 triệu (Mua thẳng)', action: 'BUDGET_UNDER_300' },
          { label: '💰 Từ 450 - 700 triệu', action: 'BUDGET_450_700' },
          { label: '💰 Từ 700 triệu - 1,2 tỷ', action: 'BUDGET_700_1200' },
          { label: '👑 Trên 1,2 tỷ (Cao cấp)', action: 'BUDGET_OVER_1200' }
        ]
      };
    }

    if (actionCode === 'BUDGET_DOWN_LOW' || actionCode === 'BUDGET_UNDER_300') {
      const cars = VINFAST_CARS.filter((c) => ['vf2', 'vf3', 'ecvan', 'miniogreen'].includes(c.id));
      return {
        text: 'Với tầm tài chính tiết kiệm (hoặc **trả trước chỉ từ 45 – 70 triệu đồng** khi vay ngân hàng 80%), đây là các dòng xe đô thị & kinh doanh cực kỳ kinh tế, miễn 100% lệ phí trước bạ:',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh VF 3 và VF 2', action: 'COMPARE_vf3_vf2' },
          { label: '🏦 Tính trả góp VF 3', action: 'LOAN_vf3' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'BUDGET_450_700') {
      const cars = VINFAST_CARS.filter((c) => ['vf5', 'vf6', 'limogreen'].includes(c.id));
      return {
        text: 'Trong phân khúc **450 – 700 triệu đồng** (trả trước từ **100 – 150 triệu**), anh/chị có các lựa chọn SUV 5 chỗ gia đình và MPV 7 chỗ cực kỳ rộng rãi, trang bị ngập tràn công nghệ:',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh VF 5 và VF 6', action: 'COMPARE_vf5_vf6' },
          { label: '🏦 Tính trả góp VF 5', action: 'LOAN_vf5' },
          { label: '🏦 Tính trả góp VF 6', action: 'LOAN_vf6' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'BUDGET_700_1200') {
      const cars = VINFAST_CARS.filter((c) => ['vf7', 'vf8', 'vfwild'].includes(c.id));
      return {
        text: 'Trong tầm giá **700 triệu – 1,2 tỷ đồng**, đây là 3 mẫu SUV & Bán tải hạng C-D mạnh mẽ, sang trọng và bán chạy hàng đầu tại VinFast Bình Phước:',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh VF 7 và VF 8', action: 'COMPARE_vf7_vf8' },
          { label: '⚖️ So sánh VF 8 và VF Wild', action: 'COMPARE_vf8_vfwild' },
          { label: '🏦 Tính trả góp VF 8', action: 'LOAN_vf8' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'BUDGET_OVER_1200') {
      const cars = VINFAST_CARS.filter((c) => ['vf9', 'lachong900lx'].includes(c.id));
      return {
        text: 'Dành cho phân khúc **Chủ tịch & Gia đình thượng lưu**, VinFast sở hữu SUV 7 chỗ Full-size **VF 9** và tuyệt tác siêu sang **Lạc Hồng 900 LX**:',
        cars,
        quickReplies: [
          { label: '🏦 Tính trả góp VF 9', action: 'LOAN_vf9' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'PROMPT_NEED') {
      return {
        text: 'Anh/chị đang tìm mua xe phục vụ mục đích chính nào dưới đây ạ?',
        quickReplies: [
          { label: '🏙️ Đi phố nhỏ gọn, đưa đón con', action: 'NEED_CITY' },
          { label: '👨‍👩‍👧 Gia đình 5 chỗ gầm cao', action: 'NEED_FAMILY_5' },
          { label: '👨‍👩‍👧‍👦 Gia đình 7 chỗ rộng rãi', action: 'NEED_FAMILY_7' },
          { label: '🛻 Bán tải đi địa hình & công trình', action: 'NEED_PICKUP' },
          { label: '🚕 Chạy dịch vụ / Chở hàng kinh tế', action: 'NEED_SERVICE' }
        ]
      };
    }

    if (actionCode === 'NEED_CITY') {
      const cars = VINFAST_CARS.filter((c) => ['vf3', 'vf2', 'vf5'].includes(c.id));
      return {
        text: 'Để đi lại trong phố, đưa đón con đi học và che mưa che nắng an toàn, **VF 3**, **VF 2** và **VF 5** là 3 mẫu xe linh hoạt nhất, quay đầu dễ dàng và chi phí sạc điện chỉ vài trăm nghìn mỗi tháng:',
        cars,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (actionCode === 'NEED_FAMILY_5') {
      const cars = VINFAST_CARS.filter((c) => ['vf5', 'vf6', 'vf7', 'vf8'].includes(c.id));
      return {
        text: 'Dành cho **gia đình 5 chỗ gầm cao**, VinFast có đầy đủ từ cỡ A-SUV đến D-SUV với hệ thống trợ lái thông minh ADAS và cốp rộng:',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh VF 6 và VF 7', action: 'COMPARE_vf6_vf7' },
          { label: '⚖️ So sánh VF 7 và VF 8', action: 'COMPARE_vf7_vf8' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'NEED_FAMILY_7') {
      const cars = VINFAST_CARS.filter((c) => ['limogreen', 'vf9'].includes(c.id));
      return {
        text: 'Nếu gia đình đông người cần **7 chỗ ngồi thực thụ (3 hàng ghế rộng rãi)**, anh/chị có thể chọn **Limo Green** (699 triệu - siêu tiết kiệm) hoặc **VF 9** (SUV hạng E Full-size đẳng cấp):',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh Limo Green và VF 9', action: 'COMPARE_limogreen_vf9' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'NEED_PICKUP') {
      const wild = VINFAST_CARS.find((c) => c.id === 'vfwild');
      return {
        text: 'Với nhu cầu bán tải đa dụng, **VinFast VF Wild** là mẫu bán tải cỡ trung đột phá ứng dụng công nghệ mở rộng quãng đường **REEV (kết hợp xăng + điện)** cho tầm vận hành hỗn hợp **hơn 1.000 km**, không lo trạm sạc khi đi rừng hay công trình xa!',
        cars: wild ? [wild] : [],
        quickReplies: [
          { label: '🏦 Dự toán trả góp VF Wild', action: 'LOAN_vfwild' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'NEED_SERVICE') {
      const cars = VINFAST_CARS.filter((c) => ['miniogreen', 'vf5', 'limogreen', 'ecvan'].includes(c.id));
      return {
        text: 'Dành cho anh/chị mua xe **chạy dịch vụ Xanh SM, chạy hợp đồng hoặc chở hàng nội đô**, đây là các dòng xe tối ưu chi phí vận hành (chỉ ~200đ - 400đ/km), thu hồi vốn cực nhanh:',
        cars,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (actionCode === 'PROMPT_INSTALLMENT') {
      return {
        text: 'Hiện tại Đại lý VinFast 3S Bình Phước hỗ trợ **vay trả góp lên đến 80% giá trị xe** trong tối đa **8 năm (96 tháng)**, thủ tục duyệt hồ sơ nhanh trong ngày.\n\nAnh/chị bấm chọn dòng xe bên dưới để xem ngay số tiền trả trước 20% và tiền góp mỗi tháng nhé:',
        quickReplies: [
          { label: '🏦 Trả góp VF 3', action: 'LOAN_vf3' },
          { label: '🏦 Trả góp VF 5', action: 'LOAN_vf5' },
          { label: '🏦 Trả góp VF 6', action: 'LOAN_vf6' },
          { label: '🏦 Trả góp VF 7', action: 'LOAN_vf7' },
          { label: '🏦 Trả góp VF 8', action: 'LOAN_vf8' },
          { label: '🏦 Trả góp VF Wild', action: 'LOAN_vfwild' },
          { label: '🏦 Trả góp Limo Green', action: 'LOAN_limogreen' }
        ]
      };
    }

    if (actionCode && actionCode.startsWith('LOAN_')) {
      const carId = actionCode.replace('LOAN_', '');
      const car = VINFAST_CARS.find((c) => c.id === carId);
      if (car) {
        return {
          text: buildCarLoanSummary(car),
          cars: [car],
          quickReplies: [
            { label: '🏦 Xem trả góp mẫu xe khác', action: 'PROMPT_INSTALLMENT' },
            { label: '🔙 Menu chính', action: 'MAIN_MENU' }
          ]
        };
      }
    }

    if (actionCode === 'PROMPT_COMPARE') {
      return {
        text: 'Anh/chị có thể **bấm chọn cặp xe phổ biến bên dưới** hoặc **gõ trực tiếp tên 2 xe bất kỳ** vào ô chat (ví dụ: *"So sánh VF 5 và VF 6"* hoặc *"VF 8 với VF Wild"*) để em lập bảng đối chiếu ngay nhé:',
        quickReplies: [
          { label: '⚖️ VF 3 vs VF 2', action: 'COMPARE_vf3_vf2' },
          { label: '⚖️ VF 3 vs VF 5', action: 'COMPARE_vf3_vf5' },
          { label: '⚖️ VF 5 vs VF 6', action: 'COMPARE_vf5_vf6' },
          { label: '⚖️ VF 6 vs VF 7', action: 'COMPARE_vf6_vf7' },
          { label: '⚖️ VF 7 vs VF 8', action: 'COMPARE_vf7_vf8' },
          { label: '⚖️ VF 8 vs VF Wild', action: 'COMPARE_vf8_vfwild' }
        ]
      };
    }

    if (actionCode && actionCode.startsWith('COMPARE_')) {
      const parts = actionCode.replace('COMPARE_', '').split('_');
      const carA = VINFAST_CARS.find((c) => c.id === parts[0]);
      const carB = VINFAST_CARS.find((c) => c.id === parts[1]);
      if (carA && carB) {
        return {
          text: `Bảng so sánh nhanh giữa **${carA.name}** và **${carB.name}**:`,
          comparison: { carA, carB },
          quickReplies: [
            { label: '⚖️ So sánh cặp xe khác', action: 'PROMPT_COMPARE' },
            { label: '🔙 Menu chính', action: 'MAIN_MENU' }
          ]
        };
      }
    }

    if (actionCode === 'PROMPT_PROMO') {
      return {
        text:
          `🎁 **Chương trình Ưu đãi Khách hàng tại ${DEALERSHIP_INFO.showroomName} (Đại lý 3S):**\n\n` +
          `🔥 **1. Chương trình "Mãnh liệt Tinh thần Việt Nam 2" (Mãnh liệt Tương lai Xanh 2):**\n` +
          `• Áp dụng cho **Khách hàng thông thường** (giảm 3% – 9% giá xe) và **Khách hàng Công an / Quân đội** (giảm 6% – 9% giá xe).\n` +
          `• *Lưu ý: Chương trình diễn ra trong thời gian ngắn.*\n\n` +
          `🎫 **2. Ưu đãi giảm giá cho khách hàng có Voucher (Sở hữu xe xăng VinFast):**\n` +
          `• Chủ xe **VinFast Fadil:** Tặng Voucher giảm **30.000.000đ**\n` +
          `• Chủ xe **VinFast Lux A:** Tặng Voucher giảm **60.000.000đ**\n` +
          `• Chủ xe **VinFast Lux SA:** Tặng Voucher giảm **80.000.000đ**\n` +
          `*(Không áp dụng đồng thời với các chương trình khác)*.\n\n` +
          `✅ **3. Miễn 100% lệ phí trước bạ** theo chính sách Nhà nước cho ô tô điện.\n\n` +
          `🏦 **4. Hỗ trợ vay ngân hàng:** Vay lên tới 80% – 85% giá trị xe trong tối đa 8 năm với lãi suất ưu đãi.`,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (actionCode === 'MAIN_MENU') {
      return {
        text: 'Dạ em gửi lại danh mục hỗ trợ nhanh, anh/chị cần xem mục nào cứ bấm chọn hoặc gõ câu hỏi cho em nhé:',
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    // 3. Free-text Natural Language Understanding (NLP)
    const mentionedCars = findMentionedCars(userText);

    // If user mentions 2 cars -> Auto Compare!
    if (mentionedCars.length >= 2) {
      return {
        text: `Em gửi anh/chị bảng so sánh chi tiết giữa **${mentionedCars[0].name}** và **${mentionedCars[1].name}**:`,
        comparison: { carA: mentionedCars[0], carB: mentionedCars[1] },
        quickReplies: [
          { label: `🏦 Tính trả góp ${mentionedCars[0].name}`, action: `LOAN_${mentionedCars[0].id}` },
          { label: `🏦 Tính trả góp ${mentionedCars[1].name}`, action: `LOAN_${mentionedCars[1].id}` }
        ]
      };
    }

    // If user mentions 1 specific car
    if (mentionedCars.length === 1) {
      const car = mentionedCars[0];
      const isAskingLoan =
        q.includes('tra gop') ||
        q.includes('vay') ||
        q.includes('tra truoc') ||
        q.includes('moi thang') ||
        q.includes('hang thang') ||
        q.includes('lan banh');

      if (isAskingLoan) {
        return {
          text: buildCarLoanSummary(car),
          cars: [car],
          quickReplies: DEFAULT_QUICK_REPLIES
        };
      }

      const versionsText = car.versionPrices
        .map((v) => `• ${v.name}: **${formatCurrency(v.price)}**`)
        .join('\n');

      return {
        text:
          `🚘 **Thông tin & Giá niêm yết ${car.name}:**\n` +
          `${versionsText}\n\n` +
          `• Phân khúc: **${car.segment}** (${car.seatsDisplay})\n` +
          `• Tầm vận hành: **${car.rangeText}**\n` +
          `• Công suất: **${car.horsepower} Hp** | Sạc nhanh: **${car.chargingTimeFast}**\n` +
          `• Bảo hành xe: **${car.warrantyCar}**\n` +
          `• Trả góp dự kiến: **Chỉ từ ${formatCurrency(car.monthlyInstallmentEstimate)}/tháng** (Trả trước ~${formatMillion(Math.round(car.price * 0.2))})`,
        cars: [car],
        quickReplies: [
          { label: `🏦 Tính trả góp ${car.name}`, action: `LOAN_${car.id}` },
          { label: '⚖️ So sánh với xe khác', action: 'PROMPT_COMPARE' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    // Check budget numbers in free text (e.g. "300 triệu", "500tr", "dưới 600")
    const millionMatch = q.match(/(\d+)\s*(trieu|tr\b|cu\b)/);
    if (millionMatch) {
      const amountMillion = parseInt(millionMatch[1], 10);
      if (amountMillion <= 180) {
        // Likely asking about down payment (trả trước)
        const maxCarPrice = amountMillion * 5 * 1000000;
        const matchedByDown = VINFAST_CARS.filter((c) => c.price <= maxCarPrice + 80000000).slice(0, 4);
        return {
          text: `Với số tiền trả trước khoảng **${amountMillion} triệu đồng** (tương đương trả trước 20% khi vay ngân hàng), anh/chị hoàn toàn có thể sở hữu ngay các dòng xe dưới đây:`,
          cars: matchedByDown,
          quickReplies: DEFAULT_QUICK_REPLIES
        };
      } else {
        const targetVnd = amountMillion * 1000000;
        const matchedByPrice = VINFAST_CARS.filter(
          (c) => c.price <= targetVnd + 120000000 && c.price >= targetVnd - 250000000
        );
        const resultCars = matchedByPrice.length > 0 ? matchedByPrice : VINFAST_CARS.slice(0, 3);
        return {
          text: `Với tầm ngân sách khoảng **${amountMillion} triệu đồng**, em gợi ý các mẫu xe VinFast phù hợp nhất (đang được miễn 100% lệ phí trước bạ):`,
          cars: resultCars,
          quickReplies: DEFAULT_QUICK_REPLIES
        };
      }
    }

    // Check general topics
    if (q.includes('tra gop') || q.includes('ngan hang') || q.includes('lai suat') || q.includes('tra truoc')) {
      return generateBotReply(userText, 'PROMPT_INSTALLMENT');
    }

    if (q.includes('so sanh') || q.includes('khac nhau') || q.includes('nen mua')) {
      return generateBotReply(userText, 'PROMPT_COMPARE');
    }

    if (q.includes('khuyen mai') || q.includes('uu dai') || q.includes('truoc ba') || q.includes('qua tang') || q.includes('voucher') || q.includes('manh liet')) {
      return generateBotReply(userText, 'PROMPT_PROMO');
    }

    if (q.includes('lai thu') || q.includes('xem xe') || q.includes('dia chi') || q.includes('showroom') || q.includes('o dau')) {
      return {
        text:
          `📍 **Hệ thống Showroom ${DEALERSHIP_INFO.showroomName} (Đại lý ${DEALERSHIP_INFO.tier}):**\n` +
          `• **VinFast Bình Phước:** Đường D1, KCN Bắc Đồng Phú, Phường Đồng Phú, TP. Đồng Nai.\n` +
          `• **CN Đồng Xoài:** 525 Phú Riềng Đỏ, P. Bình Phước, TP. Đồng Nai.\n` +
          `• **CN Phước Long:** KP Bình Giang, P. Phước Long, TP. Đồng Nai.\n` +
          `• **CN Bình Long:** Đường Nguyễn Huệ, P. Bình Long, TP. Đồng Nai.`,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (q.includes('7 cho')) {
      return generateBotReply(userText, 'NEED_FAMILY_7');
    }

    if (q.includes('5 cho') || q.includes('gia dinh')) {
      return generateBotReply(userText, 'NEED_FAMILY_5');
    }

    if (q.includes('dich vu') || q.includes('xanh sm') || q.includes('taxi') || q.includes('cho hang')) {
      return generateBotReply(userText, 'NEED_SERVICE');
    }

    if (q === 'xin chao' || q === 'chao' || q === 'hi' || q === 'hello' || q === 'alo') {
      return {
        text: `Dạ **${DEALERSHIP_INFO.showroomName}** xin chào anh/chị ạ! 👋 Anh/chị đang quan tâm dòng xe nào hay cần tính giá lăn bánh, trả góp cứ nhắn em hỗ trợ ngay nhé!`,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    // Default fallback
    return {
      text:
        `Dạ em có thể hỗ trợ anh/chị tra cứu bảng giá niêm yết, dự toán chi phí lăn bánh, tính trả góp ngân hàng hoặc so sánh thông số kỹ thuật các dòng xe VinFast. Anh/chị bấm chọn các mục bên dưới nhé:`,
      quickReplies: DEFAULT_QUICK_REPLIES
    };
  };

  const handleUserAction = (displayText: string, actionCode?: string) => {
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: displayText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const naturalDelayMs = Math.floor(Math.random() * 800) + 1200;

    setTimeout(() => {
      const replyData = generateBotReply(displayText, actionCode);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        ...replyData
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, naturalDelayMs);
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setInputValue('');
    handleUserAction(trimmed);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: `Xin chào Quý khách! 👋 Em là Trợ lý AI Tư vấn 24/7 của ${DEALERSHIP_INFO.showroomName}.\nAnh/chị cần tính giá lăn bánh, trả góp hay so sánh dòng xe nào cứ chọn bên dưới nhé!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: DEFAULT_QUICK_REPLIES
      }
    ]);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className={line.trim() === '' ? 'h-2' : 'leading-relaxed break-words'}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={j} className="font-bold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[410px] max-w-full max-h-[80dvh] h-[560px] sm:h-[620px] bg-white rounded-[24px] shadow-[0_16px_48px_rgba(15,23,42,0.24)] border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1464F4] text-white px-4 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-xs border border-white/30 flex items-center justify-center">
              <Bot size={22} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0F172A] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm tracking-tight">Trợ Lý AI VinFast 3S</h3>
              <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} /> 24/7
              </span>
            </div>
            <p className="text-[11px] text-blue-100">
              Báo giá lăn bánh • Trả góp • So sánh xe tự động
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleResetChat}
            title="Làm mới cuộc trò chuyện"
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={onToggle}
            title="Đóng cửa sổ chat"
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Top Quick Bar */}
      <div className="bg-slate-50 border-b border-slate-200/70 px-3.5 py-2 flex items-center justify-between text-[11px] shrink-0">
        <span className="text-slate-600 font-medium flex items-center gap-1">
          <ShieldCheck size={13} className="text-[#1464F4]" />
          Đại lý 3S Bình Phước
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] shadow-2xs break-words ${
                msg.sender === 'user'
                  ? 'bg-[#1464F4] text-white rounded-br-xs'
                  : 'bg-white text-slate-700 border border-slate-200/80 rounded-bl-xs'
              }`}
            >
              {msg.sender === 'bot' ? (
                <div className="space-y-1">{renderFormattedText(msg.text)}</div>
              ) : (
                <p className="leading-relaxed break-words">{msg.text}</p>
              )}
            </div>

            {/* If message contains Car Cards */}
            {msg.cars && msg.cars.length > 0 && (
              <div className="w-full mt-2.5 space-y-2">
                {msg.cars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-xl border border-slate-200/90 p-2.5 shadow-2xs hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-20 h-14 object-contain bg-slate-50 rounded-lg p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            {car.name}
                          </h4>
                          <span className="text-[10px] font-bold bg-blue-50 text-[#1464F4] px-2 py-0.5 rounded-md shrink-0">
                            {car.seatsDisplay}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-[#1464F4] mt-0.5">
                          {formatCurrency(car.price)}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          ⚡ {car.rangeDisplay} • Góp ~{formatMillion(car.monthlyInstallmentEstimate)}/tháng
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onSelectCarDetail(car)}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                      >
                        Chi tiết
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCalculatorForCar(car)}
                        className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-[#1464F4] font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Calculator size={11} />
                        Dự toán & Trả góp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* If message contains Side-by-Side Comparison Table */}
            {msg.comparison && (
              <div className="w-full mt-2.5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs text-xs">
                <div className="grid grid-cols-3 bg-slate-900 text-white font-bold py-2 px-2.5 text-[11px]">
                  <div>Thông số</div>
                  <div className="text-center text-blue-300">{msg.comparison.carA.name}</div>
                  <div className="text-center text-emerald-300">{msg.comparison.carB.name}</div>
                </div>
                <div className="divide-y divide-slate-100 text-[11px]">
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center">
                    <span className="text-slate-500 font-medium">Giá niêm yết</span>
                    <span className="text-center font-bold text-slate-900">
                      {formatMillion(msg.comparison.carA.price)}
                    </span>
                    <span className="text-center font-bold text-slate-900">
                      {formatMillion(msg.comparison.carB.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center bg-slate-50/60">
                    <span className="text-slate-500 font-medium">Trả trước 20%</span>
                    <span className="text-center font-semibold text-[#1464F4]">
                      ~{formatMillion(Math.round(msg.comparison.carA.price * 0.2))}
                    </span>
                    <span className="text-center font-semibold text-emerald-600">
                      ~{formatMillion(Math.round(msg.comparison.carB.price * 0.2))}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center">
                    <span className="text-slate-500 font-medium">Số chỗ ngồi</span>
                    <span className="text-center font-semibold">{msg.comparison.carA.seatsDisplay}</span>
                    <span className="text-center font-semibold">{msg.comparison.carB.seatsDisplay}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center bg-slate-50/60">
                    <span className="text-slate-500 font-medium">Quãng đường</span>
                    <span className="text-center font-semibold">{msg.comparison.carA.rangeDisplay}</span>
                    <span className="text-center font-semibold">{msg.comparison.carB.rangeDisplay}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center">
                    <span className="text-slate-500 font-medium">Công suất</span>
                    <span className="text-center font-semibold">{msg.comparison.carA.horsepower} Hp</span>
                    <span className="text-center font-semibold">{msg.comparison.carB.horsepower} Hp</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center bg-slate-50/60">
                    <span className="text-slate-500 font-medium">Góp/tháng</span>
                    <span className="text-center font-semibold">
                      ~{formatMillion(msg.comparison.carA.monthlyInstallmentEstimate)}
                    </span>
                    <span className="text-center font-semibold">
                      ~{formatMillion(msg.comparison.carB.monthlyInstallmentEstimate)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onOpenCalculatorForCar(msg.comparison!.carA)}
                    className="py-1.5 bg-[#1464F4] text-white font-bold text-[11px] rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Dự toán {msg.comparison.carA.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenCalculatorForCar(msg.comparison!.carB)}
                    className="py-1.5 bg-emerald-600 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-700 cursor-pointer"
                  >
                    Dự toán {msg.comparison.carB.name}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Reply Chips */}
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {msg.quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUserAction(qr.label, qr.action)}
                    className="px-2.5 py-1.5 bg-white hover:bg-[#EBF3FF] text-slate-700 hover:text-[#1464F4] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2.5 animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1464F4] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Bot size={14} />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#1464F4] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#1464F4] rounded-full animate-bounce [animation-delay:180ms]" />
                <span className="w-2 h-2 bg-[#1464F4] rounded-full animate-bounce [animation-delay:360ms]" />
              </div>
              <span className="text-[11px] text-slate-500 font-medium italic">
                Đang soạn tin nhắn...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form
        onSubmit={handleSendText}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          enterKeyHint="send"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSendText();
            }
          }}
          placeholder="Nhập tên xe hoặc tầm tiền của bạn..."
          className="flex-1 min-w-0 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-[16px] sm:text-[13px] text-slate-800 px-3.5 py-2.5 rounded-full border border-transparent focus:border-[#1464F4] focus:outline-hidden transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-9 h-9 rounded-full bg-[#1464F4] hover:bg-blue-700 disabled:bg-slate-200 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
